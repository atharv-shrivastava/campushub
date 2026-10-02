'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowLeft, Download, FileText, Share2, Star } from 'lucide-react'
import { categoryLabel, resources, subjectByCode, type Resource } from '@/lib/data'
import { ResourcePreview } from './resource-preview'
import { ResourceCard, tabTone } from './resource-card'
import { DownloadButton } from './download-button'
import { BookmarkButton } from './bookmark-button'
import { useToast } from '@/components/shell/toast'
import { cn } from '@/lib/utils'

export function ResourceDetail({ resource }: { resource: Resource }) {
  const subject = subjectByCode(resource.subjectCode)
  const toast = useToast()
  const related = resources.filter((r) => r.id !== resource.id && r.subjectCode === resource.subjectCode).slice(0, 3)
  const fallback = related.length ? related : resources.filter((r) => r.id !== resource.id).slice(0, 3)

  const facts = [
    ['Subject', `${subject.name}`],
    ['Code', subject.code],
    ['Semester', `Semester ${resource.semester}`],
    ['Type', categoryLabel[resource.category]],
    ...(resource.unit ? [['Unit', resource.unit]] : []),
    ['Uploaded', resource.uploadedAt],
  ]

  return (
    <div>
      <Link href="/library" className="group mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-deep">
        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
        Back to library
      </Link>

      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          {[2, 1].map((n) => (
            <motion.div
              key={n}
              aria-hidden="true"
              initial={{ rotate: 0, opacity: 0 }}
              animate={{ rotate: n === 2 ? 5 : -3, opacity: 1 }}
              transition={{ delay: 0.15 * n, type: 'spring', stiffness: 120, damping: 14 }}
              className="absolute inset-0 rounded-2xl border border-border bg-paper paper-shadow"
            />
          ))}
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: 3 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 160, damping: 18 }}
            className="relative rounded-2xl border border-border bg-paper p-3 paper-shadow-lift"
          >
            <ResourcePreview
              size="lg"
              category={resource.category}
              title={resource.title}
              code={subject.code}
              year={resource.year}
              className="aspect-[3/4] border border-border/70"
            />
            <div className="flex items-center justify-between px-2 pt-3 text-xs text-muted-foreground">
              <span>Page 1 of {resource.pages}</span>
              <span className="flex gap-1" aria-hidden="true">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className={cn('h-1.5 rounded-full', i === 0 ? 'w-5 bg-ink' : 'w-1.5 bg-border')} />
                ))}
              </span>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } } }}
          className="flex flex-col"
        >
          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="flex items-center gap-2">
            <span className={cn('rounded-lg px-2 py-1 text-xs font-medium', tabTone[resource.category])}>
              {categoryLabel[resource.category]}
            </span>
            <span className="rounded-lg bg-sage px-2 py-1 text-xs font-medium text-ink">{subject.code}</span>
          </motion.div>
          <motion.h1
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            className="mt-4 font-serif text-4xl leading-tight tracking-tight text-deep text-balance md:text-5xl"
          >
            {resource.title}
          </motion.h1>
          <motion.p variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="mt-4 leading-relaxed text-deep/75">
            {resource.description}
          </motion.p>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            className="mt-6 flex flex-wrap items-center gap-5 text-sm text-deep/80"
          >
            <span className="flex items-center gap-1.5">
              <Star className="size-4 fill-peach text-peach" aria-hidden="true" /> {resource.rating} rating
            </span>
            <span className="flex items-center gap-1.5">
              <Download className="size-4" aria-hidden="true" /> {resource.downloads.toLocaleString()} downloads
            </span>
            <span className="flex items-center gap-1.5">
              <FileText className="size-4" aria-hidden="true" /> {resource.pages} pages
            </span>
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="mt-6 flex items-center gap-2">
            <div className="flex-1">
              <DownloadButton title={resource.title} sizeMb={resource.sizeMb} />
            </div>
            <BookmarkButton id={resource.id} title={resource.title} className="size-14 rounded-2xl border border-border" />
            <button
              type="button"
              aria-label="Copy share link"
              onClick={() => toast({ title: 'Link copied', description: 'Send it to your study group ✦', tone: 'sage' })}
              className="grid size-14 place-items-center rounded-2xl border border-border bg-paper text-ink transition-transform hover:-rotate-6 active:scale-90"
            >
              <Share2 className="size-4" />
            </button>
          </motion.div>

          <motion.dl
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            className="mt-8 overflow-hidden rounded-2xl border border-border bg-champagne/40"
          >
            <div className="border-b border-ink/10 bg-champagne/60 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink">
              Library card
            </div>
            {facts.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[110px_1fr] border-b border-dashed border-ink/15 px-4 py-2.5 text-sm last:border-0">
                <dt className="text-ink/60">{k}</dt>
                <dd className="text-deep">{v}</dd>
              </div>
            ))}
          </motion.dl>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            className="mt-6 flex items-center gap-3 rounded-2xl border border-border bg-paper p-4"
          >
            <span className="grid size-11 place-items-center rounded-full bg-sage font-serif text-ink">{resource.uploader.initials}</span>
            <span className="flex-1">
              <span className="block text-sm font-medium text-deep">{resource.uploader.name}</span>
              <span className="text-xs text-muted-foreground">{resource.uploader.branch}</span>
            </span>
            <span className="flex flex-wrap justify-end gap-1.5">
              {resource.tags.map((t) => (
                <span key={t} className="rounded-full bg-muted px-2 py-0.5 text-xs text-deep/70">
                  #{t}
                </span>
              ))}
            </span>
          </motion.div>
        </motion.div>
      </div>

      <section aria-labelledby="related-heading" className="mt-20">
        <h2 id="related-heading" className="mb-5 font-serif text-2xl text-deep md:text-3xl">
          From the same <span className="italic">shelf</span>
        </h2>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {fallback.map((r) => (
            <ResourceCard key={r.id} resource={r} />
          ))}
        </motion.div>
      </section>
    </div>
  )
}
