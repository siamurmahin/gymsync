import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ExerciseLibrary } from '@/components/ExerciseLibrary'
import type { Exercise, DayPlan } from '@/lib/types'

export default async function ExercisesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: exercises }, { data: profile }] = await Promise.all([
    supabase.from('exercises').select('*').order('name', { ascending: true }),
    supabase.from('profiles').select('weekly_plan').eq('id', user.id).single(),
  ])

  return (
    <ExerciseLibrary
      exercises={(exercises ?? []) as Exercise[]}
      userId={user.id}
      weeklyPlan={(profile?.weekly_plan ?? []) as DayPlan[]}
    />
  )
}
