import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import type { WorkoutSession } from '@/lib/types'

function getWeekKey(date: Date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - d.getDay() + 1) // Monday
  return d.toISOString().slice(0, 10)
}

function formatWeek(key: string) {
  const d = new Date(key)
  return d.toLocaleDateString('en', { month: 'short', day: 'numeric' })
}

export default async function ProgressPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: sessions } = await supabase
    .from('workout_sessions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const all = (sessions ?? []) as WorkoutSession[]
  const completed = all.filter(s => s.completed_at)

  // ── Per-week bar chart (last 8 weeks) ────────────────────────────────────
  const weekMap: Record<string, number> = {}
  for (const s of completed) {
    const key = getWeekKey(new Date(s.created_at))
    weekMap[key] = (weekMap[key] ?? 0) + 1
  }
  const now = new Date()
  const weeks: { key: string; count: number }[] = []
  for (let i = 7; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i * 7)
    const key = getWeekKey(d)
    weeks.push({ key, count: weekMap[key] ?? 0 })
  }
  const maxCount = Math.max(1, ...weeks.map(w => w.count))

  // ── Muscle group breakdown ────────────────────────────────────────────────
  const muscleCounts: Record<string, number> = {}
  for (const s of completed) {
    for (const mg of s.muscle_groups) {
      muscleCounts[mg] = (muscleCounts[mg] ?? 0) + 1
    }
  }
  const muscleList = Object.entries(muscleCounts)
    .sort((a, b) => b[1] - a[1])
  const totalMuscleHits = muscleList.reduce((a, [, c]) => a + c, 0) || 1

  // ── Last 30 days calendar ─────────────────────────────────────────────────
  const completedDaySet = new Set(
    completed.map(s => new Date(s.created_at).toISOString().slice(0, 10))
  )
  const calDays: { date: string; trained: boolean }[] = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    calDays.push({ date: key, trained: completedDaySet.has(key) })
  }

  const MUSCLE_COLORS: Record<string, string> = {
    chest: 'bg-blue-500',   back: 'bg-purple-500', legs: 'bg-orange-500',
    shoulders: 'bg-pink-500', arms: 'bg-yellow-500', abs: 'bg-emerald-500', butt: 'bg-red-400',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-50">Progress</h1>
        <p className="text-sm text-zinc-400">{completed.length} workouts completed</p>
      </div>

      {/* Weekly bar chart */}
      <Card className="space-y-4">
        <p className="text-sm font-semibold text-zinc-300">Workouts per week</p>
        <div className="flex items-end gap-1.5 h-28">
          {weeks.map(week => {
            const isCurrentWeek = week.key === getWeekKey(now)
            const heightPct = (week.count / maxCount) * 100
            return (
              <div key={week.key} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[10px] font-bold text-zinc-400">
                  {week.count > 0 ? week.count : ''}
                </span>
                <div className="w-full flex-1 flex items-end">
                  <div
                    className={cn(
                      'w-full rounded-t-md transition-all',
                      isCurrentWeek ? 'bg-emerald-500' : 'bg-zinc-700',
                      week.count === 0 && 'bg-zinc-800',
                    )}
                    style={{ height: week.count === 0 ? '4px' : `${heightPct}%` }}
                  />
                </div>
                <span className="text-[9px] text-zinc-600">{formatWeek(week.key)}</span>
              </div>
            )
          })}
        </div>
      </Card>

      {/* 30-day activity grid */}
      <Card className="space-y-3">
        <p className="text-sm font-semibold text-zinc-300">Last 30 days</p>
        <div className="grid grid-cols-10 gap-1.5">
          {calDays.map(day => (
            <div
              key={day.date}
              title={day.date}
              className={cn(
                'aspect-square rounded',
                day.trained ? 'bg-emerald-500' : 'bg-zinc-800',
              )}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-600">
          <div className="h-3 w-3 rounded bg-zinc-800" />
          <span>Rest</span>
          <div className="h-3 w-3 rounded bg-emerald-500 ml-2" />
          <span>Trained</span>
        </div>
      </Card>

      {/* Muscle group breakdown */}
      {muscleList.length > 0 && (
        <Card className="space-y-4">
          <p className="text-sm font-semibold text-zinc-300">Muscle focus</p>
          <div className="space-y-3">
            {muscleList.map(([muscle, count]) => (
              <div key={muscle} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="capitalize text-zinc-300">{muscle}</span>
                  <span className="text-zinc-500">{count} sessions</span>
                </div>
                <div className="h-2 w-full rounded-full bg-zinc-800">
                  <div
                    className={cn('h-2 rounded-full transition-all', MUSCLE_COLORS[muscle] ?? 'bg-zinc-500')}
                    style={{ width: `${(count / totalMuscleHits) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {completed.length === 0 && (
        <Card className="py-12 text-center space-y-2">
          <p className="text-zinc-400">No workouts completed yet</p>
          <p className="text-sm text-zinc-600">Finish your first workout to see progress here</p>
        </Card>
      )}
    </div>
  )
}
