'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'motion/react'
import { Bell, Search } from 'lucide-react'
import { Logo } from '@/components/brand/sparkle'
import { useShell } from './app-shell'
import { useToast } from './toast'
import { isActive, navItems } from './nav-items'

export function TopNav() {
  const pathname = usePathname()
  const { openSearch } = useShell()
  const toast = useToast()

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-2xl border border-border/80 bg-cream/80 px-3 py-2 backdrop-blur-xl paper-shadow md:rounded-full md:pl-4">
        <Link href="/" aria-label="CampusHub home" className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className="relative block rounded-full px-3.5 py-2 text-sm font-medium text-deep/70 transition-colors hover:text-deep"
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-ink"
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      />
                    )}
                    <span className={`relative ${active ? 'text-cream' : ''}`}>{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={openSearch}
            className="group flex items-center gap-2 rounded-full border border-border bg-paper px-3 py-2 text-sm text-muted-foreground transition-all hover:border-ink/30 hover:text-deep active:scale-95"
          >
            <Search className="size-4 transition-transform group-hover:-rotate-12" aria-hidden="true" />
            <span className="hidden lg:inline">Search notes, papers…</span>
            <span className="sr-only lg:hidden">Search</span>
            <kbd className="hidden rounded-md border border-border bg-muted px-1.5 font-sans text-[10px] lg:inline">
              ⌘K
            </kbd>
          </button>
          <button
            type="button"
            aria-label="Notifications, 2 unread"
            onClick={() =>
              toast({
                title: 'Possible match for your AirPods case',
                description: 'Kabir found a green case in the library ✦',
                tone: 'ink',
              })
            }
            className="group relative grid size-9 place-items-center rounded-full text-deep transition-colors hover:bg-sage active:scale-95"
          >
            <Bell className="size-[18px] origin-top group-hover:animate-[wiggle_0.5s_ease-in-out]" aria-hidden="true" />
            <span className="absolute right-2 top-2 size-2 rounded-full bg-peach ring-2 ring-cream" />
          </button>
          <span
            className="hidden size-9 place-items-center rounded-full bg-champagne font-serif text-sm text-deep sm:grid"
            aria-label="Signed in as Aanya Sharma"
          >
            AS
          </span>
        </div>
      </div>
      <style>{`@keyframes wiggle{0%,100%{transform:rotate(0)}25%{transform:rotate(14deg)}50%{transform:rotate(-10deg)}75%{transform:rotate(6deg)}}`}</style>
    </header>
  )
}
