import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { cn, goalLabel } from '@/lib/utils'
import { DeleteWorkoutButton } from '@/components/DeleteWorkoutButton'
import type { DayPlan, Goal, WorkoutSession } from '@/lib/types'
import { Plus, Trophy, Flame, Calendar, Pencil } from 'lucide-react'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const now = new Date()
  // Start of this week (Monday)
  const dayOfWeek = now.getDay() // 0=Sun
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() + mondayOffset)
  weekStart.setHours(0, 0, 0, 0)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 7)

  const [{ data: profile }, { data: sessions }, { data: weekSessions }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase
      .from('workout_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('workout_sessions')
      .select('created_at, completed_at, muscle_groups')
      .eq('user_id', user.id)
      .gte('created_at', weekStart.toISOString())
      .lt('created_at', weekEnd.toISOString()),
  ])

  if (!profile?.onboarded) redirect('/onboarding')

  const completed = (sessions ?? []).filter((s: WorkoutSession) => s.completed_at)
  const weeklyPlan: DayPlan[] | null = profile.weekly_plan as DayPlan[] | null
  const todayName = DAY_NAMES[now.getDay()]

  // Which week days have a completed session
  const completedDays = new Set(
    (weekSessions ?? [])
      .filter((s: { completed_at: string | null }) => s.completed_at)
      .map((s: { created_at: string }) => DAY_NAMES[new Date(s.created_at).getDay()])
  )

  const trainingDays = weeklyPlan ? weeklyPlan.filter(d => !d.isRest).length : 0
  const doneThisWeek = completedDays.size

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

      {/* Weekly overview */}
      {weeklyPlan && weeklyPlan.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">This week</h2>
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-500">{doneThisWeek}/{trainingDays} done</span>
              <Link href="/planner" className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                <Pencil className="h-3 w-3" />
                Edit
              </Link>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 w-full rounded-full bg-zinc-800">
            <div
              className="h-1.5 rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: trainingDays > 0 ? `${(doneThisWeek / trainingDays) * 100}%` : '0%' }}
            />
          </div>

          {/* Day pills */}
          <div className="grid grid-cols-7 gap-1.5">
            {weeklyPlan.map((day) => {
              const isToday = day.day === todayName
              const isDone = completedDays.has(day.day)
              return (
                <div
                  key={day.day}
                  className={cn(
                    'flex flex-col items-center gap-1 rounded-xl py-2.5 px-1 text-center transition-all',
                    isToday && !day.isRest && 'ring-2 ring-emerald-500 ring-offset-1 ring-offset-zinc-950',
                    isDone ? 'bg-emerald-500/20' :
                    day.isRest ? 'bg-zinc-900' : 'bg-zinc-800/60',
                  )}
                >
                  <span className={cn(
                    'text-[10px] font-bold',
                    isToday ? 'text-emerald-400' : 'text-zinc-500',
                  )}>
                    {day.day.slice(0, 3).toUpperCase()}
                  </span>
                  <div className={cn(
                    'h-2 w-2 rounded-full',
                    isDone ? 'bg-emerald-400' :
                    day.isRest ? 'bg-zinc-700' : 'bg-zinc-500',
                  )} />
                  <span className={cn(
                    'text-[9px] font-medium leading-tight',
                    isDone ? 'text-emerald-400' :
                    day.isRest ? 'text-zinc-700' : 'text-zinc-400',
                  )}>
                    {day.isRest ? 'REST' : isDone ? 'DONE' : 'TRAIN'}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Today's focus */}
          {(() => {
            const today = weeklyPlan.find(d => d.day === todayName)
            if (!today) return null
            return (
              <Card className={cn(
                'flex items-center justify-between',
                today.isRest ? 'border-zinc-800' : 'border-emerald-500/30 bg-emerald-500/5',
              )}>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">Today</p>
                  <p className={cn('font-semibold', today.isRest ? 'text-zinc-500' : 'text-zinc-50')}>
                    {today.isRest ? 'Rest & Recovery' : today.focus}
                  </p>
                  {!today.isRest && (
                    <p className="text-xs text-zinc-500">{today.exerciseCount} exercises planned</p>
                  )}
                </div>
                {!today.isRest && (
                  <Link href={`/workout?muscles=${today.muscleGroups.join(',')}`}>
                    <Button size="sm" className="flex-shrink-0">
                      {completedDays.has(todayName) ? 'Again' : 'Train now'}
                    </Button>
                  </Link>
                )}
              </Card>
            )
          })()}
        </div>
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
