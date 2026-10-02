'use client'

import Link from 'next/link'
import { AnimatePresence, motion, useAnimate } from 'motion/react'
import { ArrowRight, FilePlus2, RotateCcw, UploadCloud } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { categories, categoryLabel, subjects, type Category } from '@/lib/data'
import { Sparkle } from '@/components/brand/sparkle'
import { useToast } from '@/components/shell/toast'
import { FolderBack, FolderFront } from './folder'
import { cn } from '@/lib/utils'

type Phase = 'empty' | 'selected' | 'uploading' | 'filing' | 'done'

const steps: { key: Phase[]; label: string }[] = [
  { key: ['empty'], label: 'Choose' },
  { key: ['selected'], label: 'Describe' },
  { key: ['uploading', 'filing'], label: 'Upload' },
  { key: ['done'], label: 'Shelved' },
]

const fieldClass =
  'w-full rounded-xl border border-border bg-paper px-3.5 py-2.5 text-deep outline-none transition-all placeholder:text-muted-foreground/60 focus:border-ink/40 focus:paper-shadow'

export function UploadStudio() {
  const [phase, setPhase] = useState<Phase>('empty')
  const [file, setFile] = useState<{ name: string; size: number } | null>(null)
  const [progress, setProgress] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  const [count, setCount] = useState(128)
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState(subjects[0].code)
  const [category, setCategory] = useState<Category>('Notes')
  const [unit, setUnit] = useState('')
  const [error, setError] = useState('')

  const inputRef = useRef<HTMLInputElement>(null)
  const folderRef = useRef<HTMLDivElement>(null)
  const [docScope, animateDoc] = useAnimate()
  const toast = useToast()

  const pick = (f: { name: string; size: number }) => {
    if (!f.name.toLowerCase().endsWith('.pdf')) {
      setError('CampusHub only accepts PDF files for now.')
      return
    }
    setError('')
    setFile(f)
    setTitle(f.name.replace(/\.pdf$/i, '').replace(/[-_]+/g, ' '))
    setPhase('selected')
  }

  useEffect(() => {
    if (phase !== 'uploading') return
    let p = 0
    const t = setInterval(() => {
      p = Math.min(p + Math.random() * 9 + 3, 100)
      setProgress(p)
      if (p >= 100) {
        clearInterval(t)
        setTimeout(() => setPhase('filing'), 350)
      }
    }, 140)
    return () => clearInterval(t)
  }, [phase])

  useEffect(() => {
    if (phase !== 'filing' || !docScope.current || !folderRef.current) return
    const doc = (docScope.current as HTMLElement).getBoundingClientRect()
    const folder = folderRef.current.getBoundingClientRect()
    const dx = folder.left + folder.width / 2 - (doc.left + doc.width / 2)
    const dy = folder.top + folder.height * 0.42 - (doc.top + doc.height / 2)

    const run = async () => {
      await animateDoc(docScope.current, { y: -40, rotate: -4, scale: 1.02 }, { duration: 0.35, ease: [0.22, 1, 0.36, 1] })
      await animateDoc(
        docScope.current,
        { x: dx, y: dy - 30, rotate: 8, scale: 0.34 },
        { duration: 0.75, ease: [0.65, 0, 0.35, 1] },
      )
      await animateDoc(docScope.current, { y: dy + 10, opacity: 0 }, { duration: 0.35, ease: 'easeIn' })
      setCount((c) => c + 1)
      setPhase('done')
      toast({ title: 'Resource added to CampusHub ✦', description: title, tone: 'ink' })
    }
    run()
  }, [phase, animateDoc, docScope, title, toast])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Give your resource a title so classmates can find it.')
      return
    }
    setError('')
    setProgress(0)
    setPhase('uploading')
  }

  const reset = () => {
    setPhase('empty')
    setFile(null)
    setProgress(0)
    setTitle('')
    setUnit('')
  }

  const busy = phase === 'uploading' || phase === 'filing'
  const activeStep = steps.findIndex((s) => s.key.includes(phase))
  const subjectInfo = subjects.find((s) => s.code === subject)!

  return (
    <div>
      <header className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Upload studio</p>
          <h1 className="font-serif text-4xl tracking-tight text-deep md:text-6xl">
            Add to the <span className="italic text-ink">shared shelf.</span>
          </h1>
        </div>
        <ol className="flex items-center gap-1.5" aria-label="Upload progress">
          {steps.map((s, i) => (
            <li key={s.label} className="flex items-center gap-1.5">
              <span
                className={cn(
                  'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs transition-colors duration-300',
                  i === activeStep ? 'bg-ink text-cream' : i < activeStep ? 'bg-sage text-ink' : 'text-muted-foreground',
                )}
                aria-current={i === activeStep ? 'step' : undefined}
              >
                <span className="font-serif">{i + 1}</span> {s.label}
              </span>
              {i < steps.length - 1 && <span className="h-px w-3 bg-border" aria-hidden="true" />}
            </li>
          ))}
        </ol>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <section
          aria-label="Upload stage"
          className="relative isolate flex min-h-[460px] flex-col items-center justify-between gap-8 overflow-hidden rounded-[32px] border border-border bg-sage/40 p-6 md:min-h-[540px] md:flex-row md:p-10"
        >
          <div className="pointer-events-none absolute inset-0 paper-grid opacity-60" aria-hidden="true" />

          <div className="relative flex flex-1 items-center justify-center self-stretch">
            <AnimatePresence mode="wait">
              {phase === 'empty' ? (
                <motion.button
                  key="drop"
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault()
                    setDragOver(true)
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault()
                    setDragOver(false)
                    const f = e.dataTransfer.files[0]
                    if (f) pick(f)
                  }}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: dragOver ? 1.04 : 1, rotate: dragOver ? -1.5 : 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  className={cn(
                    'group relative flex aspect-[3/4] w-56 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed bg-paper/70 p-6 text-center transition-colors md:w-64',
                    dragOver ? 'border-ink bg-paper' : 'border-ink/25 hover:border-ink/50',
                  )}
                >
                  <span className="grid size-14 place-items-center rounded-2xl bg-champagne text-ink transition-transform duration-300 group-hover:-translate-y-1 group-hover:-rotate-6">
                    <UploadCloud className="size-6" aria-hidden="true" />
                  </span>
                  <span className="font-serif text-xl text-deep">{dragOver ? 'Let it go ✦' : 'Drop a PDF here'}</span>
                  <span className="text-xs text-muted-foreground">or click to browse · up to 25 MB</span>
                </motion.button>
              ) : (
                <motion.div
                  key="doc"
                  ref={docScope}
                  initial={{ opacity: 0, y: 60, rotate: 6, scale: 0.9 }}
                  animate={
                    phase === 'uploading'
                      ? { opacity: 1, y: -14, rotate: -1.5, scale: 1.03 }
                      : phase === 'selected'
                        ? { opacity: 1, y: 0, rotate: 0, scale: 1 }
                        : undefined
                  }
                  transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                  className={cn(
                    'relative z-10 aspect-[3/4] w-56 rounded-2xl bg-paper p-5 transition-shadow duration-500 md:w-64',
                    phase === 'uploading' ? 'paper-shadow-lift' : 'paper-shadow',
                  )}
                >
                  <svg className="pointer-events-none absolute inset-0 size-full overflow-visible" aria-hidden="true">
                    <motion.rect
                      x="0"
                      y="0"
                      width="100%"
                      height="100%"
                      rx="15"
                      fill="none"
                      stroke="#123C35"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      pathLength={1}
                      strokeDasharray="1 1"
                      animate={{ strokeDashoffset: 1 - progress / 100 }}
                      transition={{ duration: 0.2 }}
                      style={{ strokeDashoffset: 1 }}
                    />
                  </svg>
                  <div className="paper-ruled absolute inset-x-5 bottom-5 top-24 opacity-80" aria-hidden="true" />
                  <span className="absolute inset-y-0 left-9 w-px bg-peach/40" aria-hidden="true" />
                  <div className="relative">
                    <span className="inline-block rounded-md bg-champagne px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink">
                      PDF · {file ? (file.size / 1024 / 1024).toFixed(1) : '0'} MB
                    </span>
                    <p className="mt-3 line-clamp-3 pl-5 font-serif text-lg italic leading-snug text-deep">{title || file?.name}</p>
                    <p className="mt-1 pl-5 text-xs text-muted-foreground">
                      {subjectInfo.code} · {categoryLabel[category]}
                    </p>
                  </div>
                  <AnimatePresence>
                    {phase === 'uploading' && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-x-5 bottom-5 flex items-center justify-between rounded-xl bg-ink px-3 py-2 text-cream"
                      >
                        <span className="text-xs">{progress < 40 ? 'Reading pages…' : progress < 80 ? 'Stitching binding…' : 'Almost shelved…'}</span>
                        <span className="font-serif text-sm text-champagne">{Math.round(progress)}%</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div ref={folderRef} className="relative">
            <FolderBack count={count} />
            <FolderFront receiving={phase === 'done'} />
            <AnimatePresence>
              {phase === 'done' && (
                <motion.div className="pointer-events-none absolute inset-0 z-30" aria-hidden="true">
                  {Array.from({ length: 10 }).map((_, i) => {
                    const angle = (i / 10) * Math.PI * 2 - Math.PI / 2
                    const dist = 70 + (i % 3) * 22
                    return (
                      <motion.span
                        key={i}
                        className={cn('absolute left-1/2 top-1/3', i % 2 ? 'text-peach' : 'text-champagne')}
                        initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
                        animate={{
                          x: Math.cos(angle) * dist,
                          y: Math.sin(angle) * dist,
                          scale: [0, 1.2, 0],
                          opacity: [1, 1, 0],
                          rotate: 90,
                        }}
                        transition={{ duration: 1.1, delay: i * 0.02, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <Sparkle className={i % 3 === 0 ? 'size-5' : 'size-3'} />
                      </motion.span>
                    )
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {phase === 'done' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 20 }}
                className="absolute inset-x-6 top-6 z-30 text-center md:left-10 md:right-auto md:top-1/2 md:max-w-[46%] md:-translate-y-1/2 md:text-left"
              >
                <p className="font-serif text-3xl leading-tight text-deep md:text-4xl">
                  Resource added to CampusHub <span className="text-peach">✦</span>
                </p>
                <p className="mt-2 text-sm text-ink/70">It&apos;s now on the {subjectInfo.short} shelf for your batch.</p>
              </motion.div>
            )}
          </AnimatePresence>

          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) pick(f)
              e.target.value = ''
            }}
          />
        </section>

        <section aria-label="Resource details" className="rounded-[32px] border border-border bg-paper p-6 paper-shadow md:p-8">
          <AnimatePresence mode="wait">
            {phase === 'empty' ? (
              <motion.div key="intro" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
                <p className="font-serif text-2xl text-deep">A good upload has…</p>
                <ul className="mt-4 space-y-3 text-sm text-deep/80">
                  {['A clear title with the unit number', 'The right subject code', 'Readable scans — no blurry photos', 'Your name, so juniors can thank you'].map((t, i) => (
                    <motion.li
                      key={t}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.06 }}
                      className="flex items-start gap-3"
                    >
                      <Sparkle className="mt-1 size-3 shrink-0 text-peach" />
                      {t}
                    </motion.li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => pick({ name: 'DS_Unit-4_Graphs_and_Traversals.pdf', size: 3.6 * 1024 * 1024 })}
                  className="group mt-8 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-ink/30 px-4 py-3 text-sm text-ink transition-all hover:border-ink hover:bg-sage/50 active:scale-[0.98]"
                >
                  <FilePlus2 className="size-4 transition-transform group-hover:-rotate-12" aria-hidden="true" />
                  Try with a sample PDF
                </button>
                {error && <p className="mt-3 text-sm text-destructive" role="alert">{error}</p>}
              </motion.div>
            ) : phase === 'done' ? (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex h-full flex-col justify-center gap-3">
                <p className="font-serif text-2xl text-deep">Nicely done, Aanya.</p>
                <p className="text-sm text-muted-foreground">You&apos;ve shared 13 resources this semester. That&apos;s top 5% of your batch.</p>
                <div className="mt-4 grid gap-2">
                  <Link href={`/library?subject=${subject}`} className="group flex items-center justify-center gap-2 rounded-2xl bg-ink px-4 py-3 text-sm font-medium text-cream active:scale-[0.98]">
                    View on the shelf
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                  <button type="button" onClick={reset} className="flex items-center justify-center gap-2 rounded-2xl border border-border px-4 py-3 text-sm text-deep hover:bg-muted active:scale-[0.98]">
                    <RotateCcw className="size-4" aria-hidden="true" /> Upload another
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={submit} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="flex flex-col gap-4">
                <fieldset disabled={busy} className="flex flex-col gap-4 disabled:opacity-60">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Title</span>
                    <input value={title} onChange={(e) => setTitle(e.target.value)} className={fieldClass} placeholder="Data Structures — Unit 4 Graphs" />
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex flex-col gap-1.5">
                      <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Subject</span>
                      <select value={subject} onChange={(e) => setSubject(e.target.value)} className={fieldClass}>
                        {subjects.map((s) => (
                          <option key={s.code} value={s.code}>
                            {s.code} · {s.short}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="flex flex-col gap-1.5">
                      <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Unit</span>
                      <input value={unit} onChange={(e) => setUnit(e.target.value)} className={fieldClass} placeholder="Unit 4" />
                    </label>
                  </div>
                  <fieldset>
                    <legend className="mb-1.5 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Type</legend>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((c) => (
                        <label
                          key={c}
                          className={cn(
                            'cursor-pointer rounded-full border px-3 py-1.5 text-sm transition-all has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ink',
                            category === c ? 'border-ink bg-ink text-cream' : 'border-border text-deep hover:border-ink/30',
                          )}
                        >
                          <input type="radio" name="category" value={c} checked={category === c} onChange={() => setCategory(c)} className="sr-only" />
                          {categoryLabel[c]}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </fieldset>
                {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={busy}
                    className="group relative flex h-12 flex-1 items-center justify-center gap-2 overflow-hidden rounded-2xl bg-ink px-4 text-sm font-medium text-cream transition-transform active:scale-[0.98] disabled:cursor-progress"
                  >
                    {busy ? (
                      <span className="flex items-center gap-2">
                        <span className="flex gap-1" aria-hidden="true">
                          {[0, 1, 2].map((i) => (
                            <motion.span
                              key={i}
                              className="size-1.5 rounded-full bg-champagne"
                              animate={{ y: [0, -4, 0] }}
                              transition={{ repeat: Infinity, duration: 0.7, delay: i * 0.12 }}
                            />
                          ))}
                        </span>
                        {phase === 'filing' ? 'Filing it away' : 'Uploading'}
                      </span>
                    ) : (
                      <>
                        Add to CampusHub
                        <Sparkle className="size-3.5 text-champagne transition-transform duration-500 group-hover:rotate-180" />
                      </>
                    )}
                  </button>
                  {!busy && (
                    <button type="button" onClick={reset} className="h-12 rounded-2xl border border-border px-4 text-sm text-deep hover:bg-muted">
                      Cancel
                    </button>
                  )}
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  )
}
