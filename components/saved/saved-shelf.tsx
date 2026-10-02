'use client'

import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import { resources, subjects } from '@/lib/data'
import { useShell } from '@/components/shell/app-shell'
import { ResourceCard } from '@/components/resources/resource-card'
import { EmptyState } from '@/components/brand/empty-state'

export function SavedShelf() {
  const { saved } = useShell()
  const items = resources.filter((r) => saved.has(r.id))
  const grouped = subjects
    .map((s) => ({ subject: s, items: items.filter((r) => r.subjectCode === s.code) }))
    .filter((g) => g.items.length)

  return (
    <div>
      <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Your shelf</p>
          <h1 className="font-serif text-4xl tracking-tight text-deep md:text-6xl">
            Saved for <span className="italic text-ink">exam week.</span>
          </h1>
        </div>
        <p className="font-serif text-lg text-deep/70">
          <span className="text-3xl text-ink">{items.length}</span> resources bookmarked
        </p>
      </header>

      {grouped.length ? (
        <div className="flex flex-col gap-12">
          <AnimatePresence initial={false}>
            {grouped.map(({ subject, items: list }) => (
              <motion.section
                key={subject.code}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                aria-labelledby={`saved-${subject.code}`}
              >
                <div className="mb-4 flex items-baseline gap-3 border-b border-border pb-2">
                  <h2 id={`saved-${subject.code}`} className="font-serif text-2xl text-deep">
                    {subject.name}
                  </h2>
                  <span className="text-xs text-muted-foreground">{subject.code}</span>
                </div>
                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={{ show: { transition: { staggerChildren: 0.07 } } }}
                  className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
                >
                  <AnimatePresence>
                    {list.map((r) => (
                      <ResourceCard key={r.id} resource={r} />
                    ))}
                  </AnimatePresence>
                </motion.div>
              </motion.section>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <EmptyState
          kind="saved"
          title="Your saved resources will live here."
          description="Tap the bookmark on any note and it’ll be waiting for you before exams."
          action={
            <Link href="/library" className="rounded-full bg-ink px-4 py-2 text-sm text-cream active:scale-95">
              Browse the library
            </Link>
          }
        />
      )}
    </div>
  )
}
