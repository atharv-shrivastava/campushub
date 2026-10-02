'use client'

import type { PointerEvent as ReactPointerEvent } from 'react'
import { useEffect, useRef, useState } from 'react'

type Chapter = 'resources' | 'requests' | 'events' | 'cred'
type Props = { accent:string; accent2:string; primary:string; onChapterChange?:(chapter:Chapter)=>void; onObjectActivate?:(chapter:Chapter)=>void }
type Vec3=[number,number,number]

const I=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]
const mul=(a:number[],b:number[])=>{const o=new Array(16).fill(0);for(let c=0;c<4;c++)for(let r=0;r<4;r++)for(let k=0;k<4;k++)o[c*4+r]+=a[k*4+r]*b[c*4+k];return o}
const t=(x:number,y:number,z:number)=>[1,0,0,0,0,1,0,0,0,0,1,0,x,y,z,1]
const s=(x:number,y:number,z:number)=>[x,0,0,0,0,y,0,0,0,0,z,0,0,0,0,1]
const rx=(a:number)=>{const c=Math.cos(a),q=Math.sin(a);return[1,0,0,0,0,c,q,0,0,-q,c,0,0,0,0,1]}
const ry=(a:number)=>{const c=Math.cos(a),q=Math.sin(a);return[c,0,-q,0,0,1,0,0,q,0,c,0,0,0,0,1]}
const rz=(a:number)=>{const c=Math.cos(a),q=Math.sin(a);return[c,q,0,0,-q,c,0,0,0,0,1,0,0,0,0,1]}
const persp=(fovy:number,aspect:number,near:number,far:number)=>{const f=1/Math.tan(fovy/2),nf=1/(near-far);return[f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*nf,-1,0,0,(2*far*near)*nf,0]}
const norm=(v:Vec3)=>{const l=Math.hypot(v[0],v[1],v[2])||1;return[v[0]/l,v[1]/l,v[2]/l] as Vec3}
const cross=(a:Vec3,b:Vec3):Vec3=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]
const sub=(a:Vec3,b:Vec3):Vec3=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]]
const dot=(a:Vec3,b:Vec3)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2]
const look=(eye:Vec3,target:Vec3,up:Vec3)=>{const z=norm(sub(eye,target)),x=norm(cross(up,z)),y=cross(z,x);return[x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1]}

const cubeV=new Float32Array([-1,-1,-1,1,-1,-1,1,1,-1,-1,1,-1,-1,-1,1,1,-1,1,1,1,1,-1,1,1])
const cubeI=new Uint16Array([0,1,2,0,2,3,4,6,5,4,7,6,0,4,5,0,5,1,3,2,6,3,6,7,0,3,7,0,7,4,1,5,6,1,6,2])
const floorV=new Float32Array([-8,-1.5,-6,8,-1.5,-6,8,-1.5,6,-8,-1.5,6])
const floorI=new Uint16Array([0,1,2,0,2,3])

function rgb(hex:string){const h=hex.replace('#','');return[parseInt(h.slice(0,2),16)/255,parseInt(h.slice(2,4),16)/255,parseInt(h.slice(4,6),16)/255]}
function makeProgram(gl:WebGLRenderingContext){
  const compile=(type:number,source:string)=>{const sh=gl.createShader(type)!;gl.shaderSource(sh,source);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(sh)||'shader compile failed');return sh}
  const vs=compile(gl.VERTEX_SHADER,`attribute vec3 aPosition;uniform mat4 uProjection,uView,uModel;void main(){gl_Position=uProjection*uView*uModel*vec4(aPosition,1.0);}`)
  const fs=compile(gl.FRAGMENT_SHADER,`precision mediump float;uniform vec3 uColor;uniform float uAlpha;void main(){gl_FragColor=vec4(uColor,uAlpha);}`)
  const p=gl.createProgram()!;gl.attachShader(p,vs);gl.attachShader(p,fs);gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p)||'shader link failed');gl.deleteShader(vs);gl.deleteShader(fs);return p
}

export function CubeWorldScene({accent,accent2,primary,onChapterChange,onObjectActivate}:Props){
  const host=useRef<HTMLDivElement>(null)
  const drag=useRef({down:false,sx:0,sy:0,rx:0,ry:0,vx:0,vy:0,moved:false,lastX:0,lastY:0})
  const hitTargets=useRef<Array<{chapter:Chapter;x:number;y:number;radius:number}>>([])
  const chapterRef=useRef<Chapter>('resources')
  const activateRef=useRef(onObjectActivate)
  const [failed,setFailed]=useState(false)

  useEffect(()=>{activateRef.current=onObjectActivate},[onObjectActivate])

  const pointerDown=(e:ReactPointerEvent<HTMLDivElement>)=>{
    drag.current.down=true
    drag.current.sx=e.clientX
    drag.current.sy=e.clientY
    drag.current.lastX=e.clientX
    drag.current.lastY=e.clientY
    drag.current.vx=0
    drag.current.vy=0
    drag.current.moved=false
    host.current?.setPointerCapture(e.pointerId)
  }
  const pointerMove=(e:ReactPointerEvent<HTMLDivElement>)=>{
    if(!drag.current.down)return
    const dx=e.clientX-drag.current.lastX
    const dy=e.clientY-drag.current.lastY
    if(Math.abs(e.clientX-drag.current.sx)+Math.abs(e.clientY-drag.current.sy)>7)drag.current.moved=true
    drag.current.ry+=dx*.005
    drag.current.rx=Math.max(-.55,Math.min(.55,drag.current.rx+dy*.0035))
    drag.current.vy=dx*.005
    drag.current.vx=dy*.0035
    drag.current.lastX=e.clientX
    drag.current.lastY=e.clientY
  }
  const pointerUp=(e:ReactPointerEvent<HTMLDivElement>)=>{
    const wasTap=!drag.current.moved
    drag.current.down=false
    host.current?.releasePointerCapture(e.pointerId)
    if(wasTap){
      const hit=hitTargets.current
        .map((target)=>({...target,distance:Math.hypot(e.clientX-target.x,e.clientY-target.y)}))
        .sort((a,b)=>a.distance-b.distance)[0]
      if(hit&&hit.distance<=hit.radius)activateRef.current?.(hit.chapter)
    }
  }

  useEffect(()=>{
    const hostEl=host.current
    if(!hostEl)return
    let stopped=false
    let raf=0
    let ro:ResizeObserver|undefined
    try{
      const canvas=document.createElement('canvas')
      canvas.setAttribute('aria-hidden','true')
      hostEl.prepend(canvas)
      const gl=canvas.getContext('webgl',{antialias:true,alpha:true,powerPreference:'high-performance'})
      if(!gl)throw new Error('WebGL unavailable')

      const program=makeProgram(gl)
      gl.useProgram(program)
      const pos=gl.getAttribLocation(program,'aPosition')
      const pLoc=gl.getUniformLocation(program,'uProjection')
      const vLoc=gl.getUniformLocation(program,'uView')
      const mLoc=gl.getUniformLocation(program,'uModel')
      const cLoc=gl.getUniformLocation(program,'uColor')
      const aLoc=gl.getUniformLocation(program,'uAlpha')

      const cubeBuf=gl.createBuffer()!,cubeIdx=gl.createBuffer()!,floorBuf=gl.createBuffer()!,floorIdx=gl.createBuffer()!,ringBuf=gl.createBuffer()!,particleBuf=gl.createBuffer()!
      gl.bindBuffer(gl.ARRAY_BUFFER,cubeBuf);gl.bufferData(gl.ARRAY_BUFFER,cubeV,gl.STATIC_DRAW)
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,cubeIdx);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,cubeI,gl.STATIC_DRAW)
      gl.bindBuffer(gl.ARRAY_BUFFER,floorBuf);gl.bufferData(gl.ARRAY_BUFFER,floorV,gl.STATIC_DRAW)
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,floorIdx);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,floorI,gl.STATIC_DRAW)

      const ringSteps=96
      const ringData=new Float32Array(ringSteps*3)
      for(let i=0;i<ringSteps;i++){const a=i/ringSteps*Math.PI*2;ringData[i*3]=Math.cos(a)*2.7;ringData[i*3+1]=0;ringData[i*3+2]=Math.sin(a)*2.7}
      gl.bindBuffer(gl.ARRAY_BUFFER,ringBuf);gl.bufferData(gl.ARRAY_BUFFER,ringData,gl.STATIC_DRAW)

      const particleCount=window.innerWidth<600?28:54
      const particleData=new Float32Array(particleCount*3)
      for(let i=0;i<particleCount;i++){particleData[i*3]=(Math.random()-.5)*12;particleData[i*3+1]=Math.random()*5-1;particleData[i*3+2]=(Math.random()-.5)*6}
      gl.bindBuffer(gl.ARRAY_BUFFER,particleBuf);gl.bufferData(gl.ARRAY_BUFFER,particleData,gl.STATIC_DRAW)

      const ca=rgb(accent),cb=rgb(accent2),cp=rgb(primary)
      const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const start=performance.now()

      const drawIndexed=(buffer:WebGLBuffer,indexBuffer:WebGLBuffer,count:number,model:number[],projection:number[],view:number[],color:number[],alpha:number)=>{
        gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,3,gl.FLOAT,false,0,0)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer)
        gl.uniformMatrix4fv(pLoc,false,new Float32Array(projection));gl.uniformMatrix4fv(vLoc,false,new Float32Array(view));gl.uniformMatrix4fv(mLoc,false,new Float32Array(model))
        gl.uniform3fv(cLoc,new Float32Array(color));gl.uniform1f(aLoc,alpha);gl.drawElements(gl.TRIANGLES,count,gl.UNSIGNED_SHORT,0)
      }

      const drawLine=(buffer:WebGLBuffer,count:number,model:number[],projection:number[],view:number[],color:number[],alpha:number)=>{
        gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,3,gl.FLOAT,false,0,0)
        gl.uniformMatrix4fv(pLoc,false,new Float32Array(projection));gl.uniformMatrix4fv(vLoc,false,new Float32Array(view));gl.uniformMatrix4fv(mLoc,false,new Float32Array(model))
        gl.uniform3fv(cLoc,new Float32Array(color));gl.uniform1f(aLoc,alpha);gl.drawArrays(gl.LINE_LOOP,0,count)
      }

      const drawParticles=(buffer:WebGLBuffer,count:number,projection:number[],view:number[])=>{
        gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,3,gl.FLOAT,false,0,0)
        gl.uniformMatrix4fv(pLoc,false,new Float32Array(projection));gl.uniformMatrix4fv(vLoc,false,new Float32Array(view));gl.uniformMatrix4fv(mLoc,false,new Float32Array(I))
        gl.uniform3fv(cLoc,new Float32Array(cb));gl.uniform1f(aLoc,.35)
        gl.drawArrays(gl.POINTS,0,count)
      }

      const box=(x:number,y:number,z:number,sx:number,sy:number,sz:number,rot:number,tilt:number,color:number[],alpha=1)=>{
        let model=t(x,y,z)
        model=mul(model,ry(rot))
        model=mul(model,rx(tilt))
        model=mul(model,s(sx,sy,sz))
        drawIndexed(cubeBuf,cubeIdx,36,model,projection,view,color,alpha)
      }

      const render=(time:number)=>{
        if(stopped)return
        const rect=hostEl.getBoundingClientRect()
        const sectionEl=hostEl.closest('.cube-gallery-showcase') as HTMLElement | null
        const sectionRect=sectionEl?.getBoundingClientRect()
        const dpr=Math.min(window.devicePixelRatio||1,1.25)
        const w=Math.max(1,Math.floor(rect.width*dpr)),h=Math.max(1,Math.floor(rect.height*dpr))
        if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h)}
        gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT)
        gl.enable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA)
        gl.enable(gl.CULL_FACE);gl.cullFace(gl.BACK)

        const elapsed=(time-start)/1000
        const sectionHeight=sectionEl?.offsetHeight ?? rect.height
        const sectionTop=sectionRect?.top ?? rect.top
        const travel=Math.max(1,sectionHeight-window.innerHeight)
        const progress=Math.max(0,Math.min(1,(-sectionTop)/travel))
        const chapterIndex=Math.min(3,Math.floor(progress*4))
        const chapter=(['resources','requests','events','cred'] as Chapter[])[chapterIndex]
        if(chapter!==chapterRef.current){chapterRef.current=chapter;onChapterChange?.(chapter)}
        const chapterCenters=[0.125,0.375,0.625,0.875]
        const focus=(i:number)=>Math.max(0,1-Math.min(1,Math.abs(progress-chapterCenters[i])/.17))
        const fResources=focus(0),fRequests=focus(1),fEvents=focus(2),fCred=focus(3)
        if(!drag.current.down&&!reduced){
          drag.current.ry+=drag.current.vy
          drag.current.rx=Math.max(-.55,Math.min(.55,drag.current.rx+drag.current.vx))
          drag.current.vy*=.92
          drag.current.vx*=.92
        }
        const autoSpin=reduced||drag.current.down?0:elapsed*.08+progress*.75
        const yaw=autoSpin+drag.current.ry
        const pitch=drag.current.rx
        const view=look([Math.sin(yaw)*8,3.05-Math.min(.65,progress*.65)+Math.sin(pitch)*2.25,Math.cos(yaw)*8],[0,0,0],[0,1,0])
        const projection=persp(.66,w/h,.1,45)
        const pv=mul(projection,view)
        const project=(p:Vec3)=>{
          const x=pv[0]*p[0]+pv[4]*p[1]+pv[8]*p[2]+pv[12]
          const y=pv[1]*p[0]+pv[5]*p[1]+pv[9]*p[2]+pv[13]
          const z=pv[3]*p[0]+pv[7]*p[1]+pv[11]*p[2]+pv[15]
          if(z===0)return null
          return {x:rect.left+(x/z*.5+.5)*rect.width,y:rect.top+(-y/z*.5+.5)*rect.height}
        }

        const fade=(active:number,base=.9)=>Math.min(1,base+active*.2)
        const sceneAlpha=(i:number)=>Math.max(.08,Math.min(1,1-Math.abs(progress-[.125,.375,.625,.875][i])/.30))

        drawIndexed(floorBuf,floorIdx,6,I,projection,view,[cb[0]*.45,cb[1]*.45,cb[2]*.45],.24)

        const bookScene=sceneAlpha(0)
        const requestScene=sceneAlpha(1)
        const eventScene=sceneAlpha(2)
        const credScene=sceneAlpha(3)

        // Resources: a study stack that opens outward as the chapter becomes active.
        for(let i=0;i<5;i++){
          const spread=(i-2)*.48
          box(spread*.75,-.35+Math.abs(i-2)*.08,.35+(2-Math.abs(i-2))*.12,
            .72,.11,.98,.18+spread*.025,0,ca,fade(bookScene,.42)*(.35+.1*bookScene))
        }
        box(0,.03,.72,1.85,.08,1.14,.02,.02,cp,.25+.58*bookScene)

        // Requests: a package moving along a visible handoff path.
        const courierT=(Math.sin(elapsed*.7)+1)*.5
        const courierX=-2.2+courierT*4.4
        for(let i=0;i<5;i++){
          const px=-2.6+i*1.3
          box(px,-.72,-.15,.28,.045,.12,0,0,cb,.16+.18*requestScene)
        }
        box(courierX,-.22,.15,.68,.62,.68,elapsed*.35,.08,cp,.34+.62*requestScene)
        box(courierX,-.22,.15,.73,.13,.16,elapsed*.35,.08,ca,.22+.56*requestScene)
        drawLine(ringBuf,ringSteps,mul(t(courierX,.42,.15),mul(ry(elapsed*.2),rx(.65))),projection,view,cb,.18+.50*requestScene)

        // Events: a small stage with a beacon that pulses into the scene.
        box(0,-.78,.35,1.65,.22,1.1,0,0,cp,.22+.58*eventScene)
        box(0,.05,.35,.46,.82,.46,0,0,ca,.32+.62*eventScene)
        const beaconScale=1+Math.sin(elapsed*2.2)*.12*eventScene
        box(0,1.02,.35,.62*beaconScale,.12,.62*beaconScale,elapsed*.35,0,ca,.30+.65*eventScene)
        drawLine(ringBuf,ringSteps,mul(t(0,.42,.35),mul(ry(-elapsed*.3),rx(.78))),projection,view,cb,.20+.62*eventScene)

        // Cred: stacked spendable coins and a vault-like center.
        for(let i=0;i<4;i++){
          box(2.15,-.55+i*.16,-.72,.72,.055,.72,elapsed*.12,0,ca,.20+.17*credScene)
        }
        box(2.15,.12,-.72,.92,.62,.92,elapsed*.08,0,cp,.24+.62*credScene)
        box(2.15,.64,-.72,.48,.08,.48,elapsed*.22,0,ca,.26+.68*credScene)

        // The CUBE stays as the universal home marker, breathing faster for the active scene.
        const centerPulse=Math.max(bookScene,requestScene,eventScene,credScene)
        const universalScale=1.0+centerPulse*.16+Math.sin(elapsed*1.15)*.03
        box(0,.15,.55,1.0*universalScale,1.0*universalScale,1.0*universalScale,.38,Math.sin(elapsed*.55)*.11,ca,.78+.22*centerPulse)

        drawParticles(particleBuf,particleCount,projection,view)

        raf=requestAnimationFrame(render)
      }

      const resize=()=>{canvas.style.width='100%';canvas.style.height='100%'}
      ro=new ResizeObserver(resize);ro.observe(hostEl);resize()
      raf=requestAnimationFrame(render)

      return()=>{}
    }catch(error){console.error('CUBE native WebGL scene failed',error);if(!stopped)setFailed(true)}
    return()=>{stopped=true;cancelAnimationFrame(raf);ro?.disconnect()}
  },[accent,accent2,primary,onChapterChange])

  return <div ref={host} className="cube-world-scene" onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp}>
    {failed&&<div className="cube-world-fallback"><span>Campus in motion</span><strong>Resources · Requests · Events · Cred</strong></div>}
    <div className="cube-world-label cube-world-label-a"><span>01</span>STUDY WORLD</div>
    <div className="cube-world-label cube-world-label-b"><span>02</span>HELP WORLD</div>
    <div className="cube-world-label cube-world-label-c"><span>03</span>EVENT WORLD</div>
  </div>
}
