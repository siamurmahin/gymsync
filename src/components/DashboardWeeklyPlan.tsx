'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import type { DayPlan } from '@/lib/types'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

interface Props {
  weeklyPlan: DayPlan[]
  sessions: { created_at: string; completed_at: string | null }[]
}

export function DashboardWeeklyPlan({ weeklyPlan, sessions }: Props) {
  // All date logic runs in the browser with the user's local timezone
  const now = new Date()
  const todayName = DAY_NAMES[now.getDay()]

  // Local week start (Monday 00:00 local time)
  const dow = now.getDay()
  const mondayOffset = dow === 0 ? -6 : 1 - dow
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() + mondayOffset)
  weekStart.setHours(0, 0, 0, 0)

  const completedDays = new Set(
    sessions
      .filter(s => s.completed_at && new Date(s.created_at) >= weekStart)
      .map(s => DAY_NAMES[new Date(s.created_at).getDay()])
  )

  const trainingDays = weeklyPlan.filter(d => !d.isRest).length
  const doneThisWeek = completedDays.size

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">This week</h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-500">{doneThisWeek}/{trainingDays} done</span>
          <Link href="/planner" className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            Edit
          </Link>
        </div>
      </div>

      <div className="h-1.5 w-full rounded-full bg-zinc-800">
        <div
          className="h-1.5 rounded-full bg-emerald-500 transition-all duration-500"
          style={{ width: trainingDays > 0 ? `${(doneThisWeek / trainingDays) * 100}%` : '0%' }}
        />
      </div>

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
                isDone ? 'bg-emerald-500/20' : day.isRest ? 'bg-zinc-900' : 'bg-zinc-800/60',
              )}
            >
              <span className={cn('text-[10px] font-bold', isToday ? 'text-emerald-400' : 'text-zinc-500')}>
                {day.day.slice(0, 3).toUpperCase()}
              </span>
              <div className={cn(
                'h-2 w-2 rounded-full',
                isDone ? 'bg-emerald-400' : day.isRest ? 'bg-zinc-700' : 'bg-zinc-500',
              )} />
              <span className={cn(
                'text-[9px] font-medium leading-tight',
                isDone ? 'text-emerald-400' : day.isRest ? 'text-zinc-700' : 'text-zinc-400',
              )}>
                {day.isRest ? 'REST' : isDone ? 'DONE' : 'TRAIN'}
              </span>
            </div>
          )
        })}
      </div>

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
  )
}
