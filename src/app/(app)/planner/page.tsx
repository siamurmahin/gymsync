'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import type { FocusArea, MuscleGroup } from '@/lib/types'
import { Check, Moon } from 'lucide-react'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const MUSCLE_OPTIONS: { value: MuscleGroup; label: string; emoji: string }[] = [
  { value: 'chest',     label: 'Chest',     emoji: '🫁' },
  { value: 'back',      label: 'Back',      emoji: '🏋️' },
  { value: 'legs',      label: 'Legs',      emoji: '🦵' },
  { value: 'shoulders', label: 'Shoulders', emoji: '🔝' },
  { value: 'biceps',    label: 'Biceps',    emoji: '💪' },
  { value: 'triceps',   label: 'Triceps',   emoji: '🦾' },
  { value: 'forearms',  label: 'Forearms',  emoji: '🤜' },
  { value: 'abs',       label: 'Abs',       emoji: '🔥' },
  { value: 'glutes',    label: 'Glutes',    emoji: '🍑' },
  { value: 'calves',    label: 'Calves',    emoji: '🦶' },
]

interface DayConfig {
  isRest: boolean
  muscles: MuscleGroup[]
}

function DayCard({
  day, config, onChange,
}: {
  day: string
  config: DayConfig
  onChange: (cfg: DayConfig) => void
}) {
  function toggle(muscle: MuscleGroup) {
    const next = config.muscles.includes(muscle)
      ? config.muscles.filter(m => m !== muscle)
      : [...config.muscles, muscle]
    onChange({ isRest: false, muscles: next })
  }

  return (
    <div className={cn(
      'rounded-2xl border p-4 space-y-3 transition-all',
      config.isRest ? 'border-zinc-800 bg-zinc-900/40' : 'border-zinc-700 bg-zinc-900',
    )}>
      <div className="flex items-center justify-between">
        <span className={cn('font-bold text-sm', config.isRest ? 'text-zinc-500' : 'text-zinc-50')}>
          {day}
        </span>
        <button
          type="button"
          onClick={() => onChange({ isRest: !config.isRest, muscles: config.isRest ? config.muscles : [] })}
          className={cn(
            'flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-all',
            config.isRest
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
              : 'border-zinc-700 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300',
          )}
        >
          <Moon className="h-3 w-3" />
          {config.isRest ? 'Rest day' : 'Set rest'}
        </button>
      </div>

      {!config.isRest && (
        <div className="flex flex-wrap gap-1.5">
          {MUSCLE_OPTIONS.map(m => {
            const active = config.muscles.includes(m.value)
            return (
              <button
                key={m.value}
                type="button"
                onClick={() => toggle(m.value)}
                className={cn(
                  'flex items-center gap-1 rounded-lg border px-2 py-1 text-xs font-medium transition-all',
                  active
                    ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400'
                    : 'border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-600',
                )}
              >
                <span>{m.emoji}</span>
                <span>{m.label}</span>
                {active && <Check className="h-3 w-3" />}
              </button>
            )
          })}
        </div>
      )}

      {!config.isRest && config.muscles.length === 0 && (
        <p className="text-xs text-zinc-600">Tap muscle groups above</p>
      )}
    </div>
  )
}

export default function PlannerPage() {
  const router = useRouter()
  const [days, setDays] = useState<Record<string, DayConfig>>(
    Object.fromEntries(DAYS.map(d => [d, { isRest: false, muscles: [] }]))
  )
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)
  const [error,  setError]  = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('profiles').select('weekly_plan').eq('id', user.id).single()
      if (data?.weekly_plan) {
        const existing = data.weekly_plan as { day: string; isRest: boolean; muscleGroups: MuscleGroup[] }[]
        const cfg: Record<string, DayConfig> = {}
        for (const entry of existing) {
          cfg[entry.day] = { isRest: entry.isRest, muscles: entry.muscleGroups ?? [] }
        }
        setDays(prev => ({ ...prev, ...cfg }))
      }
      setLoading(false)
    }
    load()
  }, [])

  function updateDay(day: string, cfg: DayConfig) {
    setDays(prev => ({ ...prev, [day]: cfg }))
  }

  async function savePlan() {
    setSaving(true); setError(''); setSaved(false)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const weeklyPlan = DAYS.map(day => {
      const cfg = days[day]
      return {
        day,
        isRest: cfg.isRest || cfg.muscles.length === 0,
        muscleGroups: cfg.isRest ? [] : cfg.muscles,
        focus: cfg.isRest || cfg.muscles.length === 0
          ? 'Rest'
          : cfg.muscles.map(m => m.charAt(0).toUpperCase() + m.slice(1)).join(' + '),
        exerciseCount: cfg.isRest ? 0 : cfg.muscles.length * 3,
      }
    })

    const { error: err } = await supabase.from('profiles')
      .update({ weekly_plan: weeklyPlan })
      .eq('id', user.id)

    if (err) { setError(err.message); setSaving(false); return }
    setSaving(false); setSaved(true)
    setTimeout(() => { setSaved(false); router.push('/dashboard') }, 1500)
  }

  const trainingDays = Object.values(days).filter(d => !d.isRest && d.muscles.length > 0).length

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-500" />
      </div>
    )
  }

  return (
    <div className="space-y-5 pb-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-50">Custom Weekly Plan</h1>
        <p className="text-sm text-zinc-400">
          {trainingDays} training day{trainingDays !== 1 ? 's' : ''} · {7 - trainingDays} rest day{7 - trainingDays !== 1 ? 's' : ''}
        </p>
      </div>

      {DAYS.map(day => (
        <DayCard
          key={day}
          day={day}
          config={days[day]}
          onChange={cfg => updateDay(day, cfg)}
        />
      ))}

      {error && <p className="text-sm text-red-400">{error}</p>}
      {saved && <p className="text-sm text-emerald-400">Plan saved! Redirecting…</p>}

      <Button size="lg" className="w-full" loading={saving} onClick={savePlan}>
        Save my plan
      </Button>
    </div>
  )
}
