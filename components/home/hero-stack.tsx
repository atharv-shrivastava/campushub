'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { useState } from 'react'
import { resourceById, subjectByCode } from '@/lib/data'
import { ResourcePreview } from '@/components/resources/resource-preview'
import { Sparkle } from '@/components/brand/sparkle'

const ids = ['dbms-normalisation', 'oop-notes-complete', 'ds-unit-3-trees']
const rest = [
  { rotate: -9, x: -70, y: 24 },
  { rotate: 6, x: 60, y: 12 },
  { rotate: -1, x: 0, y: 0 },
]
const fanned = [
  { rotate: -16, x: -150, y: 40 },
  { rotate: 13, x: 140, y: 30 },
  { rotate: -2, x: 0, y: -16 },
]

export function HeroStack() {
  const [open, setOpen] = useState(false)
  const items = ids.map((id) => resourceById(id)).filter((r): r is NonNullable<typeof r> => Boolean(r))

  return (
    <div
      className="relative mx-auto flex h-[400px] w-full max-w-sm items-center justify-center"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {items.map((r, i) => {
        const pos = open ? fanned[i] : rest[i]
        const subject = subjectByCode(r.subjectCode)
        return (
          <motion.div
            key={r.id}
            className="absolute w-52"
            initial={{ opacity: 0, y: 80, rotate: 0 }}
            animate={{ opacity: 1, ...pos }}
            transition={{ type: 'spring', stiffness: 160, damping: 18, delay: open ? 0 : 0.2 + i * 0.12 }}
            style={{ zIndex: i }}
          >
            <Link
              href={`/resource/${r.id}`}
              className="block rounded-2xl border border-border bg-paper p-2.5 paper-shadow-lift transition-transform hover:-translate-y-2 focus-visible:-translate-y-2"
            >
              <ResourcePreview category={r.category} title={r.title} code={subject.code} year={r.year} className="aspect-[3/4]" />
              <p className="truncate px-1 pt-2 text-xs font-medium text-deep">{r.title}</p>
            </Link>
          </motion.div>
        )
      })}
      <motion.p
        className="absolute -bottom-2 flex items-center gap-1.5 rounded-full bg-paper px-3 py-1 text-xs text-muted-foreground paper-shadow"
        animate={{ opacity: open ? 0 : 1, y: open ? 6 : 0 }}
      >
        Continue where you left off <Sparkle className="size-3 text-peach" />
      </motion.p>
    </div>
  )
}
