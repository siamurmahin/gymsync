import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { goalLabel } from '@/lib/utils'
import { DeleteWorkoutButton } from '@/components/DeleteWorkoutButton'
import { DashboardWeeklyPlan } from '@/components/DashboardWeeklyPlan'
import type { DayPlan, Goal, WorkoutSession } from '@/lib/types'
import { Plus, Trophy, Flame, Calendar } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch last 14 days of sessions — client component filters by local week
  const twoWeeksAgo = new Date()
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)

  const [{ data: profile }, { data: sessions }, { data: recentSessions }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase
      .from('workout_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('workout_sessions')
      .select('created_at, completed_at')
      .eq('user_id', user.id)
      .gte('created_at', twoWeeksAgo.toISOString())
      .order('created_at', { ascending: false }),
  ])

  if (!profile?.onboarded) redirect('/onboarding')

  const completed = (sessions ?? []).filter((s: WorkoutSession) => s.completed_at)
  const weeklyPlan: DayPlan[] | null = profile.weekly_plan as DayPlan[] | null
  const trainingDays = weeklyPlan ? weeklyPlan.filter(d => !d.isRest).length : 0

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const doneThisWeek = (recentSessions ?? [])
    .filter(s => s.completed_at && new Date(s.created_at) >= sevenDaysAgo).length

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-50">
          Hey, {profile.username ?? 'athlete'} 👋
        </h1>
        <p className="text-sm text-zinc-400">
          Goal: <span className="text-emerald-400 font-medium">{goalLabel(profile.goal as Goal)}</span>
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="text-center space-y-1">
          <Trophy className="mx-auto h-5 w-5 text-yellow-400" />
          <p className="text-2xl font-bold text-zinc-50">{completed.length}</p>
          <p className="text-xs text-zinc-500">Completed</p>
        </Card>
        <Card className="text-center space-y-1">
          <Flame className="mx-auto h-5 w-5 text-orange-400" />
          <p className="text-2xl font-bold text-zinc-50">{doneThisWeek}</p>
          <p className="text-xs text-zinc-500">This week</p>
        </Card>
        <Card className="text-center space-y-1">
          <Calendar className="mx-auto h-5 w-5 text-blue-400" />
          <p className="text-2xl font-bold text-zinc-50">{trainingDays}</p>
          <p className="text-xs text-zinc-500">Planned days</p>
        </Card>
      </div>

      {/* CTA */}
      <Link href="/workout">
        <Button size="lg" className="w-full gap-2">
          <Plus className="h-5 w-5" />
          Start a workout
        </Button>
      </Link>

      {/* Weekly overview — client component for correct local timezone */}
      {weeklyPlan && weeklyPlan.length > 0 && (
        <DashboardWeeklyPlan
          weeklyPlan={weeklyPlan}
          sessions={recentSessions ?? []}
        />
      )}

      {/* Recent sessions */}
      {(sessions ?? []).length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Recent workouts</h2>
          {(sessions as WorkoutSession[]).map(session => (
            <div key={session.id} className="relative">
              <Link href={`/active/${session.id}`}>
                <Card className="flex items-center justify-between hover:border-zinc-700 transition-colors cursor-pointer pr-10">
                  <div>
                    <p className="font-medium text-zinc-50 capitalize">
                      {session.muscle_groups.join(', ')}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {new Date(session.created_at).toLocaleDateString()} · {goalLabel(session.goal)}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${session.completed_at ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-400'}`}>
                    {session.completed_at ? 'Done' : 'In progress'}
                  </span>
                </Card>
              </Link>
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <DeleteWorkoutButton sessionId={session.id} />
              </div>
            </div>
          ))}
        </div>
      )}

      {(sessions ?? []).length === 0 && (
        <Card className="text-center py-12 space-y-2">
          <p className="text-zinc-400">No workouts yet</p>
          <p className="text-sm text-zinc-600">Hit the button above to start your first session</p>
        </Card>
      )}
    </div>
  )
}
