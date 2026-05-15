'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { cn, getSetsAndReps } from '@/lib/utils'
import type { Exercise, Goal, GymGroup, MuscleGroup, Profile } from '@/lib/types'
import { Dumbbell, Users, Check, Shuffle, ListChecks, Plus, Minus } from 'lucide-react'

const MUSCLE_GROUPS: { value: MuscleGroup; emoji: string; label: string }[] = [
  { value: 'chest',     emoji: '🫁', label: 'Chest' },
  { value: 'back',      emoji: '🏋️', label: 'Back' },
  { value: 'legs',      emoji: '🦵', label: 'Legs' },
  { value: 'shoulders', emoji: '🔝', label: 'Shoulders' },
  { value: 'arms',      emoji: '💪', label: 'Arms' },
  { value: 'abs',       emoji: '🔥', label: 'Abs' },
  { value: 'butt',      emoji: '🍑', label: 'Glutes' },
  { value: 'cardio',    emoji: '🏃', label: 'Cardio' },
]

const COMPOUND_KEYWORDS = ['squat','deadlift','press','row','pull-up','pullup','chin','dip','barbell','lunge']
const isCompound = (e: Exercise) => COMPOUND_KEYWORDS.some(k => e.name.toLowerCase().includes(k))

function WorkoutInner() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [profile,         setProfile]         = useState<Profile | null>(null)
  const [groups,          setGroups]           = useState<GymGroup[]>([])
  const [selectedGroupId, setSelectedGroupId]  = useState<string | null>(null)
  const [selected,        setSelected]         = useState<MuscleGroup[]>([])
  const [mode,            setMode]             = useState<'auto' | 'custom'>('auto')
  const [allExercises,    setAllExercises]     = useState<Exercise[]>([])
  const [pickedExercises, setPickedExercises]  = useState<Exercise[]>([])
  const [exSearch,        setExSearch]         = useState('')
  const [generating,      setGenerating]       = useState(false)
  const [genError,        setGenError]         = useState('')
  const [customSets,      setCustomSets]       = useState(3)
  const [customReps,      setCustomReps]       = useState(10)
  const [customRest,      setCustomRest]       = useState(90)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const [{ data: prof }, { data: memberships }, { data: exs }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('gym_group_members').select('group_id').eq('user_id', user.id),
        supabase.from('exercises').select('*').order('name'),
      ])
      setProfile(prof)
      setAllExercises((exs ?? []) as Exercise[])
      if (memberships && memberships.length > 0) {
        const ids = memberships.map((m: { group_id: string }) => m.group_id)
        const { data: grps } = await supabase.from('gym_groups').select('*').in('id', ids)
        setGroups(grps ?? [])
      }
      const musclesParam = searchParams.get('muscles')
      if (musclesParam) {
        const valid = MUSCLE_GROUPS.map(mg => mg.value)
        const pre = musclesParam.split(',').filter(m => valid.includes(m as MuscleGroup)) as MuscleGroup[]
        if (pre.length > 0) setSelected(pre)
      }
    }
    load()
  }, [searchParams])

  function toggleMuscle(g: MuscleGroup) {
    setSelected(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g])
    setPickedExercises([]) // reset custom picks when muscles change
  }

  function togglePick(ex: Exercise) {
    setPickedExercises(prev =>
      prev.find(e => e.id === ex.id) ? prev.filter(e => e.id !== ex.id) : [...prev, ex]
    )
  }

  const visibleExercises = allExercises.filter(ex => {
    const inGroup = selected.length === 0 || selected.includes(ex.muscle_group as MuscleGroup)
    const inSearch = !exSearch || ex.name.toLowerCase().includes(exSearch.toLowerCase())
    return inGroup && inSearch
  })

  // Group by muscle for custom picker display
  const exByGroup = MUSCLE_GROUPS
    .map(mg => ({ ...mg, items: visibleExercises.filter(e => e.muscle_group === mg.value) }))
    .filter(g => g.items.length > 0)

  async function startWorkout(customExercises?: Exercise[]) {
    if (!profile) return
    if (selected.length === 0 && !customExercises) return
    setGenerating(true)
    setGenError('')

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setGenerating(false); setGenError('Not logged in'); return }
    if (!profile.goal) { setGenerating(false); setGenError('Set your goal in Settings first'); return }

    const goal = profile.goal as Goal
    const { sets, reps } = getSetsAndReps(goal)

    const muscleGroups = customExercises
      ? [...new Set(customExercises.map(e => e.muscle_group as MuscleGroup))]
      : selected

    const { data: session, error: sessionError } = await supabase
      .from('workout_sessions')
      .insert({ user_id: user.id, goal, muscle_groups: muscleGroups, group_id: selectedGroupId ?? null, rest_seconds: customExercises ? customRest : 90 })
      .select().single()

    if (sessionError || !session) {
      setGenerating(false)
      setGenError(`Session error: ${sessionError?.message}`)
      return
    }

    let finalExercises: Exercise[]

    if (customExercises) {
      finalExercises = customExercises
    } else {
      const { data: exs } = await supabase.from('exercises').select('*').in('muscle_group', selected)
      if (!exs || exs.length === 0) {
        setGenerating(false)
        setGenError('No exercises found — run seed.sql in Supabase SQL Editor')
        return
      }
      const target = Math.min(8, Math.max(4, selected.length * 3))
      const perGroup = Math.ceil(target / selected.length)
      const compounds: Exercise[] = [], isolations: Exercise[] = []
      for (const group of selected) {
        const shuffled = [...(exs as Exercise[]).filter(e => e.muscle_group === group)].sort(() => Math.random() - 0.5)
        for (const ex of shuffled.slice(0, perGroup)) {
          isCompound(ex) ? compounds.push(ex) : isolations.push(ex)
        }
      }
      const seen = new Set<string>()
      finalExercises = [...compounds, ...isolations]
        .filter(e => seen.has(e.id) ? false : (seen.add(e.id), true))
        .slice(0, target)
    }

    const workoutExercises = finalExercises.map((ex, idx) => ({
      session_id: session.id, exercise_id: ex.id,
      sets_total: customExercises ? customSets : sets,
      reps_per_set: customExercises ? customReps : reps,
      order_index: idx,
    }))

    const { data: inserted } = await supabase.from('workout_exercises').insert(workoutExercises).select()
    if (!inserted) { setGenerating(false); setGenError('Failed to insert exercises'); return }

    const setCompletions = inserted.flatMap((we: { id: string; sets_total: number }) =>
      Array.from({ length: we.sets_total }, (_, i) => ({
        workout_exercise_id: we.id, set_number: i + 1, status: 'pending',
      }))
    )
    await supabase.from('set_completions').insert(setCompletions)
    router.push(`/active/${session.id}`)
  }

  const goal = profile?.goal as Goal | null
  const { sets, reps } = goal ? getSetsAndReps(goal) : { sets: 0, reps: 0 }

  return (
    <div className="space-y-6 pb-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-50">Plan your workout</h1>
        <p className="text-sm text-zinc-400">
          {profile ? `Goal: ${profile.goal?.replace(/_/g, ' ')} — ${sets}×${reps} reps` : 'Loading…'}
        </p>
      </div>

      {/* Muscle group selector */}
      <div>
        <p className="mb-3 text-sm font-medium text-zinc-300">Select muscle groups</p>
        <div className="grid grid-cols-2 gap-3">
          {MUSCLE_GROUPS.map(mg => (
            <button key={mg.value} type="button" onClick={() => toggleMuscle(mg.value)}
              className={cn(
                'flex items-center gap-3 rounded-xl border p-4 text-left transition-all active:scale-95',
                selected.includes(mg.value) ? 'border-emerald-500 bg-emerald-500/10' : 'border-zinc-700 bg-zinc-900 hover:border-zinc-600',
              )}
            >
              <span className="text-2xl">{mg.emoji}</span>
              <span className="font-semibold text-zinc-50">{mg.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mode toggle */}
      {selected.length > 0 && (
        <div className="flex rounded-xl border border-zinc-700 overflow-hidden">
          <button type="button" onClick={() => setMode('auto')}
            className={cn('flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium transition-colors',
              mode === 'auto' ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-50')}
          >
            <Shuffle className="h-4 w-4" />
            Auto generate
          </button>
          <button type="button" onClick={() => setMode('custom')}
            className={cn('flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium transition-colors',
              mode === 'custom' ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-50')}
          >
            <ListChecks className="h-4 w-4" />
            Choose my own
          </button>
        </div>
      )}

      {/* Custom config: sets / reps / rest */}
      {mode === 'custom' && selected.length > 0 && (
        <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4 space-y-4">
          <p className="text-sm font-semibold text-zinc-300">Workout config</p>
          <div className="grid grid-cols-2 gap-3">
            {/* Sets stepper */}
            <div className="space-y-1.5">
              <p className="text-xs text-zinc-500">Sets</p>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setCustomSets(s => Math.max(1, s - 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-50 transition-colors">
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-6 text-center text-base font-bold text-zinc-50">{customSets}</span>
                <button type="button" onClick={() => setCustomSets(s => Math.min(6, s + 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-50 transition-colors">
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            {/* Reps stepper */}
            <div className="space-y-1.5">
              <p className="text-xs text-zinc-500">Reps per set</p>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setCustomReps(r => Math.max(1, r - 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-50 transition-colors">
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-6 text-center text-base font-bold text-zinc-50">{customReps}</span>
                <button type="button" onClick={() => setCustomReps(r => Math.min(50, r + 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-50 transition-colors">
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
          {/* Rest time chips */}
          <div className="space-y-1.5">
            <p className="text-xs text-zinc-500">Rest between sets</p>
            <div className="flex flex-wrap gap-2">
              {[30, 45, 60, 90, 120, 180].map(s => (
                <button key={s} type="button" onClick={() => setCustomRest(s)}
                  className={cn(
                    'rounded-lg border px-3 py-1 text-xs font-medium transition-colors',
                    customRest === s
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                      : 'border-zinc-700 text-zinc-400 hover:border-zinc-600',
                  )}>
                  {s < 60 ? `${s}s` : `${s / 60}m`}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Custom exercise picker — library style */}
      {mode === 'custom' && selected.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-300">Pick exercises</p>
            <span className="text-xs text-zinc-500">{pickedExercises.length} selected</span>
          </div>

          {/* Search */}
          <input
            type="text"
            value={exSearch}
            onChange={e => setExSearch(e.target.value)}
            placeholder="Search exercises…"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-50 placeholder-zinc-600 outline-none focus:border-emerald-500 transition-colors"
          />

          {/* Muscle filter tabs */}
          <div className="flex flex-wrap gap-2">
            {MUSCLE_GROUPS.filter(mg => selected.includes(mg.value)).map(mg => (
              <button
                key={mg.value}
                type="button"
                onClick={() => setExSearch('')}
                className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm font-medium text-zinc-400"
              >
                <span>{mg.emoji}</span>
                <span>{mg.label}</span>
              </button>
            ))}
          </div>

          {/* Card grid */}
          {exByGroup.map(group => (
            <div key={group.value} className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                <span>{group.emoji}</span><span>{group.label}</span>
                <span className="text-zinc-700">· {group.items.length}</span>
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {group.items.map(ex => {
                  const picked = !!pickedExercises.find(e => e.id === ex.id)
                  return (
                    <button
                      key={ex.id}
                      type="button"
                      onClick={() => togglePick(ex)}
                      className={cn(
                        'group relative overflow-hidden rounded-2xl border text-left transition-all active:scale-95',
                        picked ? 'border-emerald-500 bg-emerald-500/5' : 'border-zinc-800 bg-zinc-900 hover:border-zinc-600',
                      )}
                    >
                      {/* Image */}
                      <div className="relative aspect-square w-full overflow-hidden bg-zinc-800">
                        {ex.image_url ? (
                          <Image
                            src={ex.image_url}
                            alt={ex.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            unoptimized
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Dumbbell className="h-8 w-8 text-zinc-600" />
                          </div>
                        )}
                        {/* Checkmark badge */}
                        {picked && (
                          <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500">
                            <Check className="h-3.5 w-3.5 text-zinc-950" strokeWidth={3} />
                          </div>
                        )}
                      </div>
                      {/* Label */}
                      <div className="p-2.5">
                        <p className={cn(
                          'text-xs font-semibold leading-tight capitalize line-clamp-2',
                          picked ? 'text-emerald-400' : 'text-zinc-200',
                        )}>{ex.name}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Group selector */}
      {groups.length > 0 && (
        <div>
          <p className="mb-3 text-sm font-medium text-zinc-300 flex items-center gap-2">
            <Users className="h-4 w-4" />
            Train with group? <span className="text-zinc-500">(optional)</span>
          </p>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setSelectedGroupId(null)}
              className={cn('rounded-xl border px-4 py-2 text-sm font-medium transition-all',
                selectedGroupId === null ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-zinc-700 text-zinc-400 hover:border-zinc-600')}
            >Solo</button>
            {groups.map(g => (
              <button key={g.id} type="button" onClick={() => setSelectedGroupId(g.id)}
                className={cn('rounded-xl border px-4 py-2 text-sm font-medium transition-all',
                  selectedGroupId === g.id ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-zinc-700 text-zinc-400 hover:border-zinc-600')}
              >{g.name}</button>
            ))}
          </div>
        </div>
      )}

      {/* Auto preview */}
      {mode === 'auto' && selected.length > 0 && profile && (
        <Card className="space-y-1">
          <p className="text-sm font-medium text-zinc-300">Workout preview</p>
          <p className="text-zinc-50">~{Math.min(8, Math.max(4, selected.length * 3))} exercises · {sets} sets × {reps} reps</p>
          <p className="text-xs text-zinc-500">Compounds first · {selected.join(', ')}</p>
        </Card>
      )}

      {genError && <p className="text-sm text-red-400">{genError}</p>}

      {/* Action buttons */}
      {mode === 'auto' ? (
        <Button size="lg" className="w-full gap-2" disabled={selected.length === 0} loading={generating} onClick={() => startWorkout()}>
          <Shuffle className="h-5 w-5" />
          Generate workout
        </Button>
      ) : (
        <Button size="lg" className="w-full gap-2" disabled={pickedExercises.length === 0} loading={generating} onClick={() => startWorkout(pickedExercises)}>
          <Dumbbell className="h-5 w-5" />
          Start with {pickedExercises.length} exercise{pickedExercises.length !== 1 ? 's' : ''}
        </Button>
      )}
    </div>
  )
}

export default function WorkoutPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-500" /></div>}>
      <WorkoutInner />
    </Suspense>
  )
}
