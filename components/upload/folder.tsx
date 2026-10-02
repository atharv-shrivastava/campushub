'use client'

import { motion } from 'motion/react'

export function FolderBack({ count }: { count: number }) {
  return (
    <div className="relative z-0 h-40 w-52 md:h-48 md:w-60">
      <svg viewBox="0 0 240 190" className="absolute inset-0 size-full" fill="none" aria-hidden="true">
        <path d="M8 30a14 14 0 0 1 14-14h62l18 18h116a14 14 0 0 1 14 14v124a14 14 0 0 1-14 14H22a14 14 0 0 1-14-14V30Z" fill="#123C35" />
        <rect x="26" y="44" width="150" height="110" rx="6" fill="#FFFDF7" transform="rotate(-4 100 100)" />
        <rect x="50" y="40" width="150" height="110" rx="6" fill="#F3E4C3" transform="rotate(3 120 100)" />
      </svg>
      <span className="absolute left-5 top-[22px] text-[10px] font-semibold uppercase tracking-[0.18em] text-champagne md:top-[26px]">
        Library · {count}
      </span>
    </div>
  )
}

export function FolderFront({ receiving }: { receiving: boolean }) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[62%] origin-bottom"
      animate={receiving ? { rotateX: [0, -24, 0], scaleY: [1, 0.94, 1] } : { rotateX: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformPerspective: 600 }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 240 118" className="size-full" fill="none" preserveAspectRatio="none">
        <path d="M0 14a14 14 0 0 1 14-14h212a14 14 0 0 1 14 14v90a14 14 0 0 1-14 14H14A14 14 0 0 1 0 104V14Z" fill="#1B5248" />
        <path d="M20 22h200" stroke="#F3E4C3" strokeOpacity=".25" strokeDasharray="4 6" />
      </svg>
      <span className="absolute bottom-4 left-5 font-serif text-lg italic text-champagne">CampusHub</span>
    </motion.div>
  )
}
