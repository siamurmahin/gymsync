'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn, calcBMI, bmiLabel, bmiBarColor, generateWeeklyPlan } from '@/lib/utils'
import type { BodyType, DesiredBody, Equipment, FocusArea, Gender, Goal, MuscleGroup, WorkoutDuration, DayPlan } from '@/lib/types'

// ─── Step data ────────────────────────────────────────────────────────────────

const GENDERS: { value: Gender; label: string; emoji: string }[] = [
  { value: 'male',   label: 'Male',   emoji: '♂️' },
  { value: 'female', label: 'Female', emoji: '♀️' },
  { value: 'other',  label: 'Other',  emoji: '⚧️' },
]

const GOALS: { value: Goal; label: string; desc: string; emoji: string }[] = [
  { value: 'muscle_gain',  label: 'Muscle Gain',  emoji: '💪', desc: 'Build size & strength' },
  { value: 'endurance',    label: 'Endurance',    emoji: '🏃', desc: 'Stamina & cardio fitness' },
  { value: 'max_strength', label: 'Max Strength', emoji: '🏋️', desc: 'Lift heavy, get powerful' },
  { value: 'toned',        label: 'Get Toned',    emoji: '✨', desc: 'Lean, defined physique' },
]

const FOCUS_AREAS: { value: FocusArea; label: string; emoji: string }[] = [
  { value: 'back',      label: 'Back',       emoji: '🔙' },
  { value: 'shoulders', label: 'Shoulders',  emoji: '🔝' },
  { value: 'arms',      label: 'Arms',       emoji: '💪' },
  { value: 'chest',     label: 'Chest',      emoji: '🫁' },
  { value: 'abs',       label: 'ABS',        emoji: '🔥' },
  { value: 'butt',      label: 'Butt',       emoji: '🍑' },
  { value: 'legs',      label: 'Legs',       emoji: '🦵' },
  { value: 'full_body', label: 'Full Body',  emoji: '🌟' },
]

const BODY_TYPES: { value: BodyType; label: string; desc: string }[] = [
  { value: 'ectomorph',  label: 'Ectomorph',  desc: 'Lean, hard to gain' },
  { value: 'mesomorph',  label: 'Mesomorph',  desc: 'Athletic, gains easily' },
  { value: 'endomorph',  label: 'Endomorph',  desc: 'Broader, gains fat easily' },
]

const DESIRED_BODY: { value: DesiredBody; label: string; desc: string }[] = [
  { value: 'slim',     label: 'Slim & Lean',   desc: 'Low body fat, lean muscle' },
  { value: 'athletic', label: 'Athletic',       desc: 'Fit, functional & defined' },
  { value: 'muscular', label: 'Muscular',       desc: 'Visible muscle mass' },
  { value: 'bulky',    label: 'Bulky & Big',   desc: 'Maximum muscle size' },
]

const BUILD_GOALS = [
  { value: 'massive_chest',      label: 'Massive Chest',      emoji: '🫁' },
  { value: 'boulder_shoulders',  label: 'Boulder Shoulders',  emoji: '🔝' },
  { value: 'big_arms',           label: 'Big Arms',           emoji: '💪' },
  { value: 'six_pack',           label: 'Six Pack',           emoji: '🔥' },
  { value: 'strong_abs',         label: 'Strong Core',        emoji: '⚡' },
  { value: 'powerful_legs',      label: 'Powerful Legs',      emoji: '🦵' },
  { value: 'toned_butt',         label: 'Toned Butt',         emoji: '🍑' },
]

const DURATIONS: { value: WorkoutDuration; label: string; desc: string }[] = [
  { value: '30',  label: '30 min',  desc: 'Quick & efficient' },
  { value: '45',  label: '45 min',  desc: 'Balanced session' },
  { value: '60+', label: '60+ min', desc: 'Full deep session' },
]

const EQUIPMENT_OPTIONS: { value: Equipment; label: string; desc: string }[] = [
  { value: 'none',  label: 'No Equipment', desc: 'Bodyweight only' },
  { value: 'basic', label: 'Basic',        desc: 'Dumbbells & bands' },
  { value: 'all',   label: 'Full Gym',     desc: 'All machines available' },
]

const TOTAL_STEPS = 9

// ─── Component ────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  // Step data
  const [gender,      setGender]      = useState<Gender | null>(null)
  const [goal,        setGoal]        = useState<Goal | null>(null)
  const [focusAreas,  setFocusAreas]  = useState<FocusArea[]>([])
  const [nickname,    setNickname]    = useState('')
  const [age,         setAge]         = useState('')
  const [height,      setHeight]      = useState('')
  const [heightUnit,  setHeightUnit]  = useState<'cm' | 'ft'>('cm')
  const [weight,      setWeight]      = useState('')
  const [weightUnit,  setWeightUnit]  = useState<'kg' | 'lbs'>('kg')
  const [bodyType,    setBodyType]    = useState<BodyType | null>(null)
  const [desiredBody, setDesiredBody] = useState<DesiredBody | null>(null)
  const [buildGoals,  setBuildGoals]  = useState<string[]>([])
  const [duration,    setDuration]    = useState<WorkoutDuration | null>(null)
  const [equipment,   setEquipment]   = useState<Equipment | null>(null)

  // Analysis & plan
  const [analyzeProgress, setAnalyzeProgress] = useState(0)
  const [weeklyPlan,      setWeeklyPlan]       = useState<DayPlan[]>([])
  const [saving,          setSaving]           = useState(false)
  const [error,           setError]            = useState('')

  // Live BMI
  const weightKg = weightUnit === 'kg' ? parseFloat(weight) : parseFloat(weight) / 2.205
  const heightCm = heightUnit === 'cm' ? parseFloat(height) : parseFloat(height) * 30.48
  const bmi = weight && height && !isNaN(weightKg) && !isNaN(heightCm) && heightCm > 0
    ? calcBMI(weightKg, heightCm) : null
  const bmiInfo = bmi ? bmiLabel(bmi) : null

  // Analysis animation
  useEffect(() => {
    if (step !== 8) return
    const plan = generateWeeklyPlan(goal!, focusAreas, duration ?? '45', equipment ?? 'all')
    setWeeklyPlan(plan)
    setAnalyzeProgress(0)
    const timer = setInterval(() => {
      setAnalyzeProgress(p => {
        if (p >= 100) { clearInterval(timer); setTimeout(() => setStep(9), 400); return 100 }
        return p + 2
      })
    }, 40)
    return () => clearInterval(timer)
  }, [step])

  const ALL_MUSCLE_AREAS: FocusArea[] = ['chest', 'back', 'legs', 'shoulders', 'arms', 'abs', 'butt']

  function toggleFocus(area: FocusArea) {
    if (area === 'full_body') {
      setFocusAreas(prev =>
        prev.includes('full_body') ? [] : ['full_body', ...ALL_MUSCLE_AREAS]
      )
      return
    }
    setFocusAreas(prev => {
      const next = prev.includes(area)
        ? prev.filter(a => a !== area)
        : [...prev.filter(a => a !== 'full_body'), area]
      const allSelected = ALL_MUSCLE_AREAS.every(a => next.includes(a))
      return allSelected ? [...next, 'full_body'] : next
    })
  }

  function toggleBuild(val: string) {
    setBuildGoals(prev =>
      prev.includes(val) ? prev.filter(b => b !== val) : [...prev, val]
    )
  }

  async function handleFinish() {
    if (!goal) return
    setSaving(true)
    setError('')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

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
      weekly_plan: weeklyPlan,
      onboarded: true,
    })

    if (err) { setError(err.message); setSaving(false); return }
    router.push('/dashboard')
  }

  const canNext: Record<number, boolean> = {
    1: !!gender,
    2: !!goal,
    3: focusAreas.length > 0,
    4: !!nickname && !!age && !!height && !!weight,
    5: !!bodyType && !!desiredBody,
    6: buildGoals.length > 0,
    7: !!duration && !!equipment,
    8: false,
    9: true,
  }

  function next() { if (canNext[step]) setStep(s => s + 1) }
  function back() { setStep(s => Math.max(1, s - 1)) }

  return (
    <div className="flex min-h-screen flex-col items-center justify-start px-4 py-10">
      <div className="w-full max-w-md space-y-8">

        {/* Progress bar */}
        {step < 8 && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-zinc-500">
              <span>Step {step} of 7</span>
              <span>{Math.round((step / 7) * 100)}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-zinc-800">
              <div
                className="h-1.5 rounded-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${(step / 7) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* ── Step 1: Gender ── */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-zinc-50">What's your gender?</h2>
              <p className="mt-1 text-sm text-zinc-400">Helps tailor your plan</p>
            </div>
            <div className="space-y-3">
              {GENDERS.map(g => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => setGender(g.value)}
                  className={cn(
                    'flex w-full items-center gap-4 rounded-2xl border p-5 text-left transition-all',
                    gender === g.value
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-zinc-700 bg-zinc-900 hover:border-zinc-600',
                  )}
                >
                  <span className="text-3xl">{g.emoji}</span>
                  <span className="text-lg font-semibold text-zinc-50">{g.label}</span>
                </button>
              ))}
            </div>
            <Button size="lg" className="w-full" disabled={!gender} onClick={next}>Continue</Button>
          </div>
        )}

        {/* ── Step 2: Goal ── */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-zinc-50">What's your goal?</h2>
              <p className="mt-1 text-sm text-zinc-400">Your entire plan is built around this</p>
            </div>
            <div className="space-y-3">
              {GOALS.map(g => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => setGoal(g.value)}
                  className={cn(
                    'flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all',
                    goal === g.value
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-zinc-700 bg-zinc-900 hover:border-zinc-600',
                  )}
                >
                  <span className="text-3xl">{g.emoji}</span>
                  <div>
                    <p className="font-semibold text-zinc-50">{g.label}</p>
                    <p className="text-sm text-zinc-400">{g.desc}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" size="lg" className="flex-1" onClick={back}>Back</Button>
              <Button size="lg" className="flex-1" disabled={!goal} onClick={next}>Continue</Button>
            </div>
          </div>
        )}

        {/* ── Step 3: Focus areas ── */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-zinc-50">Focus areas</h2>
              <p className="mt-1 text-sm text-zinc-400">Select all you want to train</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {FOCUS_AREAS.map(fa => (
                <button
                  key={fa.value}
                  type="button"
                  onClick={() => toggleFocus(fa.value)}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border p-4 text-left transition-all active:scale-95',
                    focusAreas.includes(fa.value)
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-zinc-700 bg-zinc-900 hover:border-zinc-600',
                  )}
                >
                  <span className="text-2xl">{fa.emoji}</span>
                  <span className="font-semibold text-zinc-50 text-sm">{fa.label}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" size="lg" className="flex-1" onClick={back}>Back</Button>
              <Button size="lg" className="flex-1" disabled={focusAreas.length === 0} onClick={next}>Continue</Button>
            </div>
          </div>
        )}

        {/* ── Step 4: Stats + BMI ── */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-zinc-50">Your stats</h2>
              <p className="mt-1 text-sm text-zinc-400">Used to personalise your plan</p>
            </div>
            <div className="space-y-4">
              <Input label="Nickname" type="text" value={nickname} onChange={e => setNickname(e.target.value)} placeholder="GymRat42" />
              <Input label="Age" type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="25" min="10" max="100" />

              {/* Height */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input label="Height" type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder={heightUnit === 'cm' ? '175' : '5.9'} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-zinc-300">Unit</label>
                  <div className="flex h-11 overflow-hidden rounded-xl border border-zinc-700">
                    {(['cm', 'ft'] as const).map(u => (
                      <button key={u} type="button" onClick={() => setHeightUnit(u)}
                        className={cn('flex-1 px-4 text-sm font-medium transition-colors',
                          heightUnit === u ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-900 text-zinc-400')}
                      >{u}</button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Weight */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input label="Weight" type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder={weightUnit === 'kg' ? '75' : '165'} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-zinc-300">Unit</label>
                  <div className="flex h-11 overflow-hidden rounded-xl border border-zinc-700">
                    {(['kg', 'lbs'] as const).map(u => (
                      <button key={u} type="button" onClick={() => setWeightUnit(u)}
                        className={cn('flex-1 px-4 text-sm font-medium transition-colors',
                          weightUnit === u ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-900 text-zinc-400')}
                      >{u}</button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live BMI */}
              {bmi && bmiInfo && (
                <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-zinc-400">BMI</span>
                    <span className={cn('text-sm font-bold', bmiInfo.color)}>
                      {bmi.toFixed(1)} — {bmiInfo.label}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-zinc-800">
                    <div
                      className={cn('h-2 rounded-full transition-all duration-500', bmiBarColor(bmi))}
                      style={{ width: `${Math.min(100, ((bmi - 10) / 30) * 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-zinc-600">
                    <span>10</span><span>18.5</span><span>25</span><span>30</span><span>40+</span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" size="lg" className="flex-1" onClick={back}>Back</Button>
              <Button size="lg" className="flex-1" disabled={!nickname || !age || !height || !weight} onClick={next}>Continue</Button>
            </div>
          </div>
        )}

        {/* ── Step 5: Body type + desired ── */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-zinc-50">Body structure</h2>
              <p className="mt-1 text-sm text-zinc-400">Current type and desired physique</p>
            </div>
            <div className="space-y-3">
              <p className="text-sm font-medium text-zinc-300">Current body type</p>
              {BODY_TYPES.map(bt => (
                <button key={bt.value} type="button" onClick={() => setBodyType(bt.value)}
                  className={cn('flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all',
                    bodyType === bt.value ? 'border-emerald-500 bg-emerald-500/10' : 'border-zinc-700 bg-zinc-900 hover:border-zinc-600')}
                >
                  <div className={cn('h-3.5 w-3.5 rounded-full border-2 flex-shrink-0',
                    bodyType === bt.value ? 'border-emerald-500 bg-emerald-500' : 'border-zinc-600')} />
                  <div>
                    <p className="font-semibold text-zinc-50">{bt.label}</p>
                    <p className="text-xs text-zinc-400">{bt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="space-y-3">
              <p className="text-sm font-medium text-zinc-300">Desired physique</p>
              <div className="grid grid-cols-2 gap-2">
                {DESIRED_BODY.map(db => (
                  <button key={db.value} type="button" onClick={() => setDesiredBody(db.value)}
                    className={cn('rounded-xl border p-3 text-left transition-all',
                      desiredBody === db.value ? 'border-emerald-500 bg-emerald-500/10' : 'border-zinc-700 bg-zinc-900 hover:border-zinc-600')}
                  >
                    <p className="text-sm font-semibold text-zinc-50">{db.label}</p>
                    <p className="text-xs text-zinc-400">{db.desc}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" size="lg" className="flex-1" onClick={back}>Back</Button>
              <Button size="lg" className="flex-1" disabled={!bodyType || !desiredBody} onClick={next}>Continue</Button>
            </div>
          </div>
        )}

        {/* ── Step 6: Build goals ── */}
        {step === 6 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-zinc-50">What do you want to build?</h2>
              <p className="mt-1 text-sm text-zinc-400">Pick your target areas</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {BUILD_GOALS.map(bg => (
                <button key={bg.value} type="button" onClick={() => toggleBuild(bg.value)}
                  className={cn('flex items-center gap-2 rounded-xl border p-3 text-left transition-all active:scale-95',
                    buildGoals.includes(bg.value) ? 'border-emerald-500 bg-emerald-500/10' : 'border-zinc-700 bg-zinc-900 hover:border-zinc-600')}
                >
                  <span className="text-xl">{bg.emoji}</span>
                  <span className="text-sm font-semibold text-zinc-50 leading-tight">{bg.label}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" size="lg" className="flex-1" onClick={back}>Back</Button>
              <Button size="lg" className="flex-1" disabled={buildGoals.length === 0} onClick={next}>Continue</Button>
            </div>
          </div>
        )}

        {/* ── Step 7: Duration + Equipment ── */}
        {step === 7 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-zinc-50">Workout style</h2>
              <p className="mt-1 text-sm text-zinc-400">Duration and equipment available</p>
            </div>
            <div className="space-y-3">
              <p className="text-sm font-medium text-zinc-300">Session length</p>
              {DURATIONS.map(d => (
                <button key={d.value} type="button" onClick={() => setDuration(d.value)}
                  className={cn('flex w-full items-center justify-between rounded-xl border p-4 text-left transition-all',
                    duration === d.value ? 'border-emerald-500 bg-emerald-500/10' : 'border-zinc-700 bg-zinc-900 hover:border-zinc-600')}
                >
                  <span className="font-semibold text-zinc-50">{d.label}</span>
                  <span className="text-sm text-zinc-400">{d.desc}</span>
                </button>
              ))}
            </div>
            <div className="space-y-3">
              <p className="text-sm font-medium text-zinc-300">Equipment</p>
              {EQUIPMENT_OPTIONS.map(eq => (
                <button key={eq.value} type="button" onClick={() => setEquipment(eq.value)}
                  className={cn('flex w-full items-center justify-between rounded-xl border p-4 text-left transition-all',
                    equipment === eq.value ? 'border-emerald-500 bg-emerald-500/10' : 'border-zinc-700 bg-zinc-900 hover:border-zinc-600')}
                >
                  <span className="font-semibold text-zinc-50">{eq.label}</span>
                  <span className="text-sm text-zinc-400">{eq.desc}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" size="lg" className="flex-1" onClick={back}>Back</Button>
              <Button size="lg" className="flex-1" disabled={!duration || !equipment} onClick={next}>Analyse</Button>
            </div>
          </div>
        )}

        {/* ── Step 8: Analyzing animation ── */}
        {step === 8 && (
          <div className="flex flex-col items-center justify-center space-y-8 py-12">
            <div className="relative h-24 w-24">
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-zinc-800 border-t-emerald-500" />
              <div className="absolute inset-3 animate-spin rounded-full border-4 border-zinc-800 border-b-emerald-400 [animation-direction:reverse] [animation-duration:1.5s]" />
              <div className="absolute inset-6 flex items-center justify-center rounded-full bg-emerald-500/10">
                <span className="text-2xl">🧠</span>
              </div>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold text-zinc-50">Analysing your profile…</h2>
              <p className="text-sm text-zinc-400">Building your personalised weekly plan</p>
            </div>
            <div className="w-full space-y-2">
              <div className="flex justify-between text-xs text-zinc-500">
                <span>Processing</span><span>{analyzeProgress}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-zinc-800">
                <div
                  className="h-2 rounded-full bg-emerald-500 transition-all duration-100"
                  style={{ width: `${analyzeProgress}%` }}
                />
              </div>
              <div className="text-xs text-zinc-600 text-center">
                {analyzeProgress < 30 ? 'Evaluating body type & goal…'
                  : analyzeProgress < 60 ? 'Optimising muscle group splits…'
                  : analyzeProgress < 85 ? 'Calculating sets & reps…'
                  : 'Finalising your plan…'}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 9: Weekly plan ── */}
        {step === 9 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-zinc-50">Your weekly plan 🎯</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Personalised for {nickname || 'you'} · {goal?.replace('_', ' ')}
              </p>
            </div>
            <div className="space-y-2">
              {weeklyPlan.map((day, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex items-center justify-between rounded-xl border p-4',
                    day.isRest
                      ? 'border-zinc-800 bg-zinc-900/50'
                      : 'border-zinc-700 bg-zinc-900',
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      'text-xs font-bold w-8 text-center',
                      day.isRest ? 'text-zinc-600' : 'text-emerald-400'
                    )}>
                      {day.day.slice(0, 3).toUpperCase()}
                    </span>
                    <div>
                      <p className={cn('font-semibold capitalize', day.isRest ? 'text-zinc-600' : 'text-zinc-50')}>
                        {day.isRest ? 'Rest & Recovery' : day.focus}
                      </p>
                      {!day.isRest && (
                        <p className="text-xs text-zinc-500">{day.exerciseCount} exercises</p>
                      )}
                    </div>
                  </div>
                  <span className={cn(
                    'text-xs font-medium px-2.5 py-1 rounded-full',
                    day.isRest
                      ? 'bg-zinc-800 text-zinc-600'
                      : 'bg-emerald-500/20 text-emerald-400'
                  )}>
                    {day.isRest ? 'Rest' : 'Train'}
                  </span>
                </div>
              ))}
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <Button size="lg" className="w-full" loading={saving} onClick={handleFinish}>
              Start training 🚀
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
