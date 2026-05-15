'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'
import { Plus, Trash2, X, ImagePlus } from 'lucide-react'
import type { MuscleGroup } from '@/lib/types'

const MUSCLE_GROUPS: MuscleGroup[] = ['chest', 'back', 'legs', 'shoulders', 'arms', 'abs', 'butt']

export function AddExerciseForm() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [open,        setOpen]        = useState(false)
  const [name,        setName]        = useState('')
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>('chest')
  const [imageFile,   setImageFile]   = useState<File | null>(null)
  const [preview,     setPreview]     = useState<string | null>(null)
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState('')

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setError('Image must be under 5 MB'); return }
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
    setError('')
  }

  function reset() {
    setName(''); setMuscleGroup('chest'); setImageFile(null); setPreview(null); setError('')
    setOpen(false)
  }

  async function handleAdd() {
    if (!name.trim()) { setError('Name required'); return }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    let imageUrl: string | null = null

    if (imageFile) {
      const ext  = imageFile.name.split('.').pop()
      const path = `${user.id}/${Date.now()}.${ext}`
      const { error: uploadErr } = await supabase.storage
        .from('exercise-images')
        .upload(path, imageFile, { upsert: true })
      if (uploadErr) { setError(`Upload failed: ${uploadErr.message}`); setLoading(false); return }
      const { data: { publicUrl } } = supabase.storage.from('exercise-images').getPublicUrl(path)
      imageUrl = publicUrl
    }

    const { error: err } = await supabase.from('exercises').insert({
      name: name.trim(),
      muscle_group: muscleGroup,
      created_by: user.id,
      ...(imageUrl ? { image_url: imageUrl } : {}),
    })
    if (err) { setError(err.message); setLoading(false); return }
    reset()
    setLoading(false)
    router.refresh()
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} className="gap-2">
        <Plus className="h-4 w-4" />
        Add exercise
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-950/80 backdrop-blur-sm"
          onClick={reset}
        >
          <div
            className="w-full max-w-md rounded-t-3xl border-t border-zinc-700 bg-zinc-900 p-5 space-y-4 pb-8"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <p className="font-semibold text-zinc-50">New exercise</p>
              <button onClick={reset} className="text-zinc-500 hover:text-zinc-300">
                <X className="h-4 w-4" />
              </button>
            </div>

            <Input
              label="Exercise name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Cable Fly"
              autoFocus
            />

            {/* Image upload */}
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-zinc-300">Image <span className="text-zinc-600">(optional)</span></p>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              {preview ? (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-zinc-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="preview" className="w-full h-full object-contain" />
                  <button
                    type="button"
                    onClick={() => { setImageFile(null); setPreview(null); if (fileRef.current) fileRef.current.value = '' }}
                    className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900/80 text-zinc-300 hover:text-red-400 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-700 py-6 text-sm text-zinc-500 hover:border-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  <ImagePlus className="h-5 w-5" />
                  Tap to upload image
                </button>
              )}
            </div>

            <div className="space-y-1.5">
              <p className="text-sm font-medium text-zinc-300">Muscle group</p>
              <div className="flex flex-wrap gap-2">
                {MUSCLE_GROUPS.map(mg => (
                  <button
                    key={mg}
                    type="button"
                    onClick={() => setMuscleGroup(mg)}
                    className={cn(
                      'rounded-lg border px-3 py-1.5 text-sm font-medium capitalize transition-colors',
                      muscleGroup === mg
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                        : 'border-zinc-700 text-zinc-400 hover:border-zinc-600',
                    )}
                  >
                    {mg}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}
            <Button className="w-full" loading={loading} onClick={handleAdd}>
              Add exercise
            </Button>
          </div>
        </div>
      )}
    </>
  )
}

export function DeleteExerciseButton({ exerciseId }: { exerciseId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm('Delete this exercise?')) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from('exercises').delete().eq('id', exerciseId)
    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-50"
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  )
}
