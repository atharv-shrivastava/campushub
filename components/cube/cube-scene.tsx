'use client'

import { motion, useMotionValue, useSpring } from 'motion/react'
import { useRef } from 'react'

type CubeSceneProps = { accent: string; accent2: string; intensity?: number }

export function CubeScene({ accent, accent2 }: CubeSceneProps) {
  const host = useRef<HTMLDivElement>(null)
  const rx = useSpring(useMotionValue(0), { stiffness: 140, damping: 18 })
  const ry = useSpring(useMotionValue(0), { stiffness: 140, damping: 18 })
  const move = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = host.current?.getBoundingClientRect()
    if (!rect) return
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    ry.set(x * 22)
    rx.set(-y * 18)
  }
  const reset = () => { rx.set(-4); ry.set(-8) }

  return (
    <div ref={host} className="cube-css-3d-scene" onPointerMove={move} onPointerLeave={reset} aria-hidden="true">
      <motion.div
        className="cube-3d-stage"
        style={{ rotateX: rx, rotateY: ry }}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.div className="cube-3d-card cube-3d-back" style={{ background: accent2 }}
          animate={{ rotateZ: [-4, 4, -4], translateZ: [-8, -2, -8] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="cube-3d-card cube-3d-mid" style={{ background: '#FFF8E9' }}
          animate={{ x: [-3, 3, -3], y: [2, -2, 2] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="cube-3d-card cube-3d-main" style={{ background: accent }}
          animate={{ rotateZ: [-2, 2, -2], translateZ: [38, 50, 38] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
          <span>C</span><i /><b />
        </motion.div>
        <motion.div className="cube-3d-orbit" style={{ borderColor: accent2 }}
          animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }} />
        <motion.span className="cube-3d-dot cube-3d-dot-a" style={{ background: accent2 }}
          animate={{ y: [-8, 8, -8], x: [0, 3, 0] }} transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.span className="cube-3d-dot cube-3d-dot-b" style={{ background: accent }}
          animate={{ y: [7, -7, 7], x: [0, -4, 0] }} transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }} />
      </motion.div>
    </div>
  )
}
