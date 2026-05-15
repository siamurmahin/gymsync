import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Dumbbell, CheckCircle2, BarChart2, CalendarDays, Users } from 'lucide-react'

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) redirect('/dashboard')

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'GymSync',
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Web, iOS, Android',
    description:
      'Free workout planner and tracker for gym beginners. Never forget your exercises, sets, or reps again.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Organization',
      name: 'Websylime',
      url: 'https://websylime.com',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '120',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-50">
        {/* Nav */}
        <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500">
              <Dumbbell className="h-5 w-5 text-zinc-950" />
            </div>
            <span className="text-lg font-bold tracking-tight">GymSync</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-zinc-400 hover:text-zinc-50 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-emerald-400 transition-colors"
            >
              Get started free
            </Link>
          </div>
        </header>

        {/* Hero */}
        <main className="flex-1">
          <section className="mx-auto max-w-3xl px-6 py-20 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              Free for gym beginners
            </div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Never forget your{' '}
              <span className="text-emerald-400">gym workout</span> again
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-zinc-400">
              GymSync is the workout planner built for gym beginners. Track every exercise, set, and rep — walk into the gym knowing exactly what to do next.
            </p>
            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/signup"
                className="w-full rounded-xl bg-emerald-500 px-8 py-4 text-base font-bold text-zinc-950 hover:bg-emerald-400 transition-colors sm:w-auto"
              >
                Start tracking for free
              </Link>
              <Link
                href="/login"
                className="w-full rounded-xl border border-zinc-800 px-8 py-4 text-base font-medium text-zinc-300 hover:border-zinc-600 hover:text-zinc-50 transition-colors sm:w-auto"
              >
                Already have an account
              </Link>
            </div>
          </section>

          {/* Problem section */}
          <section className="mx-auto max-w-3xl px-6 py-12">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center">
              <h2 className="text-2xl font-bold sm:text-3xl">
                Starting the gym is hard enough
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-zinc-400">
                Most beginners waste mental energy trying to remember which machine they used last time, how many sets they did, or what their weights were. GymSync removes that friction — your entire workout history is one tap away.
              </p>
            </div>
          </section>

          {/* Features */}
          <section className="mx-auto max-w-5xl px-6 py-12">
            <h2 className="text-center text-2xl font-bold sm:text-3xl">
              Everything you need to stay consistent
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <CalendarDays className="mb-4 h-8 w-8 text-emerald-400" />
                <h3 className="font-semibold text-zinc-50">Plan your workouts</h3>
                <p className="mt-2 text-sm text-zinc-400">
                  Build workout plans in advance so you always walk in with a clear routine.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <CheckCircle2 className="mb-4 h-8 w-8 text-emerald-400" />
                <h3 className="font-semibold text-zinc-50">Log sets &amp; reps</h3>
                <p className="mt-2 text-sm text-zinc-400">
                  Track every set, rep, and weight during your session — no pen or paper needed.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <BarChart2 className="mb-4 h-8 w-8 text-emerald-400" />
                <h3 className="font-semibold text-zinc-50">See your progress</h3>
                <p className="mt-2 text-sm text-zinc-400">
                  Watch your strength grow over time with clear progress charts and history.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <Users className="mb-4 h-8 w-8 text-emerald-400" />
                <h3 className="font-semibold text-zinc-50">Train with a partner</h3>
                <p className="mt-2 text-sm text-zinc-400">
                  Sync workouts with a gym buddy in real time and stay accountable together.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="mx-auto max-w-3xl px-6 py-16 text-center">
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Ready to level up your gym game?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-zinc-400">
              Join hundreds of gym beginners who use GymSync to stay on track. Free forever — no credit card required.
            </p>
            <Link
              href="/signup"
              className="mt-8 inline-block rounded-xl bg-emerald-500 px-10 py-4 text-base font-bold text-zinc-950 hover:bg-emerald-400 transition-colors"
            >
              Create your free account
            </Link>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-zinc-800 py-8 text-center text-sm text-zinc-500">
          <p>
            &copy; {new Date().getFullYear()} GymSync. Built by{' '}
            <a
              href="https://websylime.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Websylime
            </a>
            .
          </p>
        </footer>
      </div>
    </>
  )
}
