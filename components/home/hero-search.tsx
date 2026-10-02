'use client'

import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { searchSuggestions } from '@/lib/data'

export function HeroSearch() {
  const router = useRouter()
  const [q, setQ] = useState('')
  const [focused, setFocused] = useState(false)
  const [hint, setHint] = useState(0)

  useEffect(() => {
    if (q || focused) return
    const t = setInterval(() => setHint((h) => (h + 1) % searchSuggestions.length), 2600)
    return () => clearInterval(t)
  }, [q, focused])

  const submit = (value: string) => {
    if (!value.trim()) return
    router.push(`/library?q=${encodeURIComponent(value)}`)
  }

  return (
    <div>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault()
          submit(q)
        }}
        className="relative"
      >
        <motion.div
          animate={{ scale: focused ? 1.015 : 1, y: focused ? -2 : 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          className={`relative flex items-center gap-3 rounded-[22px] border bg-paper p-2 pl-5 transition-[border-color,box-shadow] duration-300 ${
            focused ? 'border-ink/40 paper-shadow-lift' : 'border-border paper-shadow'
          }`}
        >
          <Search className={`size-5 shrink-0 transition-colors ${focused ? 'text-ink' : 'text-muted-foreground'}`} aria-hidden="true" />
          <div className="relative min-w-0 flex-1">
            <label htmlFor="hero-search" className="sr-only">
              Search CampusHub
            </label>
            <input
              id="hero-search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              autoComplete="off"
              className="w-full bg-transparent py-3 font-serif text-lg text-deep outline-none md:text-xl"
            />
            {!q && (
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center overflow-hidden font-serif text-lg text-muted-foreground/70 md:text-xl">
                <span className="mr-1.5 hidden sm:inline">Search</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={hint}
                    initial={{ y: 16, opacity: 0, rotate: 2 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: -16, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="italic"
                  >
                    “{searchSuggestions[hint]}”
                  </motion.span>
                </AnimatePresence>
              </span>
            )}
          </div>
          <button
            type="submit"
            className="group flex shrink-0 items-center gap-2 rounded-2xl bg-ink px-4 py-3 text-sm font-medium text-cream transition-all hover:bg-deep active:scale-95"
          >
            <span className="hidden sm:inline">Find it</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </button>
        </motion.div>
      </form>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground">Trending:</span>
        {searchSuggestions.slice(0, 4).map((s, i) => (
          <motion.button
            key={s}
            type="button"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.06 }}
            onClick={() => submit(s)}
            className="rounded-full border border-border bg-paper/80 px-3 py-1 text-xs text-deep transition-all hover:-translate-y-0.5 hover:border-ink/30 hover:bg-sage active:scale-95"
          >
            {s}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
