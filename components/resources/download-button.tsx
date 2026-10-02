'use client'

import { AnimatePresence, motion } from 'motion/react'
import { ArrowDown, Check } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useToast } from '@/components/shell/toast'

export function DownloadButton({ title, sizeMb }: { title: string; sizeMb: number }) {
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle')
  const [progress, setProgress] = useState(0)
  const toast = useToast()

  useEffect(() => {
    if (state !== 'loading') return
    const t = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(p + Math.random() * 18 + 6, 100)
        if (next >= 100) {
          clearInterval(t)
          setTimeout(() => {
            setState('done')
            toast({ title: 'Downloaded ✦', description: `${title} is on your device`, tone: 'ink' })
          }, 200)
        }
        return next
      })
    }, 180)
    return () => clearInterval(t)
  }, [state, title, toast])

  useEffect(() => {
    if (state !== 'done') return
    const t = setTimeout(() => {
      setState('idle')
      setProgress(0)
    }, 2800)
    return () => clearTimeout(t)
  }, [state])

  return (
    <button
      type="button"
      disabled={state === 'loading'}
      onClick={() => state === 'idle' && setState('loading')}
      className="group relative flex h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-ink px-6 text-cream transition-transform active:scale-[0.98] disabled:cursor-progress"
    >
      <motion.span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 bg-champagne"
        animate={{ width: state === 'idle' ? '0%' : `${state === 'done' ? 100 : progress}%` }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      />
      <span className="relative grid size-7 place-items-center overflow-hidden rounded-full bg-cream/10">
        <AnimatePresence mode="wait" initial={false}>
          {state === 'done' ? (
            <motion.span key="check" initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} className="text-deep">
              <Check className="size-4" />
            </motion.span>
          ) : (
            <motion.span
              key="arrow"
              animate={state === 'loading' ? { y: [-14, 14] } : { y: 0 }}
              transition={state === 'loading' ? { repeat: Infinity, duration: 0.7, ease: 'easeIn' } : {}}
              className="group-hover:animate-bounce"
            >
              <ArrowDown className={`size-4 ${state === 'loading' && progress > 50 ? 'text-deep' : ''}`} />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      <span className={`relative text-sm font-medium transition-colors ${state !== 'idle' && (progress > 45 || state === 'done') ? 'text-deep' : ''}`}>
        {state === 'idle' && `Download PDF · ${sizeMb} MB`}
        {state === 'loading' && `Fetching pages… ${Math.round(progress)}%`}
        {state === 'done' && 'Saved to your device'}
      </span>
    </button>
  )
}
