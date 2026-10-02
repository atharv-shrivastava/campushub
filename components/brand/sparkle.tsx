import { cn } from '@/lib/utils'

export function Sparkle({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn('size-4', className)} style={style} fill="currentColor">
      <path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z" />
    </svg>
  )
}

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <span className="relative grid size-8 place-items-center rounded-[10px] bg-ink text-champagne">
        <span className="absolute inset-y-1.5 left-1.5 w-px bg-champagne/30" aria-hidden="true" />
        <span className="font-serif text-lg italic leading-none">c</span>
        <Sparkle className="absolute -right-1 -top-1 size-3 text-peach" />
      </span>
      {!compact && (
        <span className="font-serif text-xl tracking-tight text-deep">
          Campus<span className="italic text-ink">Hub</span>
        </span>
      )}
    </span>
  )
}
