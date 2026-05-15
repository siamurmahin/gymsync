'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Dumbbell, LayoutDashboard, ListChecks, UserCircle,
  TrendingUp, CalendarDays, Users, Settings, LogOut, Menu, X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

const NAV_LINKS = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/progress',  icon: TrendingUp,      label: 'Progress' },
  { href: '/exercises', icon: ListChecks,      label: 'Exercises' },
  { href: '/planner',   icon: CalendarDays,    label: 'Weekly Planner' },
  { href: '/group',     icon: Users,           label: 'Gym Groups' },
  { href: '/profile',   icon: UserCircle,      label: 'Profile' },
  { href: '/settings',  icon: Settings,        label: 'Settings' },
]

export function MobileNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  // Close on route change
  useEffect(() => { setOpen(false) }, [pathname])

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const isActive = (href: string) =>
    pathname === href || (href !== '/dashboard' && pathname.startsWith(href + '/'))

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">

          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-zinc-50">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500">
              <Dumbbell className="h-4 w-4 text-zinc-950" />
            </div>
            GymSync
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                aria-label={label}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
                  isActive(href)
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-50',
                )}
              >
                <Icon className="h-5 w-5" />
              </Link>
            ))}
            <button type="button" onClick={handleSignOut} className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-red-400 transition-colors">
              <LogOut className="h-5 w-5" />
            </button>
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-zinc-50 transition-colors md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Off-canvas overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-zinc-950/70 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Off-canvas panel — slides from right */}
      <div
        className={cn(
          'fixed right-0 top-0 z-50 flex h-full w-72 flex-col bg-zinc-900 border-l border-zinc-800 shadow-2xl transition-transform duration-300 ease-in-out md:hidden',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Panel header */}
        <div className="flex h-14 items-center justify-between border-b border-zinc-800 px-5">
          <span className="font-bold text-zinc-50">Menu</span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-zinc-50 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV_LINKS.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                isActive(href)
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : 'text-zinc-300 hover:bg-zinc-800 hover:text-zinc-50',
              )}
            >
              <Icon className={cn('h-5 w-5 flex-shrink-0', isActive(href) ? 'text-emerald-400' : 'text-zinc-500')} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Sign out at bottom */}
        <div className="border-t border-zinc-800 px-3 py-4">
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut className="h-5 w-5 flex-shrink-0 text-zinc-600" />
            Sign out
          </button>
        </div>
      </div>
    </>
  )
}
