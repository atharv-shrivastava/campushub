'use client'

import Link from 'next/link'
import { motion, type Variants } from 'motion/react'
import { Download, FileText, Star } from 'lucide-react'
import { categoryLabel, subjectByCode, type Category, type Resource } from '@/lib/data'
import { cn } from '@/lib/utils'
import { BookmarkButton } from './bookmark-button'
import { ResourcePreview } from './resource-preview'

export const rollIn: Variants = {
  hidden: { opacity: 0, x: -28, y: 10, rotate: 3 },
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    rotate: 0,
    transition: { type: 'spring', stiffness: 260, damping: 24 },
  },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.15 } },
}

export const tabTone: Record<Category, string> = {
  Notes: 'bg-sage text-ink',
  Assignment: 'bg-champagne text-deep',
  Practical: 'bg-peach text-deep',
  PYQ: 'bg-deep text-champagne',
  'Lab Manual': 'bg-ink text-cream',
  Syllabus: 'bg-cream text-ink border border-border',
}

export function ResourceCard({ resource, view = 'grid' }: { resource: Resource; view?: 'grid' | 'list' }) {
  const subject = subjectByCode(resource.subjectCode)

  if (view === 'list') {
    return (
      <motion.article variants={rollIn} layout className="group">
        <div
          className="relative flex items-center gap-4 rounded-2xl border border-border bg-paper p-3 transition-all duration-300 ease-paper hover:-translate-y-0.5 hover:border-ink/20 paper-shadow hover:paper-shadow-lift"
        >
          <ResourcePreview
            category={resource.category}
            title={resource.title}
            code={subject.code}
            year={resource.year}
            className="hidden h-20 w-16 shrink-0 border border-border sm:block [&_p]:hidden"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className={cn('rounded-md px-1.5 py-0.5 text-[10px] font-medium', tabTone[resource.category])}>
                {categoryLabel[resource.category]}
              </span>
              <span className="text-xs text-muted-foreground">{subject.code}</span>
            </div>
            <h3 className="mt-1 truncate font-serif text-lg text-deep">{resource.title}</h3>
            <p className="text-xs text-muted-foreground">
              {resource.uploader.name} · {resource.uploadedAt} · {resource.pages} pages
            </p>
          </div>
          <div className="hidden items-center gap-4 text-xs text-muted-foreground md:flex">
            <span className="flex items-center gap-1">
              <Star className="size-3.5 fill-peach text-peach" aria-hidden="true" />
              {resource.rating}
            </span>
            <span className="flex items-center gap-1">
              <Download className="size-3.5" aria-hidden="true" />
              {resource.downloads.toLocaleString()}
            </span>
          </div>
          <Link href={`/resource/${resource.id}`} className="absolute inset-0 z-10 rounded-2xl" aria-label={resource.title} />
          <BookmarkButton id={resource.id} title={resource.title} className="relative z-20 shrink-0 border border-border" />
        </div>
      </motion.article>
    )
  }

  return (
    <motion.article
      variants={rollIn}
      layout
      whileHover={{ y: -6, rotate: -0.6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="group relative pt-3"
    >
      <span
        className={cn(
          'absolute left-5 top-0 z-10 rounded-t-lg px-2.5 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.12em] transition-transform duration-300 ease-paper group-hover:-translate-y-1',
          tabTone[resource.category],
        )}
      >
        {categoryLabel[resource.category]}
      </span>
      <div
        className="relative z-20 block rounded-[20px] border border-border bg-paper p-2.5 transition-shadow duration-300 paper-shadow group-hover:paper-shadow-lift"
      >
        <div className="relative">
          <ResourcePreview
            category={resource.category}
            title={resource.title}
            code={subject.code}
            year={resource.year}
            className="aspect-[4/3] border border-border/70"
          />
          <BookmarkButton id={resource.id} title={resource.title} className="absolute bottom-2 right-2 z-20 border border-border" />
        </div>
        <div className="px-2 pb-1.5 pt-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-md bg-sage px-1.5 py-0.5 font-medium text-ink">{subject.code}</span>
            <span className="truncate">{subject.name}</span>
          </div>
          <h3 className="mt-2 line-clamp-2 font-serif text-[17px] leading-snug text-deep text-balance">
            <Link href={`/resource/${resource.id}`} className="after:absolute after:inset-0 after:z-10 after:rounded-[20px] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ink">
              {resource.title}
            </Link>
          </h3>
          <div className="mt-3 flex items-center justify-between border-t border-dashed border-border pt-3">
            <span className="flex min-w-0 items-center gap-2">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-champagne text-[10px] font-medium text-deep">
                {resource.uploader.initials}
              </span>
              <span className="truncate text-xs text-deep/80">{resource.uploader.name}</span>
            </span>
            <span className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <FileText className="size-3.5" aria-hidden="true" />
                {resource.pages}
              </span>
              <span className="flex items-center gap-1">
                <Download className="size-3.5" aria-hidden="true" />
                {resource.downloads >= 1000 ? `${(resource.downloads / 1000).toFixed(1)}k` : resource.downloads}
              </span>
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
