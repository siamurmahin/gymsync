import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/Card'
import { calcBMI, bmiLabel, bmiBarColor, cn, goalLabel } from '@/lib/utils'
import type { DayPlan, Goal } from '@/lib/types'
import { Settings, Trophy, Calendar, Flame } from 'lucide-react'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: sessions }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('workout_sessions').select('completed_at, muscle_groups, created_at')
      .eq('user_id', user.id).order('created_at', { ascending: false }),
  ])

  if (!profile?.onboarded) redirect('/onboarding')

  const completed  = (sessions ?? []).filter(s => s.completed_at)
  const weekly_plan: DayPlan[] | null = profile.weekly_plan

  const weightKg = profile.weight
    ? profile.weight_unit === 'kg' ? profile.weight : profile.weight / 2.205
    : null
  const heightCm = profile.height
    ? profile.height_unit === 'cm' ? profile.height : profile.height * 30.48
    : null
  const bmi     = weightKg && heightCm ? calcBMI(weightKg, heightCm) : null
  const bmiInfo = bmi ? bmiLabel(bmi) : null

  // Most trained muscle group
  const muscleCounts: Record<string, number> = {}
  for (const s of completed) {
    for (const mg of (s.muscle_groups ?? [])) {
      muscleCounts[mg] = (muscleCounts[mg] ?? 0) + 1
    }
  }
  const topMuscle = Object.entries(muscleCounts).sort((a, b) => b[1] - a[1])[0]

  const trainingDays = (weekly_plan ?? []).filter(d => !d.isRest).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-50">Profile</h1>
        <Link
          href="/settings"
          className="flex items-center gap-1.5 rounded-xl border border-zinc-700 px-3 py-2 text-sm font-medium text-zinc-400 hover:border-zinc-600 hover:text-zinc-50 transition-colors"
        >
          <Settings className="h-4 w-4" />
          Edit
        </Link>
      </div>

      {/* Avatar + name */}
      <Card className="flex items-center gap-4">
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-emerald-500/20 text-3xl font-bold text-emerald-400">
          {(profile.username ?? user.email ?? 'U')[0].toUpperCase()}
        </div>
        <div>
          <p className="text-lg font-bold text-zinc-50">{profile.username ?? 'Athlete'}</p>
          <p className="text-sm text-zinc-400">{user.email}</p>
          <p className="mt-1 text-xs text-zinc-500">
            {profile.age ? `${profile.age} yrs` : ''}{profile.age && profile.gender ? ' · ' : ''}{profile.gender ?? ''}
          </p>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="text-center space-y-1">
          <Trophy className="mx-auto h-5 w-5 text-yellow-400" />
          <p className="text-2xl font-bold text-zinc-50">{completed.length}</p>
          <p className="text-xs text-zinc-500">Workouts</p>
        </Card>
        <Card className="text-center space-y-1">
          <Calendar className="mx-auto h-5 w-5 text-blue-400" />
          <p className="text-2xl font-bold text-zinc-50">{trainingDays}</p>
          <p className="text-xs text-zinc-500">Days/week</p>
        </Card>
        <Card className="text-center space-y-1">
          <Flame className="mx-auto h-5 w-5 text-orange-400" />
          <p className="text-xl font-bold text-zinc-50 capitalize">{topMuscle?.[0] ?? '—'}</p>
          <p className="text-xs text-zinc-500">Top muscle</p>
        </Card>
      </div>

      {/* Body stats */}
      <Card className="space-y-4">
        <p className="text-sm font-semibold text-zinc-300">Body stats</p>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Height', value: profile.height ? `${profile.height} ${profile.height_unit}` : '—' },
            { label: 'Weight', value: profile.weight ? `${profile.weight} ${profile.weight_unit}` : '—' },
            { label: 'Body type', value: profile.body_type ?? '—' },
            { label: 'Desired', value: profile.desired_body ?? '—' },
          ].map(item => (
            <div key={item.label}>
              <p className="text-xs text-zinc-500">{item.label}</p>
              <p className="font-semibold text-zinc-50 capitalize">{item.value}</p>
            </div>
          ))}
        </div>

        {bmi && bmiInfo && (
          <div className="space-y-2 border-t border-zinc-800 pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">BMI</span>
              <span className={cn('font-bold', bmiInfo.color)}>{bmi.toFixed(1)} · {bmiInfo.label}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-zinc-800">
              <div
                className={cn('h-2 rounded-full transition-all', bmiBarColor(bmi))}
                style={{ width: `${Math.min(100, ((bmi - 10) / 30) * 100)}%` }}
              />
            </div>
          </div>
        )}
      </Card>

      {/* Goal & plan */}
      <Card className="space-y-3">
        <p className="text-sm font-semibold text-zinc-300">Training plan</p>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Goal',      value: goalLabel(profile.goal as Goal) },
            { label: 'Equipment', value: profile.equipment ?? '—' },
            { label: 'Duration',  value: profile.workout_duration ? `${profile.workout_duration} min` : '—' },
            { label: 'Focus',     value: (profile.focus_areas as string[] | null)?.slice(0, 2).join(', ') ?? '—' },
          ].map(item => (
            <div key={item.label}>
              <p className="text-xs text-zinc-500">{item.label}</p>
              <p className="font-semibold text-zinc-50 capitalize">{item.value}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Weekly plan */}
      {weekly_plan && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-zinc-300">Weekly schedule</p>
          <div className="space-y-2">
            {weekly_plan.map((day, i) => (
              <div
                key={i}
                className={cn(
                  'flex items-center justify-between rounded-xl border px-4 py-3',
                  day.isRest ? 'border-zinc-800 bg-zinc-900/50' : 'border-zinc-700 bg-zinc-900',
                )}
              >
                <div className="flex items-center gap-3">
                  <span className={cn('text-xs font-bold w-8', day.isRest ? 'text-zinc-600' : 'text-emerald-400')}>
                    {day.day.slice(0, 3).toUpperCase()}
                  </span>
                  <p className={cn('text-sm font-medium capitalize', day.isRest ? 'text-zinc-600' : 'text-zinc-200')}>
                    {day.isRest ? 'Rest & Recovery' : day.focus}
                  </p>
                </div>
                {!day.isRest && (
                  <span className="text-xs text-zinc-500">{day.exerciseCount} ex</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
