'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { AddExerciseForm, DeleteExerciseButton } from '@/components/ExerciseActions'
import { createClient } from '@/lib/supabase/client'
import type { Exercise, MuscleGroup, DayPlan } from '@/lib/types'
import { X, Dumbbell, Plus, Check, CalendarDays } from 'lucide-react'

const FILTERS: { value: MuscleGroup | 'all'; label: string; emoji: string }[] = [
  { value: 'all',       label: 'All',       emoji: '⚡' },
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

interface Props {
  exercises: Exercise[]
  userId: string
  weeklyPlan: DayPlan[]
}

// Animated image: cycles frames for free-exercise-db, Ken Burns pan for all others
function AnimatedExerciseImage({ url, alt }: { url: string; alt: string }) {
  const [src, setSrc] = useState(url)
  const [animating, setAnimating] = useState(false)
  const isGithub = url.includes('githubusercontent.com')
  const baseUrl = url.replace(/\/\d+\.jpg$/, '')

  useEffect(() => {
    setSrc(url)
    setAnimating(false)
    if (!isGithub) return
    const probe = new window.Image()
    probe.onload  = () => setAnimating(true)
    probe.onerror = () => {}
    probe.src = `${baseUrl}/1.jpg`
  }, [url, baseUrl, isGithub])

  useEffect(() => {
    if (!animating) return
    let frame = 0
    const id = setInterval(() => {
      frame = frame === 0 ? 1 : 0
      setSrc(`${baseUrl}/${frame}.jpg`)
    }, 650)
    return () => clearInterval(id)
  }, [animating, baseUrl])

  if (!isGithub) {
    return (
      <Image
        key={url}
        src={url}
        alt={alt}
        fill
        className="object-cover animate-ken-burns"
        unoptimized
      />
    )
  }

  return <Image key={src} src={src} alt={alt} fill className="object-contain" unoptimized />
}

// "Add to plan" panel inside the modal
function AddToPlanPanel({ exercise, userId, weeklyPlan }: { exercise: Exercise; userId: string; weeklyPlan: DayPlan[] }) {
  const [planExercises, setPlanExercises] = useState<{ day: string }[]>([])
  const [saving, setSaving] = useState<string | null>(null)

  const trainingDays = weeklyPlan.filter(d => !d.isRest)

  useEffect(() => {
    const supabase = createClient()
    supabase.from('plan_exercises')
      .select('day')
      .eq('user_id', userId)
      .eq('exercise_id', exercise.id)
      .then(({ data }) => setPlanExercises(data ?? []))
  }, [exercise.id, userId])

  async function toggle(day: string) {
    setSaving(day)
    const supabase = createClient()
    const alreadyIn = planExercises.some(p => p.day === day)
    if (alreadyIn) {
      await supabase.from('plan_exercises')
        .delete()
        .eq('user_id', userId)
        .eq('exercise_id', exercise.id)
        .eq('day', day)
      setPlanExercises(prev => prev.filter(p => p.day !== day))
    } else {
      await supabase.from('plan_exercises')
        .insert({ user_id: userId, exercise_id: exercise.id, day })
      setPlanExercises(prev => [...prev, { day }])
    }
    setSaving(null)
  }

  if (trainingDays.length === 0) {
    return (
      <p className="text-xs text-zinc-600 flex items-center gap-1.5">
        <CalendarDays className="h-3.5 w-3.5" />
        Set up your weekly plan first to add exercises to days.
      </p>
    )
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
        <CalendarDays className="h-3.5 w-3.5" />
        Add to plan
      </p>
      <div className="flex flex-wrap gap-2">
        {trainingDays.map(d => {
          const added = planExercises.some(p => p.day === d.day)
          return (
            <button
              key={d.day}
              onClick={() => toggle(d.day)}
              disabled={saving === d.day}
              className={cn(
                'flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all disabled:opacity-50',
                added
                  ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400'
                  : 'border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200',
              )}
            >
              {added ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
              {d.day.slice(0, 3)}
              {d.focus && d.focus !== 'Rest' && (
                <span className="text-zinc-600">· {d.focus.split('+')[0].trim()}</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function ExerciseLibrary({ exercises, userId, weeklyPlan }: Props) {
  const [filter,   setFilter]   = useState<MuscleGroup | 'all'>('all')
  const [search,   setSearch]   = useState('')
  const [selected, setSelected] = useState<Exercise | null>(null)

  const filtered = exercises.filter(ex => {
    const matchGroup  = filter === 'all' || ex.muscle_group === filter
    const matchSearch = !search || ex.name.toLowerCase().includes(search.toLowerCase())
    return matchGroup && matchSearch
  })

  const grouped = filter === 'all'
    ? FILTERS.filter(f => f.value !== 'all').map(f => ({
        label: f.label, emoji: f.emoji, group: f.value as MuscleGroup,
        items: filtered.filter(ex => ex.muscle_group === f.value),
      })).filter(g => g.items.length > 0)
    : [{
        label: FILTERS.find(f => f.value === filter)!.label,
        emoji: FILTERS.find(f => f.value === filter)!.emoji,
        group: filter as MuscleGroup,
        items: filtered,
      }]

  return (
    <>
      {/* ── Exercise detail modal ── */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-950/80 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-md rounded-t-3xl border-t border-zinc-700 bg-zinc-900 pb-8 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Image */}
            <div className="relative h-96 w-full overflow-hidden rounded-t-3xl bg-zinc-800 flex-shrink-0">
              {selected.image_url ? (
                <AnimatedExerciseImage url={selected.image_url} alt={selected.name} />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Dumbbell className="h-16 w-16 text-zinc-600" />
                </div>
              )}
              {selected.image_url?.includes('githubusercontent.com') && (
                <span className="absolute bottom-3 left-3 rounded-md bg-zinc-900/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                  animated
                </span>
              )}
              <button
                onClick={() => setSelected(null)}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900/80 text-zinc-300 hover:text-zinc-50 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Info */}
            <div className="p-5 space-y-4">
              <div>
                <h2 className="text-xl font-bold text-zinc-50 capitalize">{selected.name}</h2>
                <span className="inline-block mt-1 rounded-lg bg-emerald-500/15 px-2.5 py-1 text-xs font-medium capitalize text-emerald-400">
                  {selected.muscle_group}
                </span>
              </div>

              {/* Add to plan */}
              <AddToPlanPanel exercise={selected} userId={userId} weeklyPlan={weeklyPlan} />

              {selected.created_by === userId && (
                <div className="pt-1 border-t border-zinc-800">
                  <DeleteExerciseButton exerciseId={selected.id} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-50">Exercise Library</h1>
            <p className="text-sm text-zinc-400">{exercises.length} exercises</p>
          </div>
          <AddExerciseForm />
        </div>

        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search exercises…"
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-50 placeholder-zinc-600 outline-none focus:border-emerald-500 transition-colors"
        />

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2">
          {FILTERS.map(f => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={cn(
                'flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition-all',
                filter === f.value
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                  : 'border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-600',
              )}
            >
              <span>{f.emoji}</span>
              <span>{f.label}</span>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 py-12 text-center">
            <p className="text-zinc-500">No exercises found</p>
          </div>
        )}

        {grouped.map(group => (
          <div key={group.group} className="space-y-2">
            <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              <span>{group.emoji}</span>
              <span>{group.label}</span>
              <span className="text-zinc-700">· {group.items.length}</span>
            </h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {group.items.map(ex => (
                <button
                  key={ex.id}
                  type="button"
                  onClick={() => setSelected(ex)}
                  className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 text-left transition-all hover:border-zinc-600 active:scale-95"
                >
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
                  </div>
                  <div className="p-2.5">
                    <p className="text-xs font-semibold text-zinc-200 leading-tight capitalize line-clamp-2">{ex.name}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
