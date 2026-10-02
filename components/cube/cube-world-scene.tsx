'use client'

import { useEffect, useRef, useState } from 'react'
import type * as THREE from 'three'

type CubeWorldSceneProps = { accent:string; accent2:string; primary:string }

export function CubeWorldScene({ accent, accent2, primary }: CubeWorldSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let disposed = false
    let cleanup = () => {}

    const boot = async () => {
      if (!hostRef.current || !('WebGLRenderingContext' in window)) {
        setFailed(true)
        return
      }

      try {
        const THREE = await import('three')
        if (disposed || !hostRef.current) return

        const host = hostRef.current
        const width = host.clientWidth
        const height = host.clientHeight

        const scene = new THREE.Scene()
        scene.fog = new THREE.FogExp2(new THREE.Color('#f4efe3'), 0.035)

        const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 80)
        camera.position.set(0, 3.4, 11)

        const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true, powerPreference:'high-performance' })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.35))
        renderer.setSize(width, height, false)
        renderer.outputColorSpace = THREE.SRGBColorSpace
        renderer.shadowMap.enabled = false
        host.appendChild(renderer.domElement)

        const ambient = new THREE.HemisphereLight('#fffdf5', '#b7c9c0', 2.2)
        const key = new THREE.DirectionalLight(new THREE.Color('#ffffff'), 3.5)
        key.position.set(4, 8, 7)
        scene.add(ambient, key)

        const root = new THREE.Group()
        root.rotation.x = -0.14
        scene.add(root)

        const floor = new THREE.Mesh(
          new THREE.CircleGeometry(8, 48),
          new THREE.MeshStandardMaterial({ color:'#e7eee8', roughness:.92, metalness:.02 }),
        )
        floor.rotation.x = -Math.PI / 2
        floor.position.y = -1.45
        root.add(floor)

        const grid = new THREE.GridHelper(14, 18, new THREE.Color(primary), new THREE.Color('#ffffff'))
        grid.position.y = -1.43
        grid.material.transparent = true
        grid.material.opacity = .12
        root.add(grid)

        const buildingMat = new THREE.MeshStandardMaterial({ color:new THREE.Color(primary), roughness:.72, metalness:.08 })
        const creamMat = new THREE.MeshStandardMaterial({ color:'#fff7df', roughness:.8, metalness:.02 })
        const accentMat = new THREE.MeshStandardMaterial({ color:new THREE.Color(accent), roughness:.5, metalness:.1 })
        const accent2Mat = new THREE.MeshStandardMaterial({ color:new THREE.Color(accent2), roughness:.45, metalness:.08 })

        const campus = new THREE.Group()
        root.add(campus)

        const towerData = [
          [-3.2,-0.35,-.15,1.4,2.5],
          [-1.4,-0.45,-.55,1.15,1.65],
          [1.5,-0.4,-.35,1.4,2.05],
          [3.1,-0.5,.05,1.1,1.45],
        ]

        towerData.forEach(([x,y,z,w,h],i) => {
          const mesh = new THREE.Mesh(new THREE.BoxGeometry(w,h,w*.76), i % 2 ? creamMat : buildingMat)
          mesh.position.set(x as number,(y as number)+(h as number)/2,z as number)
          campus.add(mesh)

          const windowGeo = new THREE.PlaneGeometry(w*.56,.16)
          for(let row=0;row<3;row++){
            const window = new THREE.Mesh(windowGeo, i%2 ? accent2Mat : accentMat)
            window.position.set(x as number,(y as number)+.45+row*.47,(z as number)-(w as number)*.385)
            window.rotation.y = 0
            campus.add(window)
          }
        })

        const plaza = new THREE.Mesh(
          new THREE.CylinderGeometry(1.7,1.9,.22,32),
          creamMat,
        )
        plaza.position.set(0,-1.23,.35)
        campus.add(plaza)

        const cube = new THREE.Mesh(
          new THREE.BoxGeometry(1.7,1.7,1.7),
          new THREE.MeshPhysicalMaterial({
            color:new THREE.Color(accent),
            roughness:.23,
            metalness:.13,
            clearcoat:.75,
            clearcoatRoughness:.18,
            transmission:.04,
          }),
        )
        cube.position.set(0,.12,.45)
        cube.rotation.set(.24,.42,-.1)
        root.add(cube)

        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(2.25,.035,8,96),
          new THREE.MeshBasicMaterial({ color:new THREE.Color(accent2), transparent:true, opacity:.7 }),
        )
        ring.rotation.x = Math.PI/2.35
        ring.position.y = .25
        root.add(ring)

        const coin = new THREE.Mesh(
          new THREE.CylinderGeometry(.52,.52,.13,40),
          new THREE.MeshStandardMaterial({ color:new THREE.Color(accent2), roughness:.34, metalness:.55 }),
        )
        coin.rotation.x = Math.PI/2
        coin.position.set(3.25,1.35,.65)
        root.add(coin)

        const book = new THREE.Group()
        const bookBody = new THREE.Mesh(new THREE.BoxGeometry(1.05,.14,1.36), creamMat)
        const bookCover = new THREE.Mesh(new THREE.BoxGeometry(1.12,.035,1.43), accentMat)
        book.add(bookBody,bookCover)
        book.position.set(-3.4,1.15,1.1)
        book.rotation.set(.2,-.35,-.14)
        root.add(book)

        const beacon = new THREE.Mesh(
          new THREE.ConeGeometry(.56,1.05,8),
          new THREE.MeshStandardMaterial({ color:new THREE.Color(primary), roughness:.36, metalness:.18 }),
        )
        beacon.position.set(2.8,1.0,-1.45)
        root.add(beacon)

        const particleGeo = new THREE.BufferGeometry()
        const count = 65
        const positions = new Float32Array(count*3)
        for(let i=0;i<count;i++){
          positions[i*3] = (Math.random()-.5)*14
          positions[i*3+1] = Math.random()*6-1
          positions[i*3+2] = (Math.random()-.5)*7
        }
        particleGeo.setAttribute('position',new THREE.BufferAttribute(positions,3))
        const particles = new THREE.Points(
          particleGeo,
          new THREE.PointsMaterial({ color:new THREE.Color(accent2), size:.035, transparent:true, opacity:.42, depthWrite:false }),
        )
        scene.add(particles)

        const pointer = { x:0, y:0, tx:0, ty:0 }
        const onPointer = (event:PointerEvent) => {
          const rect = host.getBoundingClientRect()
          pointer.tx = ((event.clientX-rect.left)/rect.width-.5)*1.2
          pointer.ty = ((event.clientY-rect.top)/rect.height-.5)*1.0
        }
        const resetPointer = () => { pointer.tx=0; pointer.ty=0 }
        const onTouch = (event:TouchEvent) => {
          if(!event.touches[0]) return
          const rect=host.getBoundingClientRect()
          pointer.tx=((event.touches[0].clientX-rect.left)/rect.width-.5)*1.0
          pointer.ty=((event.touches[0].clientY-rect.top)/rect.height-.8)*.8
        }

        const onScroll = () => {
          const rect = host.getBoundingClientRect()
          const progress = THREE.MathUtils.clamp((window.innerHeight*.72-rect.top)/(window.innerHeight+rect.height),0,1)
          root.rotation.y = progress*.62-.28
          camera.position.y = 3.4 - progress*.7
          camera.position.z = 11 - progress*1.7
        }

        host.addEventListener('pointermove',onPointer)
        host.addEventListener('pointerleave',resetPointer)
        host.addEventListener('touchmove',onTouch,{passive:true})
        window.addEventListener('scroll',onScroll,{passive:true})
        onScroll()

        let frame = 0
        const started = performance.now()
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        const animate = (time:number) => {
          if(disposed) return
          const elapsed = (time-started)/1000
          if(!reduced){
            pointer.x += (pointer.tx-pointer.x)*.055
            pointer.y += (pointer.ty-pointer.y)*.055
            cube.rotation.y += .0035
            cube.rotation.x += Math.sin(elapsed*.65)*.0007
            ring.rotation.z += .003
            coin.rotation.z -= .009
            coin.position.y = 1.35 + Math.sin(elapsed*1.3)*.18
            book.rotation.y += .0024
            book.position.y = 1.15 + Math.cos(elapsed*1.1)*.08
            beacon.position.y = 1.0 + Math.sin(elapsed*1.6)*.13
            campus.rotation.y += .0008
            particles.rotation.y += .00025
          }
          root.rotation.x += ((reduced ? -.14 : -.14 + pointer.y*.08)-root.rotation.x)*.035
          root.rotation.y += (root.rotation.y + pointer.x*.13 - root.rotation.y)*.035
          renderer.render(scene,camera)
          frame=requestAnimationFrame(animate)
        }
        frame=requestAnimationFrame(animate)

        const resize = () => {
          const w=host.clientWidth,h=host.clientHeight
          if(!w||!h) return
          camera.aspect=w/h
          camera.updateProjectionMatrix()
          renderer.setSize(w,h,false)
        }
        const ro = new ResizeObserver(resize)
        ro.observe(host)

        cleanup = () => {
          cancelAnimationFrame(frame)
          ro.disconnect()
          host.removeEventListener('pointermove',onPointer)
          host.removeEventListener('pointerleave',resetPointer)
          host.removeEventListener('touchmove',onTouch)
          window.removeEventListener('scroll',onScroll)
          particleGeo.dispose()
          renderer.dispose()
          scene.traverse((object) => {
            const mesh = object as THREE.Mesh
            if(mesh.geometry) mesh.geometry.dispose()
            if(Array.isArray(mesh.material)) mesh.material.forEach((m)=>m.dispose())
            else if(mesh.material) mesh.material.dispose()
          })
          if(renderer.domElement.parentElement===host) host.removeChild(renderer.domElement)
        }
      } catch (error) {
        console.error('CUBE WebGL scene failed',error)
        if(!disposed) setFailed(true)
      }
    }

    void boot()
    return () => { disposed=true; cleanup() }
  },[accent,accent2,primary])

  return <div ref={hostRef} className="cube-world-scene">{failed && <div className="cube-world-fallback"><span>Campus in motion</span><strong>Resources · Requests · Events · Cred</strong></div>}<div className="cube-world-label cube-world-label-a"><span>01</span>RESOURCES</div><div className="cube-world-label cube-world-label-b"><span>02</span>REQUESTS</div><div className="cube-world-label cube-world-label-c"><span>03</span>EVENTS</div></div>
}
