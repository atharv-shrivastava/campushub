'use client'

import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, CornerDownLeft, FileText, Search, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { categoryLabel, searchSuggestions, subjectByCode } from '@/lib/data'
import { searchResources } from '@/lib/search'
import { Sparkle } from '@/components/brand/sparkle'

export function CommandSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('')
  const [index, setIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const results = useMemo(() => (q.trim() ? searchResources(q).slice(0, 5) : []), [q])

  useEffect(() => {
    if (open) {
      setQ('')
      setIndex(0)
      const t = setTimeout(() => inputRef.current?.focus(), 60)
      return () => clearTimeout(t)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const go = (path: string) => {
    onClose()
    router.push(path)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setIndex((i) => Math.min(i + 1, Math.max(results.length - 1, 0)))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      if (e.nativeEvent.isComposing || e.keyCode === 229) return
      if (results[index]) go(`/resource/${results[index].id}`)
      else if (q.trim()) go(`/library?q=${encodeURIComponent(q)}`)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-start justify-center px-3 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close search"
            onClick={onClose}
            className="absolute inset-0 bg-deep/30 backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search CampusHub"
            initial={{ opacity: 0, y: -16, scale: 0.97, rotate: -0.6 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-border bg-paper paper-shadow-lift"
          >
            <div className="flex items-center gap-3 border-b border-border px-5 py-4">
              <Search className="size-5 text-ink" aria-hidden="true" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value)
                  setIndex(0)
                }}
                onKeyDown={onKeyDown}
                placeholder="Try “Data Structures Unit 3”"
                aria-label="Search resources"
                className="min-w-0 flex-1 bg-transparent font-serif text-xl text-deep outline-none placeholder:text-muted-foreground/60"
              />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-muted"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="max-h-[50vh] overflow-y-auto p-2">
              {!q.trim() ? (
                <div className="p-3">
                  <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    Popular this week
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {searchSuggestions.map((s, i) => (
                      <motion.button
                        key={s}
                        type="button"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * i }}
                        onClick={() => setQ(s)}
                        className="rounded-full border border-border bg-cream px-3 py-1.5 text-sm text-deep transition-all hover:-translate-y-0.5 hover:border-ink/30 hover:bg-sage"
                      >
                        {s}
                      </motion.button>
                    ))}
                  </div>
                </div>
              ) : results.length ? (
                <ul>
                  {results.map((r, i) => {
                    const s = subjectByCode(r.subjectCode)
                    return (
                      <motion.li
                        key={r.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <button
                          type="button"
                          onMouseEnter={() => setIndex(i)}
                          onClick={() => go(`/resource/${r.id}`)}
                          className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors ${
                            index === i ? 'bg-sage/70' : ''
                          }`}
                        >
                          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-champagne text-ink">
                            <FileText className="size-4" aria-hidden="true" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium text-deep">{r.title}</span>
                            <span className="block text-xs text-muted-foreground">
                              {s.code} · {categoryLabel[r.category]}
                            </span>
                          </span>
                          {index === i && <CornerDownLeft className="size-4 text-ink" aria-hidden="true" />}
                        </button>
                      </motion.li>
                    )
                  })}
                  <li>
                    <button
                      type="button"
                      onClick={() => go(`/library?q=${encodeURIComponent(q)}`)}
                      className="flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-sm text-ink hover:bg-muted"
                    >
                      See all results in the library
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </button>
                  </li>
                </ul>
              ) : (
                <div className="flex flex-col items-center gap-2 py-10 text-center">
                  <Sparkle className="size-6 animate-twinkle text-peach" />
                  <p className="font-serif text-lg text-deep">Nothing found for “{q}”</p>
                  <p className="text-sm text-muted-foreground">Try a subject code like CS-204.</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
