'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Trash2 } from 'lucide-react'

export function DeleteWorkoutButton({ sessionId }: { sessionId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm('Delete this workout?')) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from('workout_sessions').delete().eq('id', sessionId)
    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-2 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-50"
      aria-label="Delete workout"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  )
}
