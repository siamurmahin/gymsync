'use client'

import { use, useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Progress } from '@/components/ui/Progress'
import type { WorkoutExerciseWithSets, SetStatus, Exercise } from '@/lib/types'
import { Check, X, ChevronLeft, Trophy, Share2, Timer, SkipForward, Plus, Minus } from 'lucide-react'

interface PageProps { params: Promise<{ id: string }> }
type ExerciseRow = WorkoutExerciseWithSets & { exercise: Exercise }

// ─── Rest Timer overlay ───────────────────────────────────────────────────────
function RestTimer({ onDone, initialSecs = 90 }: { onDone: () => void; initialSecs?: number }) {
  const [secs, setSecs] = useState(initialSecs)
  const [paused, setPaused] = useState(false)
  const ref = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (paused) return
    ref.current = setInterval(() => {
      setSecs(s => {
        if (s <= 1) { clearInterval(ref.current!); onDone(); return 0 }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(ref.current!)
  }, [paused, onDone])

  const pct = Math.min(100, (secs / initialSecs) * 100)
  const m = Math.floor(secs / 60)
  const s = secs % 60

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-t-3xl border-t border-zinc-700 bg-zinc-900 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Timer className="h-5 w-5 text-emerald-400" />
            <span className="font-semibold text-zinc-50">Rest</span>
          </div>
          <button onClick={onDone} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-50 border border-zinc-700 hover:border-zinc-500 transition-colors">
            <SkipForward className="h-4 w-4" />
            Skip
          </button>
        </div>

        {/* Circular countdown */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-32 w-32">
            <svg className="h-32 w-32 -rotate-90" viewBox="0 0 128 128">
              <circle cx="64" cy="64" r="56" fill="none" stroke="#27272a" strokeWidth="8" />
              <circle
                cx="64" cy="64" r="56" fill="none"
                stroke="#10b981" strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - pct / 100)}`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold tabular-nums text-zinc-50">
                {m}:{s.toString().padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Adjust time */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSecs(s => Math.max(10, s - 30))}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-50 transition-colors"
            >
              <Minus className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPaused(p => !p)}
              className="rounded-xl border border-zinc-700 px-5 py-2 text-sm font-medium text-zinc-300 hover:border-zinc-500 hover:text-zinc-50 transition-colors"
            >
              {paused ? 'Resume' : 'Pause'}
            </button>
            <button
              onClick={() => setSecs(s => s + 30)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-50 transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Completion screen ────────────────────────────────────────────────────────
function CompletionScreen({
  exercises,
  sessionGoal,
  startedAt,
  onGoHome,
}: {
  exercises: ExerciseRow[]
  sessionGoal: string
  startedAt: Date
  onGoHome: () => void
}) {
  const allSets = exercises.flatMap(e => e.set_completions)
  const completedSets = allSets.filter(s => s.status === 'completed').length
  const skippedSets  = allSets.filter(s => s.status === 'skipped').length
  const elapsedMin   = Math.round((Date.now() - startedAt.getTime()) / 60000)
  const muscles      = [...new Set(exercises.map(e => e.exercise.muscle_group))]

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md space-y-6 text-center">
        {/* Trophy */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-yellow-400/10 ring-4 ring-yellow-400/30">
            <Trophy className="h-12 w-12 text-yellow-400" />
          </div>
          <h1 className="text-3xl font-bold text-zinc-50">Workout Done!</h1>
          <p className="text-zinc-400 capitalize">{sessionGoal}</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Sets done',  value: completedSets },
            { label: 'Skipped',   value: skippedSets },
            { label: 'Minutes',   value: elapsedMin },
          ].map(stat => (
            <div key={stat.label} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 space-y-1">
              <p className="text-2xl font-bold text-zinc-50">{stat.value}</p>
              <p className="text-xs text-zinc-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Muscles trained */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-left space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Muscles trained</p>
          <div className="flex flex-wrap gap-2">
            {muscles.map(m => (
              <span key={m} className="rounded-lg bg-emerald-500/15 px-2.5 py-1 text-xs font-medium capitalize text-emerald-400">
                {m}
              </span>
            ))}
          </div>
        </div>

        <Button size="lg" className="w-full" onClick={onGoHome}>
          Back to dashboard
        </Button>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ActiveWorkoutPage({ params }: PageProps) {
  const { id: sessionId } = use(params)
  const router = useRouter()
  const startedAt = useRef(new Date())
  const [exercises,    setExercises]    = useState<ExerciseRow[]>([])
  const [loading,      setLoading]      = useState(true)
  const [completing,   setCompleting]   = useState(false)
  const [sessionGoal,  setSessionGoal]  = useState('')
  const [copied,       setCopied]       = useState(false)
  const [showTimer,    setShowTimer]    = useState(false)
  const [showDone,     setShowDone]     = useState(false)
  const [restSecs,     setRestSecs]     = useState(90)

  async function shareSession() {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const computeProgress = useCallback((exs: ExerciseRow[]) => {
    const all = exs.flatMap(e => e.set_completions)
    if (all.length === 0) return 0
    return (all.filter(s => s.status !== 'pending').length / all.length) * 100
  }, [])

  const progress = computeProgress(exercises)

  useEffect(() => {
    const supabase = createClient()
    async function load() {
      const { data: session } = await supabase
        .from('workout_sessions').select('goal,rest_seconds').eq('id', sessionId).single()
      if (session) {
        setSessionGoal(session.goal.replace(/_/g, ' '))
        if (session.rest_seconds) setRestSecs(session.rest_seconds)
      }

      const { data } = await supabase
        .from('workout_exercises')
        .select('*, exercise:exercises(*), set_completions(*)')
        .eq('session_id', sessionId)
        .order('order_index')
      if (data) setExercises(data as ExerciseRow[])
      setLoading(false)
    }
    load()

    const channel = supabase
      .channel(`session:${sessionId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'set_completions' }, (payload) => {
        setExercises(prev => prev.map(ex => ({
          ...ex,
          set_completions: ex.set_completions.map(sc =>
            sc.id === payload.new.id ? { ...sc, ...payload.new } : sc,
          ),
        })))
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [sessionId])

  async function updateSet(setId: string, currentStatus: SetStatus) {
    const next: SetStatus =
      currentStatus === 'pending'   ? 'completed' :
      currentStatus === 'completed' ? 'skipped'   : 'pending'

    setExercises(prev => prev.map(ex => ({
      ...ex,
      set_completions: ex.set_completions.map(sc =>
        sc.id === setId
          ? { ...sc, status: next, completed_at: next === 'completed' ? new Date().toISOString() : null }
          : sc,
      ),
    })))

    if (next === 'completed') setShowTimer(true)

    const supabase = createClient()
    await supabase.from('set_completions')
      .update({ status: next, completed_at: next === 'completed' ? new Date().toISOString() : null })
      .eq('id', setId)
  }

  async function finishWorkout(markComplete: boolean) {
    setCompleting(true)
    const supabase = createClient()
    if (markComplete) {
      await supabase.from('workout_sessions')
        .update({ completed_at: new Date().toISOString() })
        .eq('id', sessionId)
      setCompleting(false)
      setShowDone(true)
    } else {
      router.push('/dashboard')
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-500" />
      </div>
    )
  }

  return (
    <>
      {showTimer && <RestTimer onDone={() => setShowTimer(false)} initialSecs={restSecs} />}
      {showDone && (
        <CompletionScreen
          exercises={exercises}
          sessionGoal={sessionGoal}
          startedAt={startedAt.current}
          onGoHome={() => router.push('/dashboard')}
        />
      )}

      <div className="space-y-4 pb-24">
        {/* Sticky progress */}
        <div className="sticky top-14 z-30 -mx-4 border-b border-zinc-800 bg-zinc-950/95 px-4 py-3 backdrop-blur">
          <Progress value={progress} label="Workout progress" />
        </div>

        {/* Header */}
        <div className="flex items-center gap-3 pt-2">
          <button onClick={() => router.push('/dashboard')} className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-zinc-50 transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-bold text-zinc-50">Active Workout</h1>
            <p className="text-xs text-zinc-400 capitalize">{sessionGoal}</p>
          </div>
          <button
            onClick={shareSession}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:border-zinc-600 hover:text-zinc-50 transition-colors"
          >
            <Share2 className="h-3.5 w-3.5" />
            {copied ? 'Copied!' : 'Share'}
          </button>
        </div>

        {/* Exercise list */}
        {exercises.map(ex => (
          <div key={ex.id} className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
            <div className="flex items-center gap-3 p-4">
              {ex.exercise?.image_url ? (
                <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-zinc-800">
                  <Image
                    src={ex.exercise.image_url}
                    alt={ex.exercise.name}
                    width={56} height={56}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="h-14 w-14 flex-shrink-0 rounded-xl bg-zinc-800 flex items-center justify-center">
                  <span className="text-2xl">💪</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-zinc-50 truncate capitalize">{ex.exercise?.name}</p>
                <p className="text-xs text-zinc-400 capitalize">{ex.exercise?.muscle_group}</p>
              </div>
              <span className="text-sm font-medium text-zinc-400 flex-shrink-0">
                {ex.sets_total}×{ex.reps_per_set}
              </span>
            </div>

            <div className="divide-y divide-zinc-800 border-t border-zinc-800">
              {ex.set_completions
                .sort((a, b) => a.set_number - b.set_number)
                .map(sc => (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => updateSet(sc.id, sc.status)}
                    className={cn(
                      'flex w-full items-center gap-4 px-4 py-3.5 text-left transition-colors active:scale-[0.99]',
                      sc.status === 'completed' && 'bg-emerald-500/10',
                      sc.status === 'skipped'   && 'bg-zinc-800/50',
                      sc.status === 'pending'   && 'hover:bg-zinc-800/30',
                    )}
                  >
                    <div className={cn(
                      'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border-2 transition-all',
                      sc.status === 'completed' && 'border-emerald-500 bg-emerald-500',
                      sc.status === 'skipped'   && 'border-zinc-600 bg-zinc-800',
                      sc.status === 'pending'   && 'border-zinc-600',
                    )}>
                      {sc.status === 'completed' && <Check className="h-4 w-4 text-zinc-950" strokeWidth={3} />}
                      {sc.status === 'skipped'   && <X className="h-4 w-4 text-zinc-400" strokeWidth={3} />}
                    </div>
                    <span className={cn(
                      'flex-1 font-medium transition-colors',
                      sc.status === 'completed' && 'text-emerald-400',
                      sc.status === 'skipped'   && 'text-zinc-500 line-through',
                      sc.status === 'pending'   && 'text-zinc-300',
                    )}>
                      Set {sc.set_number} — {ex.reps_per_set} reps
                    </span>
                    <span className={cn(
                      'text-xs font-medium',
                      sc.status === 'completed' && 'text-emerald-500',
                      sc.status === 'skipped'   && 'text-zinc-600',
                      sc.status === 'pending'   && 'text-zinc-600',
                    )}>
                      {sc.status === 'completed' ? 'Done' : sc.status === 'skipped' ? 'Skip' : 'Tap'}
                    </span>
                  </button>
                ))}
            </div>
          </div>
        ))}

        {/* Bottom action */}
        <div className="fixed bottom-0 left-0 right-0 border-t border-zinc-800 bg-zinc-950/95 p-4 backdrop-blur">
          <div className="mx-auto max-w-2xl">
            {progress === 100 ? (
              <Button size="lg" className="w-full gap-2" loading={completing} onClick={() => finishWorkout(true)}>
                <Trophy className="h-5 w-5" />
                Finish workout!
              </Button>
            ) : (
              <Button variant="secondary" size="lg" className="w-full" loading={completing} onClick={() => finishWorkout(false)}>
                End workout early ({Math.round(progress)}% done)
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
