'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn, calcBMI, bmiLabel, bmiBarColor, generateWeeklyPlan } from '@/lib/utils'
import type { BodyType, DesiredBody, Equipment, FocusArea, Gender, Goal, HeightUnit, WeightUnit, WorkoutDuration } from '@/lib/types'

// ── Option data ────────────────────────────────────────────────────────────────
const GENDERS: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'other', label: 'Other' },
]
const GOALS: { value: Goal; label: string; desc: string }[] = [
  { value: 'muscle_gain',  label: 'Muscle Gain',  desc: '3×10 reps · hypertrophy' },
  { value: 'fat_loss',     label: 'Fat Loss',     desc: '3×17 reps · short rest' },
  { value: 'strength',     label: 'Strength',     desc: '5×5 reps · heavy compound' },
  { value: 'max_strength', label: 'Max Strength', desc: '5×3 reps · maximal load' },
  { value: 'endurance',    label: 'Endurance',    desc: '4×20 reps · stamina' },
  { value: 'toned',        label: 'Get Toned',    desc: '3×15 reps · lean muscle' },
]
const FOCUS_AREAS: { value: FocusArea; label: string; emoji: string }[] = [
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
  { value: 'full_body', label: 'Full Body', emoji: '⚡' },
]
const BODY_TYPES: { value: BodyType; label: string; desc: string }[] = [
  { value: 'ectomorph', label: 'Ectomorph', desc: 'Lean, hard to gain' },
  { value: 'mesomorph', label: 'Mesomorph', desc: 'Athletic, gains easily' },
  { value: 'endomorph', label: 'Endomorph', desc: 'Broader, gains fat easily' },
]
const DESIRED_BODY: { value: DesiredBody; label: string }[] = [
  { value: 'slim', label: 'Slim & Lean' }, { value: 'athletic', label: 'Athletic' },
  { value: 'muscular', label: 'Muscular' }, { value: 'bulky', label: 'Bulky & Big' },
]
const DURATIONS: { value: WorkoutDuration; label: string }[] = [
  { value: '30', label: '30 min' }, { value: '45', label: '45 min' }, { value: '60+', label: '60+ min' },
]
const EQUIPMENT_OPTS: { value: Equipment; label: string; desc: string }[] = [
  { value: 'none', label: 'No Equipment', desc: 'Bodyweight only' },
  { value: 'basic', label: 'Basic', desc: 'Dumbbells & bands' },
  { value: 'all', label: 'Full Gym', desc: 'All machines' },
]
const BUILD_GOALS = [
  { value: 'massive_chest', label: 'Massive Chest', emoji: '🫁' },
  { value: 'boulder_shoulders', label: 'Boulder Shoulders', emoji: '🔝' },
  { value: 'big_arms', label: 'Big Arms', emoji: '💪' },
  { value: 'six_pack', label: 'Six Pack', emoji: '🔥' },
  { value: 'strong_abs', label: 'Strong Core', emoji: '⚡' },
  { value: 'powerful_legs', label: 'Powerful Legs', emoji: '🦵' },
  { value: 'toned_butt', label: 'Toned Butt', emoji: '🍑' },
]

const ALL_MUSCLE_AREAS: FocusArea[] = ['chest', 'back', 'legs', 'shoulders', 'biceps', 'triceps', 'forearms', 'abs', 'glutes', 'calves']

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-zinc-300 border-b border-zinc-800 pb-2">{title}</p>
      {children}
    </div>
  )
}

export default function SettingsPage() {
  const router = useRouter()

  // State mirrors all onboarding fields
  const [gender,      setGender]      = useState<Gender | null>(null)
  const [nickname,    setNickname]    = useState('')
  const [age,         setAge]         = useState('')
  const [height,      setHeight]      = useState('')
  const [heightUnit,  setHeightUnit]  = useState<HeightUnit>('cm')
  const [weight,      setWeight]      = useState('')
  const [weightUnit,  setWeightUnit]  = useState<WeightUnit>('kg')
  const [bodyType,    setBodyType]    = useState<BodyType | null>(null)
  const [desiredBody, setDesiredBody] = useState<DesiredBody | null>(null)
  const [goal,        setGoal]        = useState<Goal | null>(null)
  const [focusAreas,  setFocusAreas]  = useState<FocusArea[]>([])
  const [buildGoals,  setBuildGoals]  = useState<string[]>([])
  const [duration,    setDuration]    = useState<WorkoutDuration | null>(null)
  const [equipment,   setEquipment]   = useState<Equipment | null>(null)

  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)
  const [error,   setError]   = useState('')

  // Live BMI
  const weightKg = weightUnit === 'kg' ? parseFloat(weight) : parseFloat(weight) / 2.205
  const heightCm = heightUnit === 'cm' ? parseFloat(height) : parseFloat(height) * 30.48
  const bmi     = weight && height && !isNaN(weightKg) && !isNaN(heightCm) && heightCm > 0
    ? calcBMI(weightKg, heightCm) : null
  const bmiInfo = bmi ? bmiLabel(bmi) : null

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (data) {
        setGender(data.gender ?? null)
        setNickname(data.username ?? '')
        setAge(data.age?.toString() ?? '')
        setHeight(data.height?.toString() ?? '')
        setHeightUnit(data.height_unit ?? 'cm')
        setWeight(data.weight?.toString() ?? '')
        setWeightUnit(data.weight_unit ?? 'kg')
        setBodyType(data.body_type ?? null)
        setDesiredBody(data.desired_body ?? null)
        setGoal(data.goal ?? null)
        setFocusAreas((data.focus_areas as FocusArea[]) ?? [])
        setBuildGoals((data.build_goals as string[]) ?? [])
        setDuration(data.workout_duration ?? null)
        setEquipment(data.equipment ?? null)
      }
      setLoading(false)
    }
    load()
  }, [])

  function toggleFocus(area: FocusArea) {
    if (area === 'full_body') {
      setFocusAreas(prev => prev.includes('full_body') ? [] : ['full_body', ...ALL_MUSCLE_AREAS])
      return
    }
    setFocusAreas(prev => {
      const next = prev.includes(area)
        ? prev.filter(a => a !== area)
        : [...prev.filter(a => a !== 'full_body'), area]
      return ALL_MUSCLE_AREAS.every(a => next.includes(a)) ? [...next, 'full_body'] : next
    })
  }

  function toggleBuild(val: string) {
    setBuildGoals(prev => prev.includes(val) ? prev.filter(b => b !== val) : [...prev, val])
  }

  async function handleSave() {
    if (!goal) { setError('Select a training goal'); return }
    setSaving(true); setError(''); setSaved(false)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const newPlan = goal && focusAreas.length > 0 && duration && equipment
      ? generateWeeklyPlan(goal, focusAreas, duration, equipment)
      : undefined

    const { error: err } = await supabase.from('profiles').upsert({
      id: user.id,
      username: nickname || null,
      gender,
      age: age ? parseInt(age) : null,
      height: height ? parseFloat(height) : null,
      height_unit: heightUnit,
      weight: weight ? parseFloat(weight) : null,
      weight_unit: weightUnit,
      body_type: bodyType,
      desired_body: desiredBody,
      goal,
      focus_areas: focusAreas,
      build_goals: buildGoals,
      equipment,
      workout_duration: duration,
      ...(newPlan ? { weekly_plan: newPlan } : {}),
      onboarded: true,
    })

    if (err) { setError(err.message); setSaving(false); return }
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    router.refresh()
  }

  if (loading) return <div className="flex justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-500" /></div>

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-zinc-50">Settings</h1>
        <p className="text-sm text-zinc-400">Update your profile and training plan</p>
      </div>

      {/* ── Personal info ── */}
      <Section title="Personal info">
        <div className="flex gap-2">
          {GENDERS.map(g => (
            <button key={g.value} type="button" onClick={() => setGender(g.value)}
              className={cn('flex-1 rounded-xl border py-2.5 text-sm font-medium transition-all',
                gender === g.value ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-600')}
            >{g.label}</button>
          ))}
        </div>
        <Input label="Nickname" type="text" value={nickname} onChange={e => setNickname(e.target.value)} placeholder="GymRat42" />
        <Input label="Age" type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="25" />
        <div className="flex gap-3">
          <div className="flex-1">
            <Input label="Height" type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder={heightUnit === 'cm' ? '175' : '5.9'} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-300">Unit</label>
            <div className="flex h-11 overflow-hidden rounded-xl border border-zinc-700">
              {(['cm', 'ft'] as HeightUnit[]).map(u => (
                <button key={u} type="button" onClick={() => setHeightUnit(u)}
                  className={cn('flex-1 px-4 text-sm font-medium transition-colors', heightUnit === u ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-900 text-zinc-400')}
                >{u}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <Input label="Weight" type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder={weightUnit === 'kg' ? '75' : '165'} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-300">Unit</label>
            <div className="flex h-11 overflow-hidden rounded-xl border border-zinc-700">
              {(['kg', 'lbs'] as WeightUnit[]).map(u => (
                <button key={u} type="button" onClick={() => setWeightUnit(u)}
                  className={cn('flex-1 px-4 text-sm font-medium transition-colors', weightUnit === u ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-900 text-zinc-400')}
                >{u}</button>
              ))}
            </div>
          </div>
        </div>
        {bmi && bmiInfo && (
          <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">BMI</span>
              <span className={cn('font-bold', bmiInfo.color)}>{bmi.toFixed(1)} · {bmiInfo.label}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-zinc-800">
              <div className={cn('h-2 rounded-full', bmiBarColor(bmi))} style={{ width: `${Math.min(100, ((bmi - 10) / 30) * 100)}%` }} />
            </div>
          </div>
        )}
      </Section>

      {/* ── Body structure ── */}
      <Section title="Body structure">
        <p className="text-xs text-zinc-500">Current body type</p>
        <div className="space-y-2">
          {BODY_TYPES.map(bt => (
            <button key={bt.value} type="button" onClick={() => setBodyType(bt.value)}
              className={cn('flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all',
                bodyType === bt.value ? 'border-emerald-500 bg-emerald-500/10' : 'border-zinc-700 bg-zinc-900 hover:border-zinc-600')}
            >
              <div className={cn('h-3 w-3 rounded-full border-2 flex-shrink-0',
                bodyType === bt.value ? 'border-emerald-500 bg-emerald-500' : 'border-zinc-600')} />
              <div>
                <p className="font-semibold text-zinc-50 text-sm">{bt.label}</p>
                <p className="text-xs text-zinc-400">{bt.desc}</p>
              </div>
            </button>
          ))}
        </div>
        <p className="text-xs text-zinc-500 pt-1">Desired physique</p>
        <div className="grid grid-cols-2 gap-2">
          {DESIRED_BODY.map(db => (
            <button key={db.value} type="button" onClick={() => setDesiredBody(db.value)}
              className={cn('rounded-xl border p-3 text-sm font-medium text-left transition-all',
                desiredBody === db.value ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-600')}
            >{db.label}</button>
          ))}
        </div>
      </Section>

      {/* ── Training goal ── */}
      <Section title="Training goal">
        <div className="space-y-2">
          {GOALS.map(g => (
            <button key={g.value} type="button" onClick={() => setGoal(g.value)}
              className={cn('flex w-full items-center justify-between rounded-xl border p-4 text-left transition-all',
                goal === g.value ? 'border-emerald-500 bg-emerald-500/10' : 'border-zinc-700 bg-zinc-900 hover:border-zinc-600')}
            >
              <span className="font-semibold text-zinc-50">{g.label}</span>
              <span className="text-xs text-zinc-500">{g.desc}</span>
            </button>
          ))}
        </div>
      </Section>

      {/* ── Focus areas ── */}
      <Section title="Focus areas">
        <div className="grid grid-cols-2 gap-2">
          {FOCUS_AREAS.map(fa => (
            <button key={fa.value} type="button" onClick={() => toggleFocus(fa.value)}
              className={cn('flex items-center gap-2 rounded-xl border p-3 text-left transition-all',
                focusAreas.includes(fa.value) ? 'border-emerald-500 bg-emerald-500/10' : 'border-zinc-700 bg-zinc-900 hover:border-zinc-600')}
            >
              <span>{fa.emoji}</span>
              <span className="text-sm font-medium text-zinc-50">{fa.label}</span>
            </button>
          ))}
        </div>
      </Section>

      {/* ── Build goals ── */}
      <Section title="Build goals">
        <div className="grid grid-cols-2 gap-2">
          {BUILD_GOALS.map(bg => (
            <button key={bg.value} type="button" onClick={() => toggleBuild(bg.value)}
              className={cn('flex items-center gap-2 rounded-xl border p-3 text-left transition-all',
                buildGoals.includes(bg.value) ? 'border-emerald-500 bg-emerald-500/10' : 'border-zinc-700 bg-zinc-900 hover:border-zinc-600')}
            >
              <span>{bg.emoji}</span>
              <span className="text-sm font-medium text-zinc-50">{bg.label}</span>
            </button>
          ))}
        </div>
      </Section>

      {/* ── Workout style ── */}
      <Section title="Workout style">
        <p className="text-xs text-zinc-500">Session length</p>
        <div className="flex gap-2">
          {DURATIONS.map(d => (
            <button key={d.value} type="button" onClick={() => setDuration(d.value)}
              className={cn('flex-1 rounded-xl border py-3 text-sm font-medium transition-all',
                duration === d.value ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-600')}
            >{d.label}</button>
          ))}
        </div>
        <p className="text-xs text-zinc-500 pt-1">Equipment</p>
        <div className="space-y-2">
          {EQUIPMENT_OPTS.map(eq => (
            <button key={eq.value} type="button" onClick={() => setEquipment(eq.value)}
              className={cn('flex w-full items-center justify-between rounded-xl border p-3 text-left transition-all',
                equipment === eq.value ? 'border-emerald-500 bg-emerald-500/10' : 'border-zinc-700 bg-zinc-900 hover:border-zinc-600')}
            >
              <span className="font-medium text-zinc-50 text-sm">{eq.label}</span>
              <span className="text-xs text-zinc-500">{eq.desc}</span>
            </button>
          ))}
        </div>
      </Section>

      {error && <p className="text-sm text-red-400">{error}</p>}
      {saved && <p className="text-sm text-emerald-400">Saved! Weekly plan regenerated.</p>}

      <Button size="lg" className="w-full" loading={saving} onClick={handleSave}>
        Save changes & regenerate plan
      </Button>
    </div>
  )
}
