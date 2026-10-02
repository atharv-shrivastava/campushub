import { HeroSearch } from '@/components/home/hero-search'
import { SubjectShelf } from '@/components/home/subject-shelf'
import { HomeBento } from '@/components/home/home-bento'
import { HeroStack } from '@/components/home/hero-stack'
import { Sparkle } from '@/components/brand/sparkle'

export default function HomePage() {
  return (
    <div className="flex flex-col gap-14 md:gap-20">
      <section className="relative grid items-center gap-10 pt-4 md:pt-10 lg:grid-cols-[1.5fr_1fr]">
        <div>
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-paper px-3 py-1 text-xs text-muted-foreground paper-shadow">
          <span className="size-1.5 rounded-full bg-peach" aria-hidden="true" />
          Friday, 2 Oct · Week 7 of Semester 3
        </div>
        <h1 className="max-w-3xl font-serif text-5xl leading-[1.02] tracking-tight text-deep text-balance md:text-7xl">
          Good evening, <span className="italic text-ink">Aanya</span>.
          <br />
          <span className="text-deep/50">What are we studying tonight?</span>
        </h1>
        <div className="mt-8 max-w-2xl">
          <HeroSearch />
        </div>
        </div>
        <div className="hidden lg:block">
          <HeroStack />
        </div>
        <Sparkle className="absolute right-[2%] top-4 hidden size-8 animate-twinkle text-peach md:block" />
        <Sparkle className="absolute right-[20%] top-36 hidden size-4 animate-twinkle text-ink/40 [animation-delay:1.2s] md:block" />
      </section>

      <SubjectShelf />
      <HomeBento />
    </div>
  )
}
