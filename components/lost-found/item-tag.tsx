'use client'

import { motion } from 'motion/react'
import { Backpack, BookOpen, Check, CreditCard, Headphones, Key, MapPin, Clock, Milk, Calculator } from 'lucide-react'
import type { LostFoundItem } from '@/lib/data'
import { cn } from '@/lib/utils'

const icons = {
  Electronics: Headphones,
  'ID Card': CreditCard,
  Books: BookOpen,
  Accessories: Calculator,
  Keys: Key,
  Bottles: Milk,
}

export function StatusBadge({ status }: { status: LostFoundItem['status'] }) {
  if (status === 'lost') {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-peach/20 px-2.5 py-1 text-xs font-medium text-deep">
        <span className="relative grid size-3.5 place-items-center" aria-hidden="true">
          <span className="absolute inset-0 rounded-full border border-peach/60" />
          <span className="absolute inset-0 animate-scan rounded-full" style={{ background: 'conic-gradient(from 0deg, transparent 70%, #D99476)' }} />
          <span className="relative size-1 rounded-full bg-peach" />
        </span>
        Searching
      </span>
    )
  }
  if (status === 'found') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-sage px-2.5 py-1 text-xs font-medium text-ink">
        <motion.span
          initial={{ scale: 0, rotate: -90 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 500, damping: 14, delay: 0.3 }}
          className="grid size-3.5 place-items-center rounded-full bg-ink text-cream"
        >
          <Check className="size-2.5" strokeWidth={3} aria-hidden="true" />
        </motion.span>
        Found
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-champagne px-2.5 py-1 text-xs font-medium text-deep">✦ Reunited</span>
  )
}

export function ItemTag({ item, compact = false, className }: { item: LostFoundItem; compact?: boolean; className?: string }) {
  const Icon = icons[item.category] ?? Backpack
  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'relative rounded-[22px] border border-border bg-paper p-4 paper-shadow',
          item.status === 'matched' && 'opacity-80',
        )}
      >
        <span className="absolute left-1/2 top-3 size-3 -translate-x-1/2 rounded-full border-2 border-border bg-background" aria-hidden="true" />
        <div
          className="relative mt-4 grid aspect-[5/3] place-items-center overflow-hidden rounded-2xl"
          style={{ backgroundColor: item.color }}
        >
          <div className="absolute inset-0 paper-grid opacity-50" aria-hidden="true" />
          <Icon className={cn('relative text-ink/80', compact ? 'size-8' : 'size-10')} strokeWidth={1.4} aria-hidden="true" />
          <span className="absolute left-3 top-3">
            <StatusBadge status={item.status} />
          </span>
        </div>
        <div className="px-1 pt-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{item.category}</p>
          <h3 className="mt-1 font-serif text-lg leading-snug text-deep text-balance">{item.title}</h3>
          {!compact && <p className="mt-1 line-clamp-2 text-sm text-deep/70">{item.description}</p>}
          <div className="mt-3 flex flex-col gap-1.5 border-t border-dashed border-border pt-3 text-xs text-deep/70">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5 text-ink" aria-hidden="true" /> {item.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5 text-ink" aria-hidden="true" /> {item.when} · by {item.reporter.name}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
