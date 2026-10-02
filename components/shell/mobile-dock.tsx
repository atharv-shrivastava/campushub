'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'motion/react'
import { Plus } from 'lucide-react'
import { isActive, navItems } from './nav-items'

export function MobileDock() {
  const pathname = usePathname()
  const side = navItems.filter((i) => i.href !== '/upload')
  const left = side.slice(0, 2)
  const right = side.slice(2)

  const renderItem = (item: (typeof navItems)[number]) => {
    const active = isActive(pathname, item.href)
    const Icon = item.icon
    return (
      <li key={item.href} className="flex-1">
        <Link
          href={item.href}
          aria-current={active ? 'page' : undefined}
          className="relative flex flex-col items-center gap-0.5 rounded-2xl py-2 text-[10px] font-medium text-cream/60"
        >
          {active && (
            <motion.span
              layoutId="dock-pill"
              className="absolute inset-x-1 inset-y-0 rounded-2xl bg-cream/10"
              transition={{ type: 'spring', stiffness: 420, damping: 34 }}
            />
          )}
          <Icon className={`relative size-5 ${active ? 'text-champagne' : ''}`} aria-hidden="true" />
          <span className={`relative ${active ? 'text-cream' : ''}`}>
            {item.label === 'Lost & Found' ? 'L & F' : item.label}
          </span>
        </Link>
      </li>
    )
  }

  return (
    <nav aria-label="Primary mobile" className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] md:hidden">
      <ul className="relative mx-auto flex max-w-md items-center rounded-3xl bg-deep/95 px-2 py-1 backdrop-blur-xl paper-shadow-lift">
        {left.map(renderItem)}
        <li className="flex-1">
          <Link
            href="/upload"
            aria-label="Upload a resource"
            className="mx-auto -mt-7 grid size-14 place-items-center rounded-2xl bg-champagne text-deep ring-4 ring-background transition-transform active:scale-90"
            style={{ transform: 'rotate(-4deg)' }}
          >
            <Plus className="size-6" aria-hidden="true" />
          </Link>
        </li>
        {right.map(renderItem)}
      </ul>
    </nav>
  )
}
