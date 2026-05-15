'use client'

import { use, useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/Card'
import { Progress } from '@/components/ui/Progress'
import { ChevronLeft, Users, MessageSquare, Activity, Send, Zap } from 'lucide-react'

interface SetCompletion { status: string }
interface WorkoutExercise { id: string; set_completions: SetCompletion[] }
interface SessionWithProgress {
  id: string
  user_id: string
  muscle_groups: string[]
  goal: string
  completed_at: string | null
  created_at: string
  profiles: { username: string | null }
  workout_exercises: WorkoutExercise[]
}
interface Member {
  user_id: string
  profiles: { username: string | null }
}
interface Message {
  id: string
  group_id: string
  sender_id: string
  content: string | null
  type: 'text' | 'poke'
  created_at: string
}

type Tab = 'activity' | 'chat' | 'members'

function calcProgress(session: SessionWithProgress) {
  const all = session.workout_exercises.flatMap(e => e.set_completions)
  if (all.length === 0) return 0
  return (all.filter(s => s.status !== 'pending').length / all.length) * 100
}

function vibrate(pattern: number | number[]) {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(pattern)
}

export default function GroupActivityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: groupId } = use(params)
  const router = useRouter()
  const [tab, setTab]         = useState<Tab>('activity')
  const [groupName, setGroupName] = useState('')
  const [sessions,  setSessions]  = useState<SessionWithProgress[]>([])
  const [members,   setMembers]   = useState<Member[]>([])
  const [messages,  setMessages]  = useState<Message[]>([])
  const [userId,    setUserId]    = useState<string | null>(null)
  const [loading,   setLoading]   = useState(true)
  const [text,      setText]      = useState('')
  const [sending,   setSending]   = useState(false)
  const [poking,    setPoking]    = useState(false)
  const [chatError, setChatError] = useState('')
  const messagesEndRef  = useRef<HTMLDivElement>(null)
  const mounted         = useRef(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chatChannelRef  = useRef<any>(null)
  const userIdRef       = useRef<string | null>(null)

  const nameMap = useRef<Map<string, string>>(new Map())
  useEffect(() => {
    nameMap.current = new Map(members.map(m => [m.user_id, m.profiles?.username ?? 'Member']))
  }, [members])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const supabase = createClient()

    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) { setUserId(user.id); userIdRef.current = user.id }

      const [{ data: group }, { data: sessData }, { data: membersData }, { data: msgData, error: msgErr }] =
        await Promise.all([
          supabase.from('gym_groups').select('name').eq('id', groupId).single(),
          supabase
            .from('workout_sessions')
            .select('id,user_id,muscle_groups,goal,completed_at,created_at,profiles(username),workout_exercises(id,set_completions(status))')
            .eq('group_id', groupId)
            .order('created_at', { ascending: false })
            .limit(30),
          supabase
            .from('gym_group_members')
            .select('user_id')
            .eq('group_id', groupId),
          supabase
            .from('group_messages')
            .select('id,group_id,sender_id,content,type,created_at')
            .eq('group_id', groupId)
            .order('created_at', { ascending: true })
            .limit(100),
        ])

      if (group) setGroupName(group.name)
      setSessions((sessData ?? []) as unknown as SessionWithProgress[])
      if (msgErr) console.error('messages load error:', msgErr)
      setMessages((msgData ?? []) as Message[])

      // Fetch profiles for members separately (gym_group_members.user_id → auth.users, not profiles)
      const memberIds = (membersData ?? []).map((m: { user_id: string }) => m.user_id)
      console.log('memberIds:', memberIds)
      if (memberIds.length > 0) {
        const { data: profilesData, error: profilesErr } = await supabase
          .from('profiles')
          .select('id,username')
          .in('id', memberIds)
        console.log('profilesData:', profilesData, 'err:', profilesErr)
        const profileMap = new Map((profilesData ?? []).map((p: { id: string; username: string | null }) => [p.id, p.username]))
        setMembers(memberIds.map((uid: string) => ({
          user_id: uid,
          profiles: { username: profileMap.get(uid) ?? null },
        })))
      } else {
        setMembers([])
      }
      setLoading(false)
    }

    load()

    // Realtime: workout progress via postgres_changes
    const actCh = supabase
      .channel(`grp-act:${groupId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'set_completions' }, async () => {
        const { data } = await supabase
          .from('workout_sessions')
          .select('id,user_id,muscle_groups,goal,completed_at,created_at,profiles(username),workout_exercises(id,set_completions(status))')
          .eq('group_id', groupId)
          .order('created_at', { ascending: false })
          .limit(30)
        setSessions((data ?? []) as unknown as SessionWithProgress[])
      })
      .subscribe()

    // Realtime: chat via Broadcast (bypasses RLS, instant cross-user delivery)
    const chatCh = supabase
      .channel(`grp-chat:${groupId}`)
      .on('broadcast', { event: 'message' }, ({ payload }: { payload: Message }) => {
        const me = userIdRef.current
        if (me && payload.sender_id === me) return  // sender already has optimistic update
        vibrate(payload.type === 'poke' ? [200, 100, 200, 100, 200] : 80)
        setMessages(prev => prev.some(m => m.id === payload.id) ? prev : [...prev, payload])
      })
      .subscribe()

    chatChannelRef.current = chatCh

    return () => {
      supabase.removeChannel(actCh)
      supabase.removeChannel(chatCh)
      chatChannelRef.current = null
    }
  }, [groupId])

  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return }
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    if (tab === 'chat') setTimeout(scrollToBottom, 60)
  }, [tab, scrollToBottom])

  async function sendMessage() {
    if (!text.trim() || !userId) return
    const content = text.trim()
    setText('')
    setChatError('')
    setSending(true)

    const tempId = `temp-${Date.now()}`
    const optimistic: Message = { id: tempId, group_id: groupId, sender_id: userId, content, type: 'text', created_at: new Date().toISOString() }
    setMessages(prev => [...prev, optimistic])

    const supabase = createClient()
    const { data, error } = await supabase
      .from('group_messages')
      .insert({ group_id: groupId, sender_id: userId, content, type: 'text' })
      .select('id,group_id,sender_id,content,type,created_at')
      .single()

    if (error) {
      console.error('send error:', error)
      setChatError(error.message)
      setMessages(prev => prev.filter(m => m.id !== tempId))
    } else if (data) {
      const msg = data as Message
      setMessages(prev => prev.map(m => m.id === tempId ? msg : m))
      // Broadcast to all other members in the channel
      chatChannelRef.current?.send({ type: 'broadcast', event: 'message', payload: msg })
    }
    setSending(false)
  }

  async function pokeGroup() {
    if (!userId || poking) return
    setPoking(true)
    setChatError('')

    const tempId = `temp-poke-${Date.now()}`
    const optimistic: Message = { id: tempId, group_id: groupId, sender_id: userId, content: null, type: 'poke', created_at: new Date().toISOString() }
    setMessages(prev => [...prev, optimistic])
    setTab('chat')

    const supabase = createClient()
    const { data, error } = await supabase
      .from('group_messages')
      .insert({ group_id: groupId, sender_id: userId, content: null, type: 'poke' })
      .select('id,group_id,sender_id,content,type,created_at')
      .single()

    if (error) {
      console.error('poke error:', error)
      setChatError(error.message)
      setMessages(prev => prev.filter(m => m.id !== tempId))
    } else if (data) {
      const msg = data as Message
      setMessages(prev => prev.map(m => m.id === tempId ? msg : m))
      chatChannelRef.current?.send({ type: 'broadcast', event: 'message', payload: msg })
    }
    setPoking(false)
  }

  const TABS = [
    { key: 'activity' as Tab, label: 'Activity', icon: Activity },
    { key: 'chat'     as Tab, label: 'Chat',     icon: MessageSquare },
    { key: 'members'  as Tab, label: 'Members',  icon: Users },
  ]

  return (
    <div className="flex flex-col space-y-4 pb-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/group')}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-zinc-50 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-zinc-50">{groupName || 'Group'}</h1>
          <p className="text-sm text-zinc-400">{members.length} member{members.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="flex rounded-xl bg-zinc-900 p-1 gap-1">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-all ${
              tab === key ? 'bg-zinc-800 text-zinc-50' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-500" />
        </div>
      )}

      {/* ── Activity ── */}
      {!loading && tab === 'activity' && (
        <div className="space-y-3">
          {sessions.length === 0 && (
            <Card className="py-12 text-center space-y-2">
              <Users className="mx-auto h-10 w-10 text-zinc-600" />
              <p className="text-zinc-400">No workouts yet</p>
              <p className="text-sm text-zinc-600">Start a workout and tag this group to see activity</p>
            </Card>
          )}
          {sessions.map(session => {
            const progress = calcProgress(session)
            const isActive = !session.completed_at && progress > 0
            return (
              <Link key={session.id} href={`/active/${session.id}`}>
                <Card className="space-y-3 hover:border-zinc-700 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-zinc-50">{session.profiles?.username ?? 'Partner'}</p>
                      <p className="text-xs text-zinc-500 capitalize">
                        {session.muscle_groups.join(', ')} · {session.goal.replace('_', ' ')}
                      </p>
                      <p className="text-xs text-zinc-600">{new Date(session.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ${
                      session.completed_at
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : isActive
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {session.completed_at ? 'Done' : isActive ? 'Active' : 'Not started'}
                    </span>
                  </div>
                  <Progress value={progress} label={`${Math.round(progress)}% complete`} />
                </Card>
              </Link>
            )
          })}
        </div>
      )}

      {/* ── Chat ── */}
      {!loading && tab === 'chat' && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2 min-h-[300px] max-h-[55vh] overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
            {messages.length === 0 && (
              <p className="m-auto text-sm text-zinc-600">No messages yet. Say hi!</p>
            )}
            {messages.map(msg => {
              const isMe = msg.sender_id === userId
              const name = nameMap.current.get(msg.sender_id) ?? 'Member'
              return (
                <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  {!isMe && <span className="mb-0.5 px-1 text-[10px] text-zinc-500">{name}</span>}
                  {msg.type === 'poke' ? (
                    <div className={`flex items-center gap-1.5 rounded-2xl px-3 py-1.5 text-sm font-medium ${
                      isMe ? 'bg-orange-500/20 text-orange-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      <Zap className="h-3.5 w-3.5" />
                      {isMe ? 'You poked the group ⚡' : `${name} poked! ⚡`}
                    </div>
                  ) : (
                    <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm leading-snug ${
                      isMe ? 'bg-emerald-500 text-zinc-950 font-medium' : 'bg-zinc-800 text-zinc-50'
                    }`}>
                      {msg.content}
                    </div>
                  )}
                  <span className="mt-0.5 px-1 text-[9px] text-zinc-600">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>

          {chatError && <p className="text-xs text-red-400">{chatError}</p>}

          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
              placeholder="Message…"
              className="flex-1 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-zinc-50 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none transition-colors"
            />
            <button
              onClick={sendMessage}
              disabled={!text.trim() || sending}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-zinc-950 hover:bg-emerald-400 disabled:opacity-40 transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Members ── */}
      {!loading && tab === 'members' && (
        <div className="space-y-2">
          {members.map(m => {
            const isMe = m.user_id === userId
            const name = m.profiles?.username ?? 'Member'
            return (
              <Card key={m.user_id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800 text-sm font-bold text-zinc-300">
                    {name[0]?.toUpperCase() ?? '?'}
                  </div>
                  <div>
                    <p className="font-medium text-zinc-50">{name}</p>
                    {isMe && <p className="text-xs text-zinc-500">You</p>}
                  </div>
                </div>
                {!isMe && (
                  <button
                    onClick={pokeGroup}
                    disabled={poking}
                    className="flex items-center gap-1.5 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-3 py-1.5 text-xs font-medium text-yellow-400 hover:bg-yellow-500/20 transition-colors disabled:opacity-40"
                  >
                    <Zap className="h-3 w-3" />
                    Poke
                  </button>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
