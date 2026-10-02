'use client'

import type { PointerEvent as ReactPointerEvent } from 'react'
import { useEffect, useRef, useState } from 'react'

type Props = { accent:string; accent2:string; primary:string }

type Vec3=[number,number,number]

const mat4Identity=():number[]=>[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]
const mat4Multiply=(a:number[],b:number[])=>{const o=new Array(16).fill(0);for(let r=0;r<4;r++)for(let c=0;c<4;c++)for(let k=0;k<4;k++)o[c+r*4]+=a[k+r*4]*b[c+k*4];return o}
const translate=(x:number,y:number,z:number)=>[1,0,0,0,0,1,0,0,0,0,1,0,x,y,z,1]
const scale=(x:number,y:number,z:number)=>[x,0,0,0,0,y,0,0,0,0,z,0,0,0,0,1]
const rotX=(a:number)=>{const c=Math.cos(a),s=Math.sin(a);return[1,0,0,0,0,c,s,0,0,-s,c,0,0,0,0,1]}
const rotY=(a:number)=>{const c=Math.cos(a),s=Math.sin(a);return[c,0,-s,0,0,1,0,0,s,0,c,0,0,0,0,1]}
const rotZ=(a:number)=>{const c=Math.cos(a),s=Math.sin(a);return[c,s,0,0,-s,c,0,0,0,0,1,0,0,0,0,1]}
const perspective=(fovy:number,aspect:number,near:number,far:number)=>{const f=1/Math.tan(fovy/2),nf=1/(near-far);return[f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*nf,-1,0,0,(2*far*near)*nf,0]}
const normalize=(v:Vec3)=>{const l=Math.hypot(v[0],v[1],v[2])||1;return[v[0]/l,v[1]/l,v[2]/l] as Vec3}
const cross=(a:Vec3,b:Vec3):Vec3=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]
const sub=(a:Vec3,b:Vec3):Vec3=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]]
const dot=(a:Vec3,b:Vec3)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2]
const lookAt=(eye:Vec3,target:Vec3,up:Vec3)=>{const z=normalize(sub(eye,target)),x=normalize(cross(up,z)),y=cross(z,x);return[x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1]}

const cubeVertices=new Float32Array([
 -1,-1,-1, 1,-1,-1, 1,1,-1, -1,1,-1,
 -1,-1,1, 1,-1,1, 1,1,1, -1,1,1,
])
const cubeIndices=new Uint16Array([
 0,1,2,0,2,3, 4,6,5,4,7,6, 0,4,5,0,5,1,
 3,2,6,3,6,7, 0,3,7,0,7,4, 1,5,6,1,6,2,
])
const floorVertices=new Float32Array([-8,-1.5,-6,8,-1.5,-6,8,-1.5,6,-8,-1.5,6])
const floorIndices=new Uint16Array([0,1,2,0,2,3])

function hexToRgb(hex:string){const h=hex.replace('#','');return[parseInt(h.slice(0,2),16)/255,parseInt(h.slice(2,4),16)/255,parseInt(h.slice(4,6),16)/255]}
function program(gl:WebGLRenderingContext,vsSource:string,fsSource:string){const compile=(type:number,src:string)=>{const s=gl.createShader(type)!;gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s)||'shader error');return s};const vs=compile(gl.VERTEX_SHADER,vsSource),fs=compile(gl.FRAGMENT_SHADER,fsSource),p=gl.createProgram()!;gl.attachShader(p,vs);gl.attachShader(p,fs);gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p)||'program error');gl.deleteShader(vs);gl.deleteShader(fs);return p}

export function CubeWorldScene({accent,accent2,primary}:Props){
  const host=useRef<HTMLDivElement>(null)
  const [failed,setFailed]=useState(false)
  const drag=useRef({x:0,y:0,down:false,sx:0,sy:0,rx:0,ry:0})
  const onPointerDown=(e:ReactPointerEvent<HTMLDivElement>)=>{drag.current={...drag.current,down:true,sx:e.clientX,sy:e.clientY}}
  const onPointerMove=(e:ReactPointerEvent<HTMLDivElement>)=>{if(!drag.current.down)return;drag.current.ry+=(e.clientX-drag.current.sx)*.004;drag.current.rx+=(e.clientY-drag.current.sy)*.003;drag.current.sx=e.clientX;drag.current.sy=e.clientY}
  const onPointerUp=()=>{drag.current.down=false}

  useEffect(()=>{
    const hostEl=host.current
    if(!hostEl) return
    let disposed=false
    let raf=0
    let resizeObs:ResizeObserver|undefined
    try{
      const canvas=document.createElement('canvas')
      canvas.setAttribute('aria-hidden','true')
      hostEl.prepend(canvas)
      const gl=canvas.getContext('webgl',{antialias:true,alpha:true,powerPreference:'high-performance'})
      if(!gl) throw new Error('WebGL unavailable')

      const vs=`
        attribute vec3 aPosition;
        uniform mat4 uProjection,uView,uModel;
        void main(){gl_Position=uProjection*uView*uModel*vec4(aPosition,1.0);}
      `
      const fs=`
        precision mediump float;
        uniform vec3 uColor;
        uniform float uAlpha;
        void main(){gl_FragColor=vec4(uColor,uAlpha);}
      `
      const prog=program(gl,vs,fs)
      gl.useProgram(prog)
      const posLoc=gl.getAttribLocation(prog,'aPosition')
      const projectionLoc=gl.getUniformLocation(prog,'uProjection')
      const viewLoc=gl.getUniformLocation(prog,'uView')
      const modelLoc=gl.getUniformLocation(prog,'uModel')
      const colorLoc=gl.getUniformLocation(prog,'uColor')
      const alphaLoc=gl.getUniformLocation(prog,'uAlpha')

      const cubeBuf=gl.createBuffer()!,cubeIndex=gl.createBuffer()!,floorBuf=gl.createBuffer()!,floorIndex=gl.createBuffer()!
      gl.bindBuffer(gl.ARRAY_BUFFER,cubeBuf);gl.bufferData(gl.ARRAY_BUFFER,cubeVertices,gl.STATIC_DRAW)
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,cubeIndex);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,cubeIndices,gl.STATIC_DRAW)
      gl.bindBuffer(gl.ARRAY_BUFFER,floorBuf);gl.bufferData(gl.ARRAY_BUFFER,floorVertices,gl.STATIC_DRAW)
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,floorIndex);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,floorIndices,gl.STATIC_DRAW)

      const rgbA=hexToRgb(accent),rgbB=hexToRgb(accent2),rgbP=hexToRgb(primary)
      const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const start=performance.now()

      const drawMesh=(vertexBuffer:WebGLBuffer,indexBuffer:WebGLBuffer,count:number,model:number[],color:number[],alpha=1,mode=gl.TRIANGLES)=>{
        gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer)
        gl.enableVertexAttribArray(posLoc)
        gl.vertexAttribPointer(posLoc,3,gl.FLOAT,false,0,0)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer)
        gl.uniformMatrix4fv(projectionLoc,false,new Float32Array(projection))
        gl.uniformMatrix4fv(viewLoc,false,new Float32Array(view))
        gl.uniformMatrix4fv(modelLoc,false,new Float32Array(model))
        gl.uniform3fv(colorLoc,new Float32Array(color))
        gl.uniform1f(alphaLoc,alpha)
        gl.drawElements(mode,count,gl.UNSIGNED_SHORT,0)
      }

      const render=(time:number)=>{
        if(disposed) return
        const t=(time-start)/1000
        const rect=hostEl.getBoundingClientRect()
        const dpr=Math.min(window.devicePixelRatio||1,1.25)
        const w=Math.max(1,Math.floor(rect.width*dpr)),h=Math.max(1,Math.floor(rect.height*dpr))
        if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h)}
        gl.enable(gl.DEPTH_TEST)
        gl.enable(gl.BLEND)
        gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA)
        gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT)

        const progress=Math.max(0,Math.min(1,(window.innerHeight*.75-rect.top)/(window.innerHeight+rect.height)))
        const autoY=reduced?0:(t*.1+progress*.9)
        const pointerY=reduced?0:drag.current.ry
        const pointerX=reduced?0:drag.current.rx
        const projection=perspective(.64,w/h,.1,40)
        const eye:[number,number,number]=[Math.sin(autoY+pointerY)*8,3.2-Math.min(.7,progress*.7)+Math.sin(t*.32)*.08,Math.cos(autoY+pointerY)*8]
        const target:[number,number,number]=[0,0,0]
        const view=lookAt(eye,target,[0,1,0])

        drawMesh(floorBuf,floorIndex,6,mat4Identity(),[...rgbB].map(v=>v*.42),.28)

        const drawBox=(x:number,y:number,z:number,sx:number,sy:number,sz:number,ry:number,rx:number,color:number[],alpha=1)=>{
          let m=translate(x,y,z)
          m=mat4Multiply(m,rotY(ry));m=mat4Multiply(m,rotX(rx));m=mat4Multiply(m,scale(sx,sy,sz))
          drawMesh(cubeBuf,cubeIndex,36,m,color,alpha)
        }

        drawBox(-3.1,-.1,0,1.05,1.35,.82,0,0,rgbP,.92)
        drawBox(-1.3,-.45,-.55,.82,.88,.72,.18,0,rgbB,.72)
        drawBox(1.45,-.22,-.35,1.05,1.12,.82,-.14,0,rgbP,.8)
        drawBox(3.05,-.48,.1,.78,.76,.68,.28,0,rgbB,.62)

        const float= reduced?0:Math.sin(t*1.1)*.18
        drawBox(0,float,.55,1.05,1.05,1.05,.35,Math.sin(t*.55)*.12,rgbA,1)
        drawBox(-3.25,1.25+float*.7,1.25,.75,.09,1.02,-.35,.18,rgbA,.86)
        drawBox(3.15,1.35+Math.sin(t*1.35)*.16,.72,.62,.12,.62,Math.sin(t*.6),.2,rgbB,.9)
        drawBox(2.55,.1,-1.55,.55,1.0,.55,Math.sin(t*.8),0,rgbP,.74)

        const ringColor=rgbB
        gl.bindBuffer(gl.ARRAY_BUFFER,cubeBuf)
        const ringSteps=64
        const ringData=new Float32Array(ringSteps*3)
        for(let i=0;i<ringSteps;i++){const a=i/ringSteps*Math.PI*2;ringData[i*3]=Math.cos(a)*2.65;ringData[i*3+1]=-.05;ringData[i*3+2]=Math.sin(a)*2.65}
        gl.bufferData(gl.ARRAY_BUFFER,ringData,gl.DYNAMIC_DRAW)
        gl.enableVertexAttribArray(posLoc);gl.vertexAttribPointer(posLoc,3,gl.FLOAT,false,0,0)
        gl.uniformMatrix4fv(projectionLoc,false,new Float32Array(projection))
        gl.uniformMatrix4fv(viewLoc,false,new Float32Array(view))
        let rm=mat4Multiply(rotY(t*.18),rotX(.5))
        gl.uniformMatrix4fv(modelLoc,false,new Float32Array(rm))
        gl.uniform3fv(colorLoc,new Float32Array(ringColor))
        gl.uniform1f(alphaLoc,.66)
        gl.drawArrays(gl.LINE_LOOP,0,ringSteps)

        gl.deleteBuffer(null as unknown as WebGLBuffer)
        raf=requestAnimationFrame(render)
      }

      const onResize=()=>{const rect=hostEl.getBoundingClientRect();if(rect.width&&rect.height){canvas.style.width='100%';canvas.style.height='100%'}}
      resizeObs=new ResizeObserver(onResize);resizeObs.observe(hostEl)
      onResize()
      raf=requestAnimationFrame(render)

      return()=>{}
    }catch(error){console.error('Native WebGL scene failed',error);setFailed(true)}
    return()=>{disposed=true;cancelAnimationFrame(raf);resizeObs?.disconnect()}
  },[accent,accent2,primary])

  return <div ref={host} className="cube-world-scene" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
    {failed&&<div className="cube-world-fallback"><span>Campus in motion</span><strong>Resources · Requests · Events · Cred</strong></div>}
    <div className="cube-world-label cube-world-label-a"><span>01</span>RESOURCES</div>
    <div className="cube-world-label cube-world-label-b"><span>02</span>REQUESTS</div>
    <div className="cube-world-label cube-world-label-c"><span>03</span>EVENTS</div>
  </div>
}
