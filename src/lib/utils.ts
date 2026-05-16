import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { DayPlan, Equipment, FocusArea, Goal, MuscleGroup, WorkoutDuration } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getSetsAndReps(goal: Goal): { sets: number; reps: number } {
  switch (goal) {
    case 'fat_loss':    return { sets: 3, reps: 17 }
    case 'toned':       return { sets: 3, reps: 15 }
    case 'endurance':   return { sets: 4, reps: 20 }
    case 'muscle_gain': return { sets: 3, reps: 10 }
    case 'strength':    return { sets: 5, reps: 5  }
    case 'max_strength':return { sets: 5, reps: 3  }
  }
}

export function goalLabel(goal: Goal): string {
  const map: Record<Goal, string> = {
    fat_loss: 'Fat Loss',
    muscle_gain: 'Muscle Gain',
    strength: 'Strength',
    endurance: 'Endurance',
    max_strength: 'Max Strength',
    toned: 'Get Toned',
  }
  return map[goal] ?? goal
}

export function generateInviteCode(): string {
  return Math.random().toString(36).slice(2, 10).toUpperCase()
}

export function calcBMI(weightKg: number, heightCm: number): number {
  const hm = heightCm / 100
  return weightKg / (hm * hm)
}

export function bmiLabel(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-400' }
  if (bmi < 25)   return { label: 'Healthy',     color: 'text-emerald-400' }
  if (bmi < 30)   return { label: 'Overweight',  color: 'text-amber-400' }
  return              { label: 'Obese',          color: 'text-red-400' }
}

export function bmiBarColor(bmi: number): string {
  if (bmi < 18.5) return 'bg-blue-400'
  if (bmi < 25)   return 'bg-emerald-400'
  if (bmi < 30)   return 'bg-amber-400'
  return 'bg-red-400'
}

// ─── Weekly plan generator ────────────────────────────────────────────────────

const PUSH: MuscleGroup[] = ['chest', 'shoulders']
const PULL: MuscleGroup[] = ['back']
const ARMS: MuscleGroup[] = ['biceps', 'triceps', 'forearms']
const CORE: MuscleGroup[] = ['abs']
const LOWER: MuscleGroup[] = ['legs', 'glutes', 'calves']

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

function intersect(a: MuscleGroup[], b: MuscleGroup[]): MuscleGroup[] {
  return a.filter(x => b.includes(x))
}

export function generateWeeklyPlan(
  goal: Goal,
  focusAreas: FocusArea[],
  duration: WorkoutDuration,
  _equipment: Equipment,
): DayPlan[] {
  const exerciseCount = duration === '30' ? 4 : duration === '45' ? 6 : 8

  const isFullBody = focusAreas.includes('full_body')
  const muscles: MuscleGroup[] = isFullBody
    ? ['chest', 'back', 'legs', 'shoulders', 'biceps', 'triceps', 'forearms', 'abs', 'glutes', 'calves']
    : (focusAreas.filter(a => a !== 'full_body') as MuscleGroup[])

  const push = intersect(PUSH, muscles)
  const pull = intersect(PULL, muscles)
  const arms = intersect(ARMS, muscles)
  const core = intersect(CORE, muscles)
  const lower = intersect(LOWER, muscles)

  // Build training blocks (non-empty only)
  let blocks: MuscleGroup[][] = []

  if (goal === 'max_strength' || goal === 'strength') {
    // 4-day upper/lower
    const upper1 = [...push, ...arms].filter(Boolean)
    const upper2 = [...pull, ...arms].filter(Boolean)
    const leg = [...lower, ...core].filter(Boolean)
    blocks = [upper1, leg, upper2, leg].filter(b => b.length > 0)
    if (blocks.length === 0) blocks = [muscles]
  } else if (goal === 'endurance') {
    // 6-day, rotate all areas
    const all = [...push, ...pull, ...lower, ...arms, ...core]
    if (all.length <= 3) {
      blocks = [all, all, all, all, all, all]
    } else {
      const half = Math.ceil(all.length / 2)
      blocks = [all.slice(0, half), all.slice(half), all, all.slice(0, half), all.slice(half), all]
    }
  } else {
    // 5-day: push / pull / legs / arms+core / repeat
    const day1 = push.length > 0 ? push : muscles.slice(0, 1)
    const day2 = pull.length > 0 ? pull : muscles.slice(0, 1)
    const day3 = lower.length > 0 ? lower : muscles.slice(0, 1)
    const day4 = [...arms, ...core].filter(Boolean).length > 0 ? [...arms, ...core] : muscles.slice(0, 1)
    const day5 = [...push, ...pull].filter(Boolean).length > 0 ? [...push, ...pull].slice(0, 2) : muscles.slice(0, 1)
    blocks = [day1, day2, day3, day4, day5]
  }

  // Determine training frequency
  const freq = goal === 'max_strength' || goal === 'strength' ? 4
    : goal === 'endurance' ? 6
    : 5

  // Slot into 7-day week with rest days
  const slotPositions: Record<number, number[]> = {
    3: [0, 2, 4],
    4: [0, 1, 3, 4],
    5: [0, 1, 2, 3, 4],
    6: [0, 1, 2, 3, 4, 5],
  }
  const slots = slotPositions[freq] ?? [0, 1, 2, 3, 4]

  return DAYS.map((day, i) => {
    const slotIdx = slots.indexOf(i)
    if (slotIdx >= 0) {
      const block = blocks[slotIdx % blocks.length] ?? []
      return {
        day,
        isRest: block.length === 0,
        muscleGroups: block,
        focus: block.length > 0
          ? block.map(m => m.charAt(0).toUpperCase() + m.slice(1)).join(' + ')
          : 'Rest',
        exerciseCount: block.length > 0 ? exerciseCount : 0,
      }
    }
    return { day, isRest: true, muscleGroups: [], focus: 'Rest & Recovery', exerciseCount: 0 }
  })
}
