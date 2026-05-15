'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import type { GymGroup } from '@/lib/types'
import { Users, Plus, LogIn, Copy, Check, ChevronRight, Trash2, LogOut } from 'lucide-react'

const MAX_OWNED_GROUPS = 3

interface GroupWithMemberCount extends GymGroup {
  gym_group_members: { user_id: string }[]
}

export default function GroupPage() {
  const [groups,   setGroups]   = useState<GroupWithMemberCount[]>([])
  const [userId,   setUserId]   = useState<string | null>(null)
  const [newGroupName, setNewGroupName] = useState('')
  const [inviteCode,   setInviteCode]   = useState('')
  const [loading,  setLoading]  = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [leaving,  setLeaving]  = useState<string | null>(null)
  const [error,    setError]    = useState('')
  const [copied,   setCopied]   = useState<string | null>(null)
  const [mode,     setMode]     = useState<'list' | 'create' | 'join'>('list')

  useEffect(() => { loadGroups() }, [])

  async function loadGroups() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setUserId(user.id)
    const { data: memberships } = await supabase
      .from('gym_group_members')
      .select('group_id')
      .eq('user_id', user.id)
    if (!memberships || memberships.length === 0) { setGroups([]); return }
    const groupIds = memberships.map((m: { group_id: string }) => m.group_id)
    const { data, error } = await supabase
      .from('gym_groups')
      .select('*, gym_group_members(user_id)')
      .in('id', groupIds)
    if (error) setError(error.message)
    setGroups((data ?? []) as GroupWithMemberCount[])
  }

  async function createGroup() {
    if (!newGroupName.trim()) return
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Enforce max 3 owned groups
    const ownedCount = groups.filter(g => g.created_by === user.id).length
    if (ownedCount >= MAX_OWNED_GROUPS) {
      setError(`You can only create up to ${MAX_OWNED_GROUPS} groups`)
      setLoading(false)
      return
    }

    const { data: group, error: groupError } = await supabase
      .from('gym_groups')
      .insert({ name: newGroupName.trim(), created_by: user.id })
      .select()
      .single()

    if (groupError) { setError(groupError.message); setLoading(false); return }

    const { error: memberError } = await supabase
      .from('gym_group_members')
      .insert({ group_id: group.id, user_id: user.id })
    if (memberError) { setError(`Member error: ${memberError.message}`); setLoading(false); return }
    setNewGroupName('')
    setMode('list')
    setLoading(false)
    loadGroups()
  }

  async function deleteGroup(groupId: string) {
    if (!confirm('Delete this group? All members will be removed.')) return
    setDeleting(groupId)
    const supabase = createClient()
    const { error } = await supabase.from('gym_groups').delete().eq('id', groupId)
    if (error) { setError(error.message) }
    setDeleting(null)
    loadGroups()
  }

  async function leaveGroup(groupId: string) {
    if (!confirm('Leave this group?')) return
    setLeaving(groupId)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLeaving(null); return }
    const { error } = await supabase
      .from('gym_group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', user.id)
    if (error) setError(error.message)
    setLeaving(null)
    loadGroups()
  }

  async function joinGroup() {
    if (!inviteCode.trim()) return
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: group, error: findError } = await supabase
      .from('gym_groups')
      .select('id')
      .eq('invite_code', inviteCode.trim().toLowerCase())
      .single()

    if (!group) {
      setError(findError?.code === 'PGRST116' ? 'Group not found. Check the invite code.' : (findError?.message ?? 'Group not found'))
      setLoading(false)
      return
    }

    const { error: joinError } = await supabase
      .from('gym_group_members')
      .insert({ group_id: group.id, user_id: user.id })

    if (joinError && !joinError.message.includes('duplicate')) {
      setError(joinError.message); setLoading(false); return
    }

    setInviteCode('')
    setMode('list')
    setLoading(false)
    loadGroups()
  }

  async function copyCode(code: string) {
    await navigator.clipboard.writeText(code)
    setCopied(code)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-50">Gym Groups</h1>
        <p className="text-sm text-zinc-400">Train with partners and see their progress in real-time</p>
      </div>

      {mode === 'list' && (
        <>
          <div className="flex gap-3">
            <Button className="flex-1 gap-2" onClick={() => { setMode('create'); setError('') }}>
              <Plus className="h-4 w-4" />
              Create group
            </Button>
            <Button variant="secondary" className="flex-1 gap-2" onClick={() => { setMode('join'); setError('') }}>
              <LogIn className="h-4 w-4" />
              Join group
            </Button>
          </div>

          {groups.length === 0 ? (
            <Card className="py-12 text-center space-y-2">
              <Users className="mx-auto h-10 w-10 text-zinc-600" />
              <p className="text-zinc-400">No groups yet</p>
              <p className="text-sm text-zinc-600">Create one or join with an invite code</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {groups.map(group => (
                <Card key={group.id} className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-zinc-50">{group.name}</p>
                        {group.created_by === userId && (
                          <span className="rounded-md bg-zinc-800 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500">owner</span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500">
                        {group.gym_group_members?.length ?? 0} member{(group.gym_group_members?.length ?? 0) !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/group/${group.id}`} className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
                        Activity <ChevronRight className="h-3 w-3" />
                      </Link>
                      {group.created_by === userId ? (
                        <button
                          onClick={() => deleteGroup(group.id)}
                          disabled={deleting === group.id}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-600 hover:bg-red-500/10 hover:text-red-400 transition-colors disabled:opacity-40"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => leaveGroup(group.id)}
                          disabled={leaving === group.id}
                          title="Leave group"
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-600 hover:bg-orange-500/10 hover:text-orange-400 transition-colors disabled:opacity-40"
                        >
                          <LogOut className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2">
                    <span className="flex-1 font-mono text-sm text-zinc-300">{group.invite_code}</span>
                    <button
                      onClick={() => copyCode(group.invite_code)}
                      className="flex h-7 w-7 items-center justify-center rounded text-zinc-400 hover:text-zinc-50 transition-colors"
                    >
                      {copied === group.invite_code ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {mode === 'create' && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-zinc-50">Create a group</h2>
          <Input
            label="Group name"
            value={newGroupName}
            onChange={e => setNewGroupName(e.target.value)}
            placeholder="Monday Warriors"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setMode('list')}>Cancel</Button>
            <Button className="flex-1" loading={loading} onClick={createGroup}>Create</Button>
          </div>
        </div>
      )}

      {mode === 'join' && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-zinc-50">Join with invite code</h2>
          <Input
            label="Invite code"
            value={inviteCode}
            onChange={e => setInviteCode(e.target.value)}
            placeholder="abc12345"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setMode('list')}>Cancel</Button>
            <Button className="flex-1" loading={loading} onClick={joinGroup}>Join</Button>
          </div>
        </div>
      )}
    </div>
  )
}
