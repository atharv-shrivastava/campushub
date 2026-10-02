'use client'

import { AnimatePresence, motion } from 'motion/react'
import { LayoutGrid, List, Search, SlidersHorizontal, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { categories, categoryLabel, resources, subjects, type Category } from '@/lib/data'
import { searchResources } from '@/lib/search'
import { ResourceCard } from '@/components/resources/resource-card'
import { EmptyState } from '@/components/brand/empty-state'
import { cn } from '@/lib/utils'

type Sort = 'popular' | 'newest' | 'rated'
const sorts: { value: Sort; label: string }[] = [
  { value: 'popular', label: 'Most downloaded' },
  { value: 'rated', label: 'Top rated' },
  { value: 'newest', label: 'Newest' },
]
const semesters = [2, 3, 5]

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'relative rounded-full border px-3 py-1.5 text-sm transition-all duration-200 active:scale-95',
        active ? 'border-ink bg-ink text-cream' : 'border-border bg-paper text-deep hover:-translate-y-0.5 hover:border-ink/30',
      )}
    >
      {children}
    </button>
  )
}

function SkeletonCard() {
  return (
    <div className="rounded-[20px] border border-border bg-paper p-2.5 pt-5">
      <div className="aspect-[4/3] rounded-xl skeleton-shimmer" />
      <div className="mt-3 h-3 w-1/3 rounded-full skeleton-shimmer" />
      <div className="mt-2 h-4 w-4/5 rounded-full skeleton-shimmer" />
      <div className="mt-4 h-3 w-1/2 rounded-full skeleton-shimmer" />
    </div>
  )
}

export function LibraryExplorer({ initialQuery, initialSubject }: { initialQuery: string; initialSubject: string }) {
  const [query, setQuery] = useState(initialQuery)
  const [subject, setSubject] = useState<string>(initialSubject || 'all')
  const [cats, setCats] = useState<Category[]>([])
  const [semester, setSemester] = useState<number | null>(null)
  const [sort, setSort] = useState<Sort>('popular')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [loading, setLoading] = useState(true)
  const [sheetOpen, setSheetOpen] = useState(false)

  const filterKey = `${query}|${subject}|${cats.join()}|${semester}|${sort}`

  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 420)
    return () => clearTimeout(t)
  }, [filterKey])

  const results = useMemo(() => {
    let list = searchResources(query, resources)
    if (subject !== 'all') list = list.filter((r) => r.subjectCode === subject)
    if (cats.length) list = list.filter((r) => cats.includes(r.category))
    if (semester) list = list.filter((r) => r.semester === semester)
    const sorted = [...list]
    if (sort === 'popular') sorted.sort((a, b) => b.downloads - a.downloads)
    if (sort === 'rated') sorted.sort((a, b) => b.rating - a.rating)
    return sorted
  }, [query, subject, cats, semester, sort])

  const activeFilters = cats.length + (semester ? 1 : 0)
  const toggleCat = (c: Category) => setCats((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]))
  const clearAll = () => {
    setCats([])
    setSemester(null)
    setQuery('')
    setSubject('all')
  }

  const filterPanel = (
    <div className="flex flex-col gap-5">
      <fieldset>
        <legend className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Category</legend>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <Chip key={c} active={cats.includes(c)} onClick={() => toggleCat(c)}>
              {categoryLabel[c]}
            </Chip>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Semester</legend>
        <div className="flex flex-wrap gap-2">
          {semesters.map((s) => (
            <Chip key={s} active={semester === s} onClick={() => setSemester(semester === s ? null : s)}>
              Sem {s}
            </Chip>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Sort by</legend>
        <div className="flex flex-wrap gap-2">
          {sorts.map((s) => (
            <Chip key={s.value} active={sort === s.value} onClick={() => setSort(s.value)}>
              {s.label}
            </Chip>
          ))}
        </div>
      </fieldset>
    </div>
  )

  return (
    <div>
      <header className="mb-8">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">The library</p>
        <h1 className="font-serif text-4xl tracking-tight text-deep md:text-6xl">
          Every note, <span className="italic text-ink">neatly filed.</span>
        </h1>
      </header>

      <div className="sticky top-[76px] z-30 -mx-4 bg-background/85 px-4 py-3 backdrop-blur-md md:top-[88px] md:mx-0 md:rounded-3xl md:px-0">
        <div className="flex items-center gap-2">
          <label className="group flex flex-1 items-center gap-3 rounded-2xl border border-border bg-paper px-4 py-3 transition-all focus-within:border-ink/40 focus-within:paper-shadow-lift paper-shadow">
            <Search className="size-4 text-muted-foreground transition-colors group-focus-within:text-ink" aria-hidden="true" />
            <span className="sr-only">Search the library</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Data Structures Unit 3, CS-204 practical…"
              className="min-w-0 flex-1 bg-transparent text-deep outline-none placeholder:text-muted-foreground/70"
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} aria-label="Clear search" className="text-muted-foreground hover:text-deep">
                <X className="size-4" />
              </button>
            )}
          </label>
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="relative grid size-12 place-items-center rounded-2xl border border-border bg-paper text-deep active:scale-95 md:hidden"
            aria-label="Open filters"
          >
            <SlidersHorizontal className="size-4" />
            {activeFilters > 0 && (
              <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-peach text-[10px] font-semibold text-deep">
                {activeFilters}
              </span>
            )}
          </button>
          <div className="hidden rounded-2xl border border-border bg-paper p-1 md:flex" role="group" aria-label="View">
            {(['grid', 'list'] as const).map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={view === v}
                aria-label={`${v} view`}
                onClick={() => setView(v)}
                className="relative grid size-10 place-items-center rounded-xl text-deep"
              >
                {view === v && <motion.span layoutId="view-pill" className="absolute inset-0 rounded-xl bg-sage" />}
                {v === 'grid' ? <LayoutGrid className="relative size-4" /> : <List className="relative size-4" />}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 -mx-4 overflow-x-auto px-4 scrollbar-none md:mx-0 md:px-0">
          <div role="tablist" aria-label="Subjects" className="flex min-w-max gap-1 border-b border-border">
            {[{ code: 'all', short: 'All subjects' }, ...subjects].map((s) => {
              const active = subject === s.code
              return (
                <button
                  key={s.code}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSubject(s.code)}
                  className={cn(
                    'relative rounded-t-xl px-4 pb-2.5 pt-2 text-sm transition-colors',
                    active ? 'text-deep' : 'text-muted-foreground hover:text-deep',
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="subject-tab"
                      className="absolute inset-0 rounded-t-xl border border-b-0 border-border bg-paper"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative">
                    {s.short}
                    {'code' in s && s.code !== 'all' && <span className="ml-1.5 text-[10px] text-muted-foreground">{s.code}</span>}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-8 md:grid-cols-[220px_1fr]">
        <aside className="hidden md:block" aria-label="Filters">
          <div className="sticky top-[220px]">{filterPanel}</div>
        </aside>

        <section aria-live="polite" aria-busy={loading}>
          <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
            <p>
              <span className="font-serif text-lg text-deep">{loading ? '…' : results.length}</span> resources
              {query && (
                <>
                  {' '}
                  for <span className="italic text-deep">“{query}”</span>
                </>
              )}
            </p>
            {(activeFilters > 0 || query || subject !== 'all') && (
              <button type="button" onClick={clearAll} className="text-ink underline decoration-peach underline-offset-4">
                Reset
              </button>
            )}
          </div>

          {loading ? (
            <div className={cn('grid gap-5', view === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3' : '')}>
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : results.length ? (
            <motion.div
              key={filterKey + view}
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.06 } } }}
              className={cn('grid', view === 'grid' ? 'gap-5 sm:grid-cols-2 lg:grid-cols-3' : 'gap-3')}
            >
              {results.map((r) => (
                <ResourceCard key={r.id} resource={r} view={view} />
              ))}
            </motion.div>
          ) : (
            <EmptyState
              kind="search"
              title={subject !== 'all' && !query ? 'No notes here yet ✦' : 'Nothing found in this subject.'}
              description="Try a different unit, loosen a filter — or be the first to upload it."
              action={
                <button type="button" onClick={clearAll} className="rounded-full bg-ink px-4 py-2 text-sm text-cream active:scale-95">
                  Clear filters
                </button>
              }
              className="mt-6"
            />
          )}
        </section>
      </div>

      <AnimatePresence>
        {sheetOpen && (
          <motion.div className="fixed inset-0 z-[60] md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button type="button" aria-label="Close filters" className="absolute inset-0 bg-deep/30" onClick={() => setSheetOpen(false)} />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Filters"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 34 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.6 }}
              onDragEnd={(_, info) => info.offset.y > 100 && setSheetOpen(false)}
              className="absolute inset-x-0 bottom-0 rounded-t-[28px] bg-paper px-5 pb-10 pt-3 paper-shadow-lift"
            >
              <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-border" aria-hidden="true" />
              <div className="mb-5 flex items-center justify-between">
                <p className="font-serif text-2xl text-deep">Filters</p>
                <button type="button" onClick={() => setSheetOpen(false)} className="rounded-full bg-ink px-4 py-2 text-sm text-cream">
                  Show {results.length}
                </button>
              </div>
              {filterPanel}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
