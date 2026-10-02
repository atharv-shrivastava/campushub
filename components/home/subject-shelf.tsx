'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { subjects } from '@/lib/data'

const spineTones = [
  'bg-ink text-cream',
  'bg-champagne text-deep',
  'bg-sage text-ink',
  'bg-peach text-deep',
  'bg-deep text-champagne',
  'bg-paper text-ink border border-border',
  'bg-sage text-ink',
]

export function SubjectShelf() {
  return (
    <section aria-labelledby="shelf-heading">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Your bookshelf</p>
          <h2 id="shelf-heading" className="font-serif text-2xl text-deep md:text-3xl">
            Subjects this semester
          </h2>
        </div>
        <Link href="/library" className="text-sm text-ink underline decoration-peach decoration-2 underline-offset-4 hover:decoration-ink">
          Open library
        </Link>
      </div>

      <div className="-mx-4 overflow-x-auto px-4 pb-2 scrollbar-none md:mx-0 md:px-0">
        <motion.ul
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } } }}
          className="flex min-w-max items-end gap-2 border-b-[6px] border-deep/90 pb-0 md:min-w-0"
        >
          {subjects.map((s, i) => (
            <motion.li
              key={s.code}
              variants={{
                hidden: { opacity: 0, y: 40, rotate: i % 2 ? 4 : -4 },
                show: { opacity: 1, y: 0, rotate: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } },
              }}
              className="md:flex-1"
            >
              <Link
                href={`/library?subject=${s.code}`}
                className={`group relative flex w-24 flex-col justify-between rounded-t-lg px-3 py-3 transition-transform duration-300 ease-paper hover:-translate-y-3 hover:-rotate-1 md:w-auto ${spineTones[i]}`}
                style={{ height: `${150 + ((i * 37) % 60)}px` }}
              >
                <span className="text-[10px] font-semibold tracking-[0.14em] opacity-70">{s.code}</span>
                <span className="font-serif text-xl leading-tight [writing-mode:vertical-rl] rotate-180 self-start md:text-2xl">
                  {s.short}
                </span>
                <span className="text-[10px] opacity-70">{s.count} files</span>
                <span className="absolute inset-x-3 top-9 h-px bg-current opacity-20" aria-hidden="true" />
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
