'use client'

import { motion } from 'motion/react'

type CubeSceneProps = { accent: string; accent2: string; intensity?: number }

export function CubeScene({ accent, accent2 }: CubeSceneProps) {
  return (
    <div className="cube-css-3d-scene" aria-hidden="true">
      <motion.div
        className="cube-3d-stage"
        animate={{
          rotateX: [-4, 4, -4],
          rotateY: [-8, 8, -8],
          y: [0, -6, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="cube-3d-card cube-3d-back" style={{ background: accent2 }} />
        <div className="cube-3d-card cube-3d-mid" style={{ background: '#FFF8E9' }} />
        <motion.div
          className="cube-3d-card cube-3d-main"
          style={{ background: accent }}
          animate={{ rotateZ: [-2, 2, -2] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span>C</span>
          <i />
          <b />
        </motion.div>
        <motion.div
          className="cube-3d-orbit"
          style={{ borderColor: accent2 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        />
        <span className="cube-3d-dot cube-3d-dot-a" style={{ background: accent2 }} />
        <span className="cube-3d-dot cube-3d-dot-b" style={{ background: accent }} />
      </motion.div>
    </div>
  )
}
