'use client'

import { motion } from 'motion/react'
import { Sparkle } from './sparkle'
import { cn } from '@/lib/utils'

type Kind = 'notes' | 'search' | 'lost' | 'saved'

function Illustration({ kind }: { kind: Kind }) {
  if (kind === 'search') {
    return (
      <svg viewBox="0 0 96 80" className="h-20 w-24" fill="none" aria-hidden="true">
        <rect x="14" y="10" width="46" height="58" rx="6" fill="#FFFDF7" stroke="#123C35" strokeWidth="2" />
        <path d="M24 26h26M24 34h20M24 42h24" stroke="#D9E5DC" strokeWidth="3" strokeLinecap="round" />
        <g className="origin-[62px_50px] animate-float-soft">
          <circle cx="62" cy="46" r="14" fill="#F3E4C3" fillOpacity=".6" stroke="#123C35" strokeWidth="2.5" />
          <path d="M72 56l12 12" stroke="#123C35" strokeWidth="4" strokeLinecap="round" />
        </g>
      </svg>
    )
  }
  if (kind === 'lost') {
    return (
      <svg viewBox="0 0 96 80" className="h-20 w-24" fill="none" aria-hidden="true">
        <path d="M18 34l30-14 30 14v28L48 76 18 62V34Z" fill="#F3E4C3" stroke="#123C35" strokeWidth="2" strokeLinejoin="round" />
        <path d="M18 34l30 14 30-14M48 48v28" stroke="#123C35" strokeWidth="2" strokeLinejoin="round" />
        <g className="animate-float-soft">
          <path d="M34 22l14-8 14 8" stroke="#D99476" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      </svg>
    )
  }
  if (kind === 'saved') {
    return (
      <svg viewBox="0 0 96 80" className="h-20 w-24" fill="none" aria-hidden="true">
        <path d="M10 66h76" stroke="#123C35" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="20" y="28" width="12" height="38" rx="2" fill="#D9E5DC" stroke="#123C35" strokeWidth="2" />
        <rect x="34" y="20" width="12" height="46" rx="2" fill="#F3E4C3" stroke="#123C35" strokeWidth="2" />
        <rect x="50" y="34" width="12" height="32" rx="2" fill="#FFFDF7" stroke="#123C35" strokeWidth="2" transform="rotate(12 56 50)" />
        <g className="animate-float-soft">
          <path d="M68 14h12v20l-6-5-6 5V14Z" fill="#D99476" stroke="#123C35" strokeWidth="2" strokeLinejoin="round" />
        </g>
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 96 80" className="h-20 w-24" fill="none" aria-hidden="true">
      <g className="animate-float-soft">
        <rect x="22" y="12" width="48" height="58" rx="6" fill="#FFFDF7" stroke="#123C35" strokeWidth="2" />
        <path d="M22 22h-4M22 34h-4M22 46h-4M22 58h-4" stroke="#123C35" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M32 28h28M32 38h20M32 48h24" stroke="#D9E5DC" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  )
}

export function EmptyState({
  kind,
  title,
  description,
  action,
  className,
}: {
  kind: Kind
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, rotate: -1 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 220, damping: 24 }}
      className={cn(
        'relative mx-auto flex max-w-sm flex-col items-center rounded-3xl border border-dashed border-ink/20 bg-paper/70 px-6 py-8 text-center',
        className,
      )}
    >
      <div className="relative">
        <Illustration kind={kind} />
        <Sparkle className="absolute -right-2 top-0 size-3.5 animate-twinkle text-peach" />
        <Sparkle className="absolute -left-1 bottom-3 size-2.5 animate-twinkle text-ink/60 [animation-delay:0.8s]" />
      </div>
      <p className="mt-4 font-serif text-xl text-deep">{title}</p>
      {description && <p className="mt-1 text-sm text-muted-foreground text-balance">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </motion.div>
  )
}
