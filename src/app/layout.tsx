import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gymsync.app'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'GymSync – Free Workout Planner for Gym Beginners',
    template: '%s | GymSync',
  },
  description:
    'Never forget your gym exercises or sets again. GymSync is the free workout tracker built for beginners — plan workouts, log sets & reps, and stay consistent at the gym.',
  keywords: [
    'workout planner for beginners',
    'gym tracker app',
    'exercise tracker',
    'workout log',
    'beginner gym workout app',
    'track sets and reps',
    'gym workout planner',
    'free workout tracker',
    'remember gym exercises',
    'workout schedule app',
  ],
  authors: [{ name: 'Websylime', url: 'https://websylime.com' }],
  creator: 'Websylime',
  publisher: 'Websylime',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'GymSync',
    title: 'GymSync – Free Workout Planner for Gym Beginners',
    description:
      'Never forget your gym exercises or sets again. Free workout tracker built for beginners — plan workouts, log sets & reps, stay consistent.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GymSync – Workout Planner for Gym Beginners',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GymSync – Free Workout Planner for Gym Beginners',
    description:
      'Never forget your gym exercises or sets again. Free workout tracker for beginners.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'GymSync',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#09090b',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} dark`} suppressHydrationWarning>
      <body className="min-h-screen bg-zinc-950 text-zinc-50 antialiased" suppressHydrationWarning>
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  )
}
