'use client'

import type { FormEvent, ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Building2, CalendarDays, Check, FileText, LockKeyhole, LogIn, ShieldCheck, Sparkles, UploadCloud, UserRound, Users, X } from 'lucide-react'
import { cubeApi } from '@/lib/cube-api'

export type CubeRole = 'STUDENT' | 'CLUB' | 'ADMIN'
export type CubeSession = { id:string; name:string; role:CubeRole; clubName?:string }

const cn=(...parts:Array<string|false|undefined|null>)=>parts.filter(Boolean).join(' ')

async function hash(file:File){
  const buffer=await file.arrayBuffer()
  const digest=await crypto.subtle.digest('SHA-256',buffer)
  return Array.from(new Uint8Array(digest)).map((b)=>b.toString(16).padStart(2,'0')).join('')
}

export function CubeLogin({onLogin}:{onLogin:(session:CubeSession)=>Promise<void>}) {
  const [mode,setMode]=useState<'student'|'club'|'admin'>('student')
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [club,setClub]=useState('')
  const [adminCode,setAdminCode]=useState('')
  const [busy,setBusy]=useState(false)
  const [error,setError]=useState('')

  const submit=async(e:FormEvent)=>{
    e.preventDefault()
    setError('')
    if(mode==='student' && (!name.trim()||!email.includes('@'))) return setError('Enter your name and college email.')
    if(mode==='club' && (!club.trim()||!email.includes('@'))) return setError('Enter the club name and official club email.')
    if(mode==='admin' && adminCode!=='CUBE-ADMIN-DEMO') return setError('Invalid demo admin code.')

    const id=mode==='student'
      ? `student-${email.trim().toLowerCase().replace(/[^a-z0-9]+/g,'-')}`
      : mode==='club'
        ? `club-${email.trim().toLowerCase().replace(/[^a-z0-9]+/g,'-')}`
        : 'true-admin'

    setBusy(true)
    try {
      await onLogin({
        id,
        name:mode==='student'?name.trim():mode==='club'?club.trim():'CUBE Admin',
        role:mode==='student'?'STUDENT':mode==='club'?'CLUB':'ADMIN',
        clubName:mode==='club'?club.trim():undefined,
      })
    } catch {
      setError('Login could not be completed.')
    } finally { setBusy(false) }
  }

  return <div className="cube-auth-screen">
    <div className="cube-auth-orbit"><span/><span/><span/></div>
    <motion.div className="cube-auth-card" initial={{opacity:0,y:20,scale:.97}} animate={{opacity:1,y:0,scale:1}} transition={{duration:.5}}>
      <div className="cube-auth-brand"><span className="cube-logo">C</span><div><strong>CampusHub</strong><small>one campus. different worlds.</small></div></div>
      <div className="cube-auth-heading"><span className="cube-kicker">Welcome in</span><h1>Choose your<br/><em>campus identity.</em></h1><p>Students, clubs and campus admins get different spaces built around what they actually need.</p></div>
      <div className="cube-role-switch">
        <button className={mode==='student'?'is-active':''} onClick={()=>setMode('student')}><UserRound size={15}/>Student</button>
        <button className={mode==='club'?'is-active':''} onClick={()=>setMode('club')}><Users size={15}/>Club</button>
        <button className={mode==='admin'?'is-active':''} onClick={()=>setMode('admin')}><ShieldCheck size={15}/>Admin</button>
      </div>
      <form className="cube-form" onSubmit={submit}>
        {mode==='student' && <>
          <label>Your name<input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Atharv" /></label>
          <label>College email<input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="you@college.edu" /></label>
          <div className="cube-auth-note"><Sparkles size={16}/><span>New student accounts unlock the full app after <strong>2 valid, unique PDFs</strong>.</span></div>
        </>}
        {mode==='club' && <>
          <label>Club name<input value={club} onChange={e=>setClub(e.target.value)} placeholder="e.g. Coding Club LNCT" /></label>
          <label>Official club email<input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="club@college.edu" /></label>
          <div className="cube-auth-note"><CalendarDays size={16}/><span>Club accounts get <strong>Club Studio</strong>. Events are published only after admin approval.</span></div>
        </>}
        {mode==='admin' && <>
          <label>Demo admin key<input value={adminCode} onChange={e=>setAdminCode(e.target.value)} placeholder="CUBE-ADMIN-DEMO" /></label>
          <div className="cube-auth-note"><LockKeyhole size={16}/><span>Admin mode is a development-only demonstration. Production auth will use real staff credentials and role claims.</span></div>
        </>}
        {error && <div className="cube-form-error"><X size={14}/>{error}</div>}
        <button className="cube-primary-cta cube-auth-submit" disabled={busy}>{busy?'Opening…':'Enter CampusHub'} <LogIn size={16}/></button>
      </form>
      <small className="cube-auth-footer">RGPV · LNCT · CUBE</small>
    </motion.div>
  </div>
}

export function PdfUnlockScreen({session,count,onCountChange,onLogout}:{session:CubeSession;count:number;onCountChange:(count:number)=>void;onLogout:()=>void}) {
  const [busy,setBusy]=useState(false)
  const [message,setMessage]=useState('')
  const [hashes,setHashes]=useState<string[]>([])
  const [title,setTitle]=useState('')
  const [subject,setSubject]=useState('')

  const upload=async(e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    setMessage('')
    const input=e.currentTarget.elements.namedItem('file') as HTMLInputElement
    const file=input.files?.[0]
    if(!file) return setMessage('Choose a PDF.')
    if(file.type!=='application/pdf') return setMessage('Only PDF files count.')
    if(file.size>10*1024*1024) return setMessage('PDF must be 10 MB or smaller.')
    if(!title.trim()||!subject.trim()) return setMessage('Add a title and subject.')
    setBusy(true)
    try {
      const fileHash=await hash(file)
      if(hashes.includes(fileHash)) throw new Error('You already selected that exact PDF.')
      const result=await cubeApi.user(session.id).resources.uploadPdf(file,{title:title.trim(),subject:subject.trim(),tag:'Notes',teacher:'Optional',setName:'A'})
      setHashes((prev)=>[...prev,fileHash])
      onCountChange(Math.min(2,count+1))
      setTitle('')
      setSubject('')
      input.value=''
      setMessage(result?'Accepted. This upload counts toward your unlock.':'Accepted.')
    } catch(error) {
      setMessage(error instanceof Error?error.message:'Upload failed. Try another PDF.')
    } finally { setBusy(false) }
  }

  return <div className="cube-auth-screen cube-unlock-screen">
    <motion.div className="cube-unlock-card" initial={{opacity:0,y:24}} animate={{opacity:1,y:0}}>
      <div className="cube-unlock-top"><div><span className="cube-kicker">Step 1 of 1</span><h1>Unlock the campus.</h1><p>Share two useful, unique PDFs. Invalid, duplicate or rejected files do not count.</p></div><button className="cube-mini-close" onClick={onLogout} aria-label="Log out"><X size={18}/></button></div>
      <div className="cube-unlock-progress"><div><strong>{count}/2</strong><span>valid uploads</span></div><div className="cube-progress-track"><span style={{width:`${Math.min(count,2)*50}%`}}/></div></div>
      <div className="cube-upload-slots"><div className={cn('cube-upload-slot',count>=1&&'is-done')}><span>{count>=1?<Check size={22}/>:<FileText size={22}/>}</span><div><strong>{count>=1?'PDF one accepted':'First PDF'}</strong><small>{count>=1?'Unique and valid':'Notes, PYQ, assignment or practical'}</small></div></div><div className={cn('cube-upload-slot',count>=2&&'is-done')}><span>{count>=2?<Check size={22}/>:<FileText size={22}/>}</span><div><strong>{count>=2?'PDF two accepted':'Second PDF'}</strong><small>{count>=2?'Unique and valid':'A different useful resource'}</small></div></div></div>
      {count<2 ? <form className="cube-form" onSubmit={upload}><label>PDF<input name="file" type="file" accept="application/pdf,.pdf" /></label><label>Resource title<input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. OOP Unit 2 notes"/></label><label>Subject<input value={subject} onChange={e=>setSubject(e.target.value)} placeholder="e.g. Java OOP"/></label><div className="cube-upload-drop"><UploadCloud size={28}/><strong>SHA-256 duplicate check</strong><small>Only an accepted, unique PDF increments the counter.</small></div>{message&&<div className="cube-form-error"><X size={14}/>{message}</div>}<button className="cube-primary-cta" disabled={busy}>{busy?'Checking PDF…':'Upload & count it'} <ArrowUpRight size={16}/></button></form> : <motion.div className="cube-unlock-success" initial={{scale:.96,opacity:0}} animate={{scale:1,opacity:1}}><div><Check size={27}/></div><h2>Campus unlocked.</h2><p>Your academic contribution gate is complete. Welcome to the full CUBE experience.</p><button className="cube-primary-cta" onClick={()=>window.location.reload()}>Enter CUBE <ArrowUpRight size={16}/></button></motion.div>}
    </motion.div>
  </div>
}

export function ClubView({session,onLogout,setNotice}:{session:CubeSession;onLogout:()=>void;setNotice:(v:string)=>void}) {
  const [clubName,setClubName]=useState(session.clubName||'')
  const [status,setStatus]=useState('NOT_REGISTERED')
  const [eventTitle,setEventTitle]=useState('')
  const [kind,setKind]=useState('Hackathon')
  const [venue,setVenue]=useState('')
  const [startsAt,setStartsAt]=useState('')
  const [busy,setBusy]=useState(false)

  useEffect(() => {
    void cubeApi.user(session.id).clubs.me().then((club) => {
      if (club) {
        setClubName(club.name)
        setStatus(club.status)
      }
    }).catch(() => {})
  }, [session.id])

  const register=async(e:FormEvent)=>{
    e.preventDefault();setBusy(true)
    try{const club=await cubeApi.user(session.id).clubs.register(clubName);setStatus(club.status);setNotice(club.status==='APPROVED'?'Club approved':'Club submitted · waiting for admin')}catch(error){setNotice(error instanceof Error?error.message:'Club registration failed')}finally{setBusy(false)}
  }
  const submitEvent=async(e:FormEvent)=>{
    e.preventDefault();setBusy(true)
    try{await cubeApi.user(session.id).clubs.submitEvent({title:eventTitle,kind,venue,startsAt:new Date(startsAt).toISOString()});setNotice('Event submitted · admin approval required');setEventTitle('');setVenue('');setStartsAt('')}catch(error){setNotice(error instanceof Error?error.message:'Event could not be submitted')}finally{setBusy(false)}
  }

  return <div className="cube-page"><div className="cube-page-head"><div><PageEyebrow label="Club Studio"/><h1>Make something happen.</h1><p>Club identity, event submissions and approval state live here.</p></div><button className="cube-secondary-cta" onClick={onLogout}>Log out</button></div>
    <div className="cube-role-hero club-role"><div className="cube-role-icon"><Users size={26}/></div><div><span className="cube-kicker">Club account</span><h2>{clubName||'Your club'}</h2><p>Status: <strong>{status}</strong></p></div><span className="cube-role-badge"><Building2 size={14}/> Clubs</span></div>
    {status==='NOT_REGISTERED' || status==='REJECTED' ? <form className="cube-large-card cube-form" onSubmit={register}><label>Club name<input value={clubName} onChange={e=>setClubName(e.target.value)} placeholder="Coding Club LNCT"/></label><div className="cube-form-note"><ShieldCheck size={17}/><span>Admin approval is required once per club. After approval, your events can enter moderation.</span></div><button className="cube-primary-cta" disabled={busy}>Submit club for review <ArrowUpRight size={15}/></button></form> : null}
    <div className="cube-large-card"><SectionTitle icon={<CalendarDays size={17}/>} title="Submit an event"/><form className="cube-form" onSubmit={submitEvent}><label>Event name<input value={eventTitle} onChange={e=>setEventTitle(e.target.value)} placeholder="HackSprint 5.0"/></label><label>Category<select value={kind} onChange={e=>setKind(e.target.value)}><option>Hackathon</option><option>Workshop</option><option>Coding contest</option><option>Cultural</option><option>Sports</option><option>Seminar</option><option>Club activity</option></select></label><label>Venue<input value={venue} onChange={e=>setVenue(e.target.value)} placeholder="Innovation Lab"/></label><label>Date & time<input value={startsAt} onChange={e=>setStartsAt(e.target.value)} type="datetime-local"/></label>{status!=='APPROVED'&&<div className="cube-form-note"><LockKeyhole size={17}/><span>Event submission unlocks after <strong>club approval</strong>.</span></div>}<button className="cube-primary-cta" disabled={busy||status!=='APPROVED'}>{busy?'Submitting…':'Submit for admin approval'} <ArrowUpRight size={15}/></button></form></div>
  </div>
}

export function AdminView({setNotice,onLogout}:{setNotice:(v:string)=>void;onLogout:()=>void}) {
  const [clubs,setClubs]=useState<any[]>([])
  const [events,setEvents]=useState<any[]>([])
  const [disputes,setDisputes]=useState<any[]>([])
  const [loading,setLoading]=useState(true)
  const refresh=async()=>{setLoading(true);try{const api=cubeApi.admin('true-admin');const [c,e,r]=await Promise.all([api.pendingClubs(),api.pendingEvents(),api.requests()]);setClubs(c);setEvents(e);setDisputes(r.filter((item:any)=>item.state==='DISPUTED'))}catch{setNotice('Admin API unavailable')}finally{setLoading(false)}}
  useEffect(()=>{void refresh()},[])
  const moderateClub=async(id:number,approve:boolean)=>{try{await cubeApi.admin('true-admin').moderateClub(id,approve);setNotice(approve?'Club approved':'Club rejected');await refresh()}catch{setNotice('Could not moderate club')}}
  const moderateEvent=async(id:number,approve:boolean)=>{try{await cubeApi.admin('true-admin').moderateEvent(id,approve);setNotice(approve?'Event published':'Event rejected');await refresh()}catch{setNotice('Could not moderate event')}}
  const resolveDispute=async(id:number,outcome:'COMPLETED'|'REFUNDED'|'FORFEITED')=>{try{await cubeApi.admin('true-admin').resolveRequest(id,outcome);setNotice(`Dispute resolved · ${outcome}`);await refresh()}catch{setNotice('Could not resolve dispute')}}
  return <div className="cube-page"><div className="cube-page-head"><PageEyebrow label="Admin Control"/><div><h1>Keep the campus healthy.</h1><p>Moderation is human-led. The admin decides what becomes public.</p></div><button className="cube-secondary-cta" onClick={onLogout}>Log out</button></div>
    <div className="cube-admin-banner"><ShieldCheck size={22}/><div><strong>Human moderation</strong><span>Clubs and events stay pending until an admin action changes their state.</span></div><button onClick={()=>void refresh()}>Refresh</button></div>
    <div className="cube-admin-grid"><div className="cube-large-card"><SectionTitle icon={<Users size={17}/>} title={`Pending clubs · ${clubs.length}`}/>{loading?<SkeletonRole/>:clubs.length?clubs.map((club)=><div className="cube-admin-row" key={club.id}><div><strong>{club.name}</strong><small>{club.ownerExternalId}</small></div><div className="cube-action-row"><button className="cube-small-cta" onClick={()=>void moderateClub(club.id,true)}>Approve</button><button className="cube-danger-cta" onClick={()=>void moderateClub(club.id,false)}>Reject</button></div></div>):<EmptyRole text="No clubs waiting for review."/>}</div>
      <div className="cube-large-card"><SectionTitle icon={<CalendarDays size={17}/>} title={`Pending events · ${events.length}`}/>{loading?<SkeletonRole/>:events.length?events.map((event)=><div className="cube-admin-row" key={event.id}><div><strong>{event.title}</strong><small>{event.kind} · {event.venue}</small></div><div className="cube-action-row"><button className="cube-small-cta" onClick={()=>void moderateEvent(event.id,true)}>Publish</button><button className="cube-danger-cta" onClick={()=>void moderateEvent(event.id,false)}>Reject</button></div></div>):<EmptyRole text="No events waiting for review."/>}</div>
      <div className="cube-large-card">
        <SectionTitle icon={<Flag size={17}/>} title={`Disputed requests · ${disputes.length}`}/>
        {loading?<SkeletonRole/>:disputes.length?disputes.map((item:any)=><div className="cube-admin-row" key={item.id}><div><strong>{item.title}</strong><small>{item.bounty} Cred · helper {item.helperExternalId || 'unassigned'}</small></div><div className="cube-action-row"><button className="cube-small-cta" onClick={()=>void resolveDispute(item.id,'COMPLETED')}>Pay helper</button><button className="cube-small-cta" onClick={()=>void resolveDispute(item.id,'REFUNDED')}>Refund</button><button className="cube-danger-cta" onClick={()=>void resolveDispute(item.id,'FORFEITED')}>Forfeit</button></div></div>):<EmptyRole text="No disputes waiting for review."/>}
      </div>
    </div>
  </div>
}

function PageEyebrow({label}:{label:string}){return <span className="cube-kicker">{label}</span>}
function SectionTitle({icon,title}:{icon:ReactNode;title:string}){return <div className="cube-admin-title">{icon}<h2>{title}</h2></div>}
function SkeletonRole(){return <div className="cube-role-skeleton"><span/><span/><span/></div>}
function EmptyRole({text}:{text:string}){return <div className="cube-empty-panel"><Check size={19}/>{text}</div>}
