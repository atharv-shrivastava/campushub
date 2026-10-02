'use client'

import { AnimatePresence, motion } from 'motion/react'
import { Plus, X } from 'lucide-react'
import { useState } from 'react'
import { lostFoundItems, type LostFoundItem, type LostFoundStatus } from '@/lib/data'
import { EmptyState } from '@/components/brand/empty-state'
import { useToast } from '@/components/shell/toast'
import { rollIn } from '@/components/resources/resource-card'
import { ItemTag } from './item-tag'
import { MatchMoment } from './match-moment'
import { cn } from '@/lib/utils'

type Tab = 'all' | LostFoundStatus
const tabs: { value: Tab; label: string }[] = [
  { value: 'all', label: 'Everything' },
  { value: 'lost', label: 'Lost' },
  { value: 'found', label: 'Found' },
  { value: 'matched', label: 'Reunited' },
]

const field =
  'w-full rounded-xl border border-border bg-paper px-3.5 py-2.5 text-deep outline-none transition-all placeholder:text-muted-foreground/60 focus:border-ink/40'

export function LostFoundBoard() {
  const [items, setItems] = useState<LostFoundItem[]>(lostFoundItems)
  const [tab, setTab] = useState<Tab>('all')
  const [reportOpen, setReportOpen] = useState(false)
  const [kind, setKind] = useState<'lost' | 'found'>('lost')
  const toast = useToast()

  const visible = tab === 'all' ? items : items.filter((i) => i.status === tab)
  const lost = items.find((i) => i.id === 'lf-1')!
  const found = items.find((i) => i.id === 'lf-2')!

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const title = String(data.get('title') || '').trim()
    const location = String(data.get('location') || '').trim()
    if (!title || !location) return
    setItems((prev) => [
      {
        id: `lf-${Date.now()}`,
        status: kind,
        title,
        location,
        category: 'Accessories',
        when: 'Just now',
        description: String(data.get('description') || ''),
        reporter: { name: 'Aanya S.', initials: 'AS' },
        color: kind === 'lost' ? '#F3E4C3' : '#D9E5DC',
      },
      ...prev,
    ])
    setTab('all')
    setReportOpen(false)
    toast({
      title: kind === 'lost' ? 'We’re on the lookout ✦' : 'Thank you, campus hero ✦',
      description: kind === 'lost' ? 'You’ll hear the moment something similar is found.' : 'The owner will be notified if we spot a match.',
      tone: kind === 'lost' ? 'peach' : 'sage',
    })
  }

  return (
    <div className="flex flex-col gap-12">
      <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Lost &amp; Found</p>
          <h1 className="font-serif text-4xl tracking-tight text-deep md:text-6xl">
            Nothing stays lost <span className="italic text-ink">for long.</span>
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setReportOpen(true)}
          className="group flex items-center gap-2 self-start rounded-full bg-ink px-5 py-3 text-sm font-medium text-cream transition-transform hover:-translate-y-0.5 active:scale-95 md:self-auto"
        >
          <Plus className="size-4 transition-transform duration-300 group-hover:rotate-90" aria-hidden="true" />
          Report an item
        </button>
      </header>

      <MatchMoment lost={lost} found={found} />

      <section aria-labelledby="board-heading">
        <h2 id="board-heading" className="sr-only">
          All reports
        </h2>
        <div role="tablist" aria-label="Filter reports" className="mb-6 flex gap-1 overflow-x-auto rounded-full border border-border bg-paper p-1 scrollbar-none sm:inline-flex">
          {tabs.map((t) => {
            const count = t.value === 'all' ? items.length : items.filter((i) => i.status === t.value).length
            return (
              <button
                key={t.value}
                role="tab"
                aria-selected={tab === t.value}
                onClick={() => setTab(t.value)}
                className={cn('relative shrink-0 rounded-full px-4 py-2 text-sm transition-colors', tab === t.value ? 'text-cream' : 'text-deep hover:text-ink')}
              >
                {tab === t.value && <motion.span layoutId="lf-tab" className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                <span className="relative">
                  {t.label} <span className="opacity-60">{count}</span>
                </span>
              </button>
            )
          })}
        </div>

        {visible.length ? (
          <motion.div
            key={tab}
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.06 } } }}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {visible.map((item, i) => (
              <motion.div
                key={item.id}
                variants={rollIn}
                whileHover={{ y: -6, rotate: i % 2 ? 1 : -1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{ rotate: i % 3 === 0 ? -0.8 : i % 3 === 1 ? 0.6 : 0 }}
              >
                <ItemTag item={item} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <EmptyState kind="lost" title="No lost items reported." description="Campus is being unusually careful today ✦" />
        )}
      </section>

      <AnimatePresence>
        {reportOpen && (
          <motion.div className="fixed inset-0 z-[60] flex items-end justify-center md:items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button type="button" aria-label="Close" className="absolute inset-0 bg-deep/30 backdrop-blur-sm" onClick={() => setReportOpen(false)} />
            <motion.form
              onSubmit={submit}
              role="dialog"
              aria-modal="true"
              aria-labelledby="report-title"
              initial={{ y: 60, opacity: 0, rotate: 1 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              className="relative w-full max-w-md rounded-t-[28px] bg-paper p-6 paper-shadow-lift md:rounded-[28px]"
            >
              <div className="mb-5 flex items-center justify-between">
                <p id="report-title" className="font-serif text-2xl text-deep">
                  Report an item
                </p>
                <button type="button" onClick={() => setReportOpen(false)} aria-label="Close" className="grid size-8 place-items-center rounded-full hover:bg-muted">
                  <X className="size-4" />
                </button>
              </div>
              <div className="mb-4 grid grid-cols-2 rounded-2xl bg-muted p-1" role="radiogroup" aria-label="Report type">
                {(['lost', 'found'] as const).map((k) => (
                  <button
                    key={k}
                    type="button"
                    role="radio"
                    aria-checked={kind === k}
                    onClick={() => setKind(k)}
                    className={cn('relative rounded-xl py-2 text-sm capitalize transition-colors', kind === k ? 'text-deep' : 'text-muted-foreground')}
                  >
                    {kind === k && <motion.span layoutId="kind-pill" className={cn('absolute inset-0 rounded-xl', k === 'lost' ? 'bg-peach/40' : 'bg-sage')} />}
                    <span className="relative">I {k} something</span>
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-3">
                <label className="flex flex-col gap-1.5 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  What is it?
                  <input name="title" required className={field} placeholder="Black umbrella with wooden handle" />
                </label>
                <label className="flex flex-col gap-1.5 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  Where?
                  <input name="location" required className={field} placeholder="Block B corridor" />
                </label>
                <label className="flex flex-col gap-1.5 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  Little details
                  <textarea name="description" rows={3} className={cn(field, 'resize-none')} placeholder="Stickers, scratches, initials…" />
                </label>
              </div>
              <button type="submit" className="mt-5 h-12 w-full rounded-2xl bg-ink text-sm font-medium text-cream active:scale-[0.98]">
                Post to the board
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
