export type BodyType = 'ectomorph' | 'mesomorph' | 'endomorph'
export type DesiredBody = 'slim' | 'athletic' | 'muscular' | 'bulky'
export type Goal = 'fat_loss' | 'muscle_gain' | 'strength' | 'endurance' | 'max_strength' | 'toned'
export type WeightUnit = 'kg' | 'lbs'
export type HeightUnit = 'cm' | 'ft'
export type MuscleGroup = 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'abs' | 'butt' | 'cardio'
export type FocusArea = MuscleGroup | 'full_body'
export type Equipment = 'none' | 'basic' | 'all'
export type WorkoutDuration = '30' | '45' | '60+'
export type Gender = 'male' | 'female' | 'other'
export type SetStatus = 'pending' | 'completed' | 'skipped'

export interface DayPlan {
  day: string
  isRest: boolean
  muscleGroups: MuscleGroup[]
  focus: string
  exerciseCount: number
}

export interface Profile {
  id: string
  username: string | null
  gender: Gender | null
  age: number | null
  height: number | null
  height_unit: HeightUnit
  weight: number | null
  weight_unit: WeightUnit
  body_type: BodyType | null
  desired_body: DesiredBody | null
  goal: Goal | null
  focus_areas: FocusArea[] | null
  build_goals: string[] | null
  equipment: Equipment | null
  workout_duration: WorkoutDuration | null
  weekly_plan: DayPlan[] | null
  onboarded: boolean
  created_at: string
}

export interface Exercise {
  id: string
  name: string
  muscle_group: MuscleGroup
  image_url: string | null
  created_at: string
  created_by?: string | null
}

export interface GymGroup {
  id: string
  name: string
  invite_code: string
  created_by: string | null
  created_at: string
}

export interface GymGroupMember {
  group_id: string
  user_id: string
  joined_at: string
}

export interface WorkoutSession {
  id: string
  user_id: string
  group_id: string | null
  goal: Goal
  muscle_groups: MuscleGroup[]
  completed_at: string | null
  created_at: string
}

export interface WorkoutExercise {
  id: string
  session_id: string
  exercise_id: string
  sets_total: number
  reps_per_set: number
  order_index: number
  exercise?: Exercise
}

export interface SetCompletion {
  id: string
  workout_exercise_id: string
  set_number: number
  status: SetStatus
  completed_at: string | null
}

export interface WorkoutExerciseWithSets extends WorkoutExercise {
  set_completions: SetCompletion[]
}
