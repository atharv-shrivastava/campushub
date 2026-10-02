'use client'

import { AnimatePresence, motion } from 'motion/react'
import { Bookmark } from 'lucide-react'
import { useState } from 'react'
import { Sparkle } from '@/components/brand/sparkle'
import { useShell } from '@/components/shell/app-shell'
import { useToast } from '@/components/shell/toast'
import { cn } from '@/lib/utils'

export function BookmarkButton({ id, title, className }: { id: string; title: string; className?: string }) {
  const { saved, toggleSaved } = useShell()
  const toast = useToast()
  const [burst, setBurst] = useState(0)
  const isSaved = saved.has(id)

  return (
    <button
      type="button"
      aria-pressed={isSaved}
      aria-label={isSaved ? `Remove ${title} from saved` : `Save ${title}`}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        const nowSaved = toggleSaved(id)
        if (nowSaved) {
          setBurst((b) => b + 1)
          toast({ title: 'Tucked into your saved shelf ✦', description: title, tone: 'ink' })
        }
      }}
      className={cn(
        'relative grid size-9 place-items-center rounded-full bg-paper/90 text-ink backdrop-blur transition-transform hover:scale-105 active:scale-90',
        className,
      )}
    >
      <motion.span
        key={String(isSaved)}
        initial={{ scale: 0.4, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 15 }}
      >
        <Bookmark className={cn('size-4', isSaved && 'fill-ink')} aria-hidden="true" />
      </motion.span>
      <AnimatePresence>
        {burst > 0 && (
          <motion.span key={burst} className="pointer-events-none absolute inset-0" aria-hidden="true">
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <motion.span
                key={deg}
                className="absolute left-1/2 top-1/2 text-peach"
                initial={{ x: '-50%', y: '-50%', scale: 0, opacity: 1 }}
                animate={{
                  x: `calc(-50% + ${Math.cos((deg * Math.PI) / 180) * 22}px)`,
                  y: `calc(-50% + ${Math.sin((deg * Math.PI) / 180) * 22}px)`,
                  scale: [0, 1, 0],
                  opacity: [1, 1, 0],
                }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <Sparkle className="size-2.5" />
              </motion.span>
            ))}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
