'use client'

import { useEffect, useRef } from 'react'

type CubeSceneProps = { accent: string; accent2: string; intensity?: number }

export function CubeScene({ accent, accent2, intensity = 1 }: CubeSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    let dispose = () => {}

    void (async () => {
      const THREE = await import('three')
      if (cancelled || !hostRef.current) return
      const host = hostRef.current
      host.innerHTML = ''

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100)
      camera.position.set(0, 0.15, 5.1)

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.12
      host.appendChild(renderer.domElement)

      scene.add(new THREE.HemisphereLight(0xffffff, 0xd8d0c1, 2.1))
      const key = new THREE.DirectionalLight(0xffffff, 2.4)
      key.position.set(2, 3, 4)
      scene.add(key)

      const rim = new THREE.PointLight(new THREE.Color(accent2), 4.7 * intensity, 7)
      rim.position.set(-2.6, 1.4, 2.4)
      scene.add(rim)

      const group = new THREE.Group()
      scene.add(group)

      const block = (size: number, color: string, position: [number, number, number], rotation: [number, number, number], transparent = false) => {
        const geometry = new THREE.BoxGeometry(size, size, size, 2, 2, 2)
        const material = new THREE.MeshPhysicalMaterial({
          color,
          roughness: 0.23,
          metalness: 0.08,
          transmission: transparent ? 0.3 : 0,
          transparent,
          opacity: transparent ? 0.84 : 1,
          clearcoat: 0.6,
          clearcoatRoughness: 0.18,
        })
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(...position)
        mesh.rotation.set(...rotation)
        return mesh
      }

      group.add(block(1.35, accent, [0, 0.02, 0], [0.22, 0.48, 0.06]))
      group.add(block(0.62, accent2, [0.96, 0.63, 0.12], [0.7, 0.12, 0.36]))
      group.add(block(0.43, '#FFF8E9', [-1.02, -0.7, 0.18], [0.6, 0.82, 0.12]))
      group.add(block(0.34, accent2, [0.04, 1.03, 0.08], [0.1, 0.35, 0.8], true))

      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.65, 0.025, 12, 96),
        new THREE.MeshBasicMaterial({ color: accent2, transparent: true, opacity: 0.45 }),
      )
      ring.rotation.x = 1.18
      group.add(ring)

      const pointer = { x: 0, y: 0 }
      let frame = 0
      let running = true

      const onMove = (event: PointerEvent) => {
        const rect = host.getBoundingClientRect()
        pointer.x = (event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5
        pointer.y = (event.clientY - rect.top) / Math.max(rect.height, 1) - 0.5
      }
      const onResize = () => {
        const width = host.clientWidth || 320
        const height = host.clientHeight || 300
        camera.aspect = width / height
        camera.updateProjectionMatrix()
        renderer.setSize(width, height)
      }

      const animate = () => {
        if (!running) return
        frame = requestAnimationFrame(animate)
        group.rotation.y += 0.0032
        group.rotation.x += (pointer.y * 0.22 - group.rotation.x) * 0.018
        group.rotation.z += (-pointer.x * 0.18 - group.rotation.z) * 0.018
        ring.rotation.z -= 0.002
        ring.scale.setScalar(1 + Math.sin(performance.now() * 0.0012) * 0.025)
        renderer.render(scene, camera)
      }

      host.addEventListener('pointermove', onMove)
      window.addEventListener('resize', onResize)
      onResize()
      animate()

      dispose = () => {
        running = false
        cancelAnimationFrame(frame)
        host.removeEventListener('pointermove', onMove)
        window.removeEventListener('resize', onResize)
        scene.traverse((object) => {
          const mesh = object as THREE.Mesh
          if (mesh.geometry) mesh.geometry.dispose()
          const material = mesh.material as THREE.Material | THREE.Material[] | undefined
          if (Array.isArray(material)) material.forEach((item) => item.dispose())
          else material?.dispose()
        })
        renderer.dispose()
        renderer.domElement.remove()
      }
    })()

    return () => {
      cancelled = true
      dispose()
    }
  }, [accent, accent2, intensity])

  return <div ref={hostRef} className="cube-3d-scene" aria-hidden="true" />
}
