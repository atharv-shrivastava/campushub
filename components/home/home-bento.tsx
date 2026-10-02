'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowUpRight, CalendarDays, Upload } from 'lucide-react'
import { lostFoundItems, resources } from '@/lib/data'
import { ResourceCard } from '@/components/resources/resource-card'
import { Sparkle } from '@/components/brand/sparkle'

const tile = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 220, damping: 24 } },
}

export function HomeBento() {
  const fresh = resources.slice(0, 3)
  const activeLost = lostFoundItems.filter((i) => i.status !== 'matched').length

  return (
    <motion.section
      aria-labelledby="fresh-heading"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      variants={{ show: { transition: { staggerChildren: 0.08 } } }}
      className="grid gap-4 md:grid-cols-6 md:gap-5"
    >
      <motion.div variants={tile} className="md:col-span-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Fresh on the shelf</p>
            <h2 id="fresh-heading" className="font-serif text-2xl text-deep md:text-3xl">
              New this week<span className="italic text-peach">.</span>
            </h2>
          </div>
          <Link href="/library" className="group flex items-center gap-1 text-sm text-ink">
            See all
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>
      </motion.div>

      <motion.div
        variants={{ show: { transition: { staggerChildren: 0.09 } } }}
        className="grid gap-5 sm:grid-cols-2 md:col-span-4 md:grid-cols-3"
      >
        {fresh.map((r) => (
          <ResourceCard key={r.id} resource={r} />
        ))}
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 md:col-span-2 md:grid-cols-1">
        <motion.div variants={tile} className="relative overflow-hidden rounded-3xl bg-ink p-5 text-cream paper-shadow">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-champagne/80">
            <CalendarDays className="size-3.5" aria-hidden="true" /> Exam countdown
          </div>
          <p className="mt-3 font-serif text-4xl">
            6 <span className="text-xl italic text-champagne">days</span>
          </p>
          <p className="text-sm text-cream/70">Data Structures · Mid Sem</p>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-cream/10">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '68%' }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              className="h-full rounded-full bg-champagne"
            />
          </div>
          <p className="mt-2 text-xs text-cream/60">68% of Unit 1–3 resources reviewed</p>
          <Sparkle className="absolute right-5 top-5 size-5 animate-twinkle text-peach" />
        </motion.div>

        <motion.div variants={tile}>
          <Link
            href="/lost-found"
            className="group relative flex h-full items-center gap-4 overflow-hidden rounded-3xl border border-border bg-sage/70 p-5 transition-all hover:-translate-y-1 paper-shadow hover:paper-shadow-lift"
          >
            <span className="relative grid size-14 shrink-0 place-items-center">
              <span className="absolute inset-0 animate-ping-soft rounded-full bg-ink/20" aria-hidden="true" />
              <span className="absolute inset-0 animate-ping-soft rounded-full bg-ink/15 [animation-delay:1s]" aria-hidden="true" />
              <span className="relative grid size-10 place-items-center rounded-full bg-ink font-serif text-champagne">
                {activeLost}
              </span>
            </span>
            <span>
              <span className="block font-serif text-lg text-deep">Lost &amp; Found pulse</span>
              <span className="text-sm text-ink/70">1 possible match waiting for you</span>
            </span>
            <ArrowUpRight className="ml-auto size-5 shrink-0 text-ink transition-transform group-hover:rotate-45" aria-hidden="true" />
          </Link>
        </motion.div>

        <motion.div variants={tile}>
          <Link
            href="/upload"
            className="group flex h-full flex-col justify-between gap-6 rounded-3xl border border-dashed border-ink/30 bg-champagne/50 p-5 transition-all hover:-translate-y-1 hover:border-ink/60 hover:bg-champagne"
          >
            <span className="flex items-center justify-between">
              <span className="grid size-10 place-items-center rounded-xl bg-paper text-ink transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                <Upload className="size-5" aria-hidden="true" />
              </span>
              <span className="text-xs text-ink/70">12 shared · 3.4k downloads</span>
            </span>
            <span>
              <span className="block font-serif text-xl text-deep">Share your notes</span>
              <span className="text-sm text-ink/70">Help a junior survive Unit 4 ✦</span>
            </span>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  )
}
