import type { Category } from '@/lib/data'
import { cn } from '@/lib/utils'

function Paperclip({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 60" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <path d="M8 18v28a6 6 0 0 0 12 0V12a9 9 0 0 0-18 0v34" strokeLinecap="round" />
    </svg>
  )
}

const lines = (n: number, widths: number[]) =>
  Array.from({ length: n }, (_, i) => widths[i % widths.length])

export function ResourcePreview({
  category,
  title,
  code,
  year,
  className,
  size = 'md',
}: {
  category: Category
  title: string
  code: string
  year?: number
  className?: string
  size?: 'md' | 'lg'
}) {
  const lg = size === 'lg'

  if (category === 'Lab Manual') {
    return (
      <div className={cn('relative flex overflow-hidden rounded-xl bg-ink text-cream', className)}>
        <div className="w-3 bg-deep" aria-hidden="true" />
        <div className="flex flex-1 flex-col justify-between p-4">
          <span className="text-[10px] uppercase tracking-[0.2em] text-champagne/70">Laboratory manual</span>
          <div>
            <p className={cn('font-serif italic leading-tight text-champagne', lg ? 'text-3xl' : 'text-lg')}>{code}</p>
            <div className="mt-2 h-px w-12 bg-champagne/40" />
          </div>
          <span className="text-[10px] text-cream/50">Dept. of Computer Science</span>
        </div>
      </div>
    )
  }

  const tone = {
    Notes: 'bg-paper paper-ruled',
    Assignment: 'bg-champagne/60',
    Practical: 'bg-paper paper-grid',
    PYQ: 'bg-cream',
    Syllabus: 'bg-sage/60',
  }[category]

  return (
    <div
      className={cn('relative overflow-hidden rounded-xl', tone, className)}
      style={{ clipPath: 'polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%)' }}
    >
      <span
        aria-hidden="true"
        className="absolute right-0 top-0 size-[22px] rounded-bl-md bg-border"
        style={{ clipPath: 'polygon(0 0, 0 100%, 100% 100%)' }}
      />

      {category === 'Notes' && <span aria-hidden="true" className="absolute inset-y-0 left-6 w-px bg-peach/50" />}

      <div className={cn('relative flex h-full flex-col', lg ? 'p-8 pl-12' : 'p-4 pl-9')}>
        {category === 'PYQ' ? (
          <>
            <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-muted-foreground">University examination</p>
            <p className={cn('mt-1 font-serif text-deep', lg ? 'text-2xl' : 'text-sm')}>{code}</p>
            <div className="mt-3 space-y-1.5" aria-hidden="true">
              {lines(lg ? 9 : 4, [92, 70, 84, 56]).map((w, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[8px] text-muted-foreground">Q{i + 1}</span>
                  <span className="h-1 rounded-full bg-deep/15" style={{ width: `${w}%` }} />
                </div>
              ))}
            </div>
            <span
              className={cn(
                'absolute bottom-3 right-3 grid place-items-center rounded-full border-2 border-dashed border-peach text-center font-serif italic leading-none text-peach',
                lg ? 'size-24 text-base' : 'size-14 text-[10px]',
              )}
              style={{ transform: 'rotate(-14deg)' }}
            >
              PYQ
              <br />
              {year}
            </span>
          </>
        ) : category === 'Practical' ? (
          <>
            <p className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground">Program 04 · Aim</p>
            <div className="mt-2 space-y-1.5 rounded-md bg-deep/[0.04] p-2 font-mono" aria-hidden="true">
              {lines(lg ? 10 : 4, [60, 40, 75, 30, 55]).map((w, i) => (
                <div key={i} className="flex gap-1.5" style={{ paddingLeft: `${(i % 3) * 8}px` }}>
                  <span className="h-1 w-3 rounded-full bg-peach/70" />
                  <span className="h-1 rounded-full bg-ink/30" style={{ width: `${w}%` }} />
                </div>
              ))}
            </div>
          </>
        ) : category === 'Assignment' ? (
          <>
            <Paperclip className={cn('absolute -top-2 text-ink/60', lg ? 'left-16 h-20 w-8' : 'left-10 h-12 w-5')} />
            <p className="mt-4 text-[9px] uppercase tracking-[0.18em] text-ink/60">Assignment · {code}</p>
            <div className="mt-2 space-y-2" aria-hidden="true">
              {lines(lg ? 10 : 4, [88, 64, 78, 50]).map((w, i) => (
                <span key={i} className="block h-1 rounded-full bg-ink/15" style={{ width: `${w}%` }} />
              ))}
            </div>
          </>
        ) : category === 'Syllabus' ? (
          <>
            <p className="text-[9px] uppercase tracking-[0.18em] text-ink/60">Course outline</p>
            <div className="mt-2 space-y-2" aria-hidden="true">
              {lines(lg ? 8 : 4, [70, 55, 80, 45]).map((w, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-ink/50" />
                  <span className="h-1 rounded-full bg-ink/20" style={{ width: `${w}%` }} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <p className={cn('font-serif italic leading-snug text-ink', lg ? 'text-3xl' : 'text-[15px]')} style={{ lineHeight: lg ? '48px' : '24px' }}>
              {title.split('—')[1]?.trim() ?? title}
            </p>
            <svg viewBox="0 0 120 40" className={cn('mt-1 text-peach', lg ? 'w-56' : 'w-24')} fill="none" aria-hidden="true">
              <path d="M2 30 C 20 6, 34 6, 44 22 S 70 36, 80 16 S 104 4, 118 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </>
        )}
      </div>
    </div>
  )
}
