import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Fraunces, Geist } from 'next/font/google'
import { AppShell } from '@/components/shell/app-shell'
import './globals.css'

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', axes: ['SOFT', 'opsz'], style: ['normal', 'italic'] })
const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

export const metadata: Metadata = {
  title: 'CampusHub — your campus, beautifully alive',
  description: 'A mobile-first student ecosystem for resources, requests, Cred, events, Lost & Found and campus life.',
  generator: 'CampusHub',
  icons: { icon: [{ url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' }, { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' }, { url: '/icon.svg', type: 'image/svg+xml' }], apple: '/apple-icon.png' },
}
export const viewport: Viewport = { colorScheme: 'light', themeColor: '#0B2924', viewportFit: 'cover' }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${fraunces.variable} ${geist.variable}`}><body className="antialiased"><AppShell>{children}</AppShell>{process.env.NODE_ENV === 'production' && <Analytics />}</body></html>
}
