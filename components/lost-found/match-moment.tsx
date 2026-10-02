'use client'

import { AnimatePresence, motion } from 'motion/react'
import { Check, MessageCircle, Sparkles } from 'lucide-react'
import { useState } from 'react'
import type { LostFoundItem } from '@/lib/data'
import { Sparkle } from '@/components/brand/sparkle'
import { useToast } from '@/components/shell/toast'
import { ItemTag } from './item-tag'

const signals = [
  { label: 'Same place', detail: 'Library · window desks' },
  { label: 'Same colour', detail: 'Sage green' },
  { label: 'Close in time', detail: '1h 45m apart' },
  { label: 'Unique detail', detail: 'Star sticker' },
]

export function MatchMoment({ lost, found }: { lost: LostFoundItem; found: LostFoundItem }) {
  const [state, setState] = useState<'idle' | 'checking' | 'matched'>('idle')
  const toast = useToast()

  const check = () => {
    setState('checking')
    setTimeout(() => setState('matched'), 1500)
  }

  const joined = state === 'matched'

  return (
    <section aria-labelledby="match-heading" className="relative overflow-hidden rounded-[32px] bg-ink p-6 text-cream md:p-10">
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] paper-grid" style={{ filter: 'invert(1)' }} aria-hidden="true" />
      <div className="relative flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-champagne/80">
            <Sparkles className="size-3.5" aria-hidden="true" /> Possible match
          </p>
          <h2 id="match-heading" className="font-serif text-3xl tracking-tight md:text-4xl">
            {joined ? (
              <>
                It&apos;s a <span className="italic text-champagne">match.</span>
              </>
            ) : (
              <>
                These two might <span className="italic text-champagne">belong together.</span>
              </>
            )}
          </h2>
        </div>
        <p className="text-sm text-cream/60 md:max-w-xs md:text-right">
          We compare place, time, colour and little details across reports.
        </p>
      </div>

      <div className="relative mt-8 grid items-center gap-4 md:grid-cols-[1fr_auto_1fr] md:gap-0">
        <motion.div
          animate={joined ? { x: 0, rotate: -2 } : state === 'checking' ? { x: 0, rotate: 0 } : { x: 0, rotate: -3 }}
          className="relative z-10 mx-auto w-full max-w-xs text-deep md:mr-0"
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        >
          <ItemTag item={lost} compact />
        </motion.div>

        <div className="relative flex h-24 items-center justify-center md:h-auto md:w-40" aria-hidden="true">
          <svg viewBox="0 0 160 40" className="absolute h-10 w-40 rotate-90 md:rotate-0" fill="none">
            <motion.path
              d="M0 20 C 40 0, 60 40, 80 20 S 120 0, 160 20"
              stroke="#F3E4C3"
              strokeWidth="2"
              strokeDasharray="4 6"
              strokeLinecap="round"
              initial={{ pathLength: 0.15, opacity: 0.4 }}
              animate={{ pathLength: state === 'idle' ? 0.15 : 1, opacity: state === 'idle' ? 0.4 : 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>
          <AnimatePresence mode="wait">
            {joined ? (
              <motion.span
                key="ok"
                initial={{ scale: 0, rotate: -120 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 14 }}
                className="relative grid size-16 place-items-center rounded-full bg-champagne font-serif text-xl text-deep"
              >
                92%
                {Array.from({ length: 8 }).map((_, i) => {
                  const a = (i / 8) * Math.PI * 2
                  return (
                    <motion.span
                      key={i}
                      className="absolute text-champagne"
                      initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                      animate={{ x: Math.cos(a) * 52, y: Math.sin(a) * 52, opacity: 0, scale: 1 }}
                      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Sparkle className="size-3" />
                    </motion.span>
                  )
                })}
              </motion.span>
            ) : (
              <motion.span
                key="pulse"
                exit={{ scale: 0 }}
                className="relative grid size-12 place-items-center rounded-full border border-champagne/40 bg-deep"
              >
                <span className="absolute inset-0 animate-ping-soft rounded-full bg-champagne/20" />
                <motion.span
                  animate={state === 'checking' ? { rotate: 360 } : { rotate: 0 }}
                  transition={state === 'checking' ? { repeat: Infinity, duration: 1, ease: 'linear' } : {}}
                >
                  <Sparkle className="size-4 text-champagne" />
                </motion.span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          animate={joined ? { x: 0, rotate: 2 } : { x: 0, rotate: 3 }}
          className="relative z-10 mx-auto w-full max-w-xs text-deep md:ml-0"
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        >
          <ItemTag item={found} compact />
        </motion.div>
      </div>

      <div className="relative mt-8 flex flex-col items-center gap-5">
        <AnimatePresence>
          {state !== 'idle' && (
            <motion.ul
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.25 } } }}
              className="grid w-full max-w-2xl grid-cols-2 gap-2 md:grid-cols-4"
            >
              {signals.map((s) => (
                <motion.li
                  key={s.label}
                  variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                  className="rounded-2xl border border-cream/10 bg-cream/5 px-3 py-2.5"
                >
                  <span className="flex items-center gap-1.5 text-xs text-champagne">
                    <Check className="size-3" aria-hidden="true" /> {s.label}
                  </span>
                  <span className="text-xs text-cream/60">{s.detail}</span>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>

        {joined ? (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            type="button"
            onClick={() => toast({ title: 'Message sent to Kabir ✦', description: 'Meet at the library front counter', tone: 'sage' })}
            className="flex items-center gap-2 rounded-full bg-champagne px-5 py-3 text-sm font-medium text-deep transition-transform hover:-translate-y-0.5 active:scale-95"
          >
            <MessageCircle className="size-4" aria-hidden="true" /> Message the finder
          </motion.button>
        ) : (
          <button
            type="button"
            onClick={check}
            disabled={state === 'checking'}
            className="flex items-center gap-2 rounded-full bg-cream px-5 py-3 text-sm font-medium text-deep transition-transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-80"
          >
            {state === 'checking' ? 'Comparing details…' : 'Check this match'}
          </button>
        )}
      </div>
    </section>
  )
}
