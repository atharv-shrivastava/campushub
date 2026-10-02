'use client'

import { AnimatePresence, motion } from 'motion/react'
import { createContext, useCallback, useContext, useState } from 'react'
import { Sparkle } from '@/components/brand/sparkle'

type Toast = { id: number; title: string; description?: string; tone?: 'ink' | 'peach' | 'sage' }

const ToastContext = createContext<(t: Omit<Toast, 'id'>) => void>(() => {})

export const useToast = () => useContext(ToastContext)

const toneClass = {
  ink: 'bg-ink text-cream',
  peach: 'bg-peach text-deep',
  sage: 'bg-sage text-deep',
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const push = useCallback((t: Omit<Toast, 'id'>) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev.slice(-2), { ...t, id }])
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 3600)
  }, [])

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-24 z-[70] flex flex-col items-center gap-2 px-4 md:bottom-auto md:left-auto md:right-6 md:top-24 md:items-end"
      >
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 24, rotate: -3, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl px-4 py-3 paper-shadow-lift ${toneClass[t.tone ?? 'ink']}`}
            >
              <Sparkle className="mt-0.5 size-4 shrink-0 animate-twinkle text-champagne" />
              <div className="min-w-0">
                <p className="text-sm font-medium">{t.title}</p>
                {t.description && <p className="mt-0.5 text-xs opacity-75">{t.description}</p>}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
