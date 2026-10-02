'use client'

import type { FormEvent, ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import {
  Archive, ArrowUpRight, Bell, BookOpen, Bookmark, Check, ChevronRight, CircleHelp,
  Clock3, Compass, Download, FileText, Flag, Gift, Heart, Home, MapPin, PackageSearch,
  Plus, Search, Send, Settings2, ShieldCheck, Sparkles, Store, Trophy, UploadCloud,
  UserRound, Users, WalletCards, X, Zap,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { CubeScene } from './cube-scene'
import { cubeApi } from '@/lib/cube-api'
import { AdminView, ClubView, CubeLogin, PdfUnlockScreen } from './cube-roles'
import { CubeWorldScene } from './cube-world-scene'

type Theme = {
  id: string; name: string; label: string; bg: string; surface: string; primary: string;
  secondary: string; accent: string; accent2: string; ink: string
}
type Tab = 'home' | 'resources' | 'requests' | 'cred' | 'profile' | 'club' | 'admin'
type RequestState = 'OPEN' | 'ACCEPTED' | 'DELIVERED' | 'COMPLETED' | 'AUTO_RELEASED' | 'DISPUTED' | 'CANCELLED'
type Modal = 'upload' | 'request' | 'lost' | null
type Role = 'STUDENT' | 'CLUB' | 'ADMIN'
type Session = { id: string; name: string; role: Role; clubName?: string }

const themes: Theme[] = [
  { id: 'emerald', name: 'Emerald & Champagne', label: 'Editorial', bg: '#F7F3E9', surface: '#FFFDF7', primary: '#0C4D42', secondary: '#D9E7DF', accent: '#E9D39B', accent2: '#D49A78', ink: '#173B35' },
  { id: 'lavender', name: 'Lavender & Apricot', label: 'Dreamy', bg: '#F8F4FB', surface: '#FFF9FE', primary: '#5A466B', secondary: '#E6DCF5', accent: '#F4B7A7', accent2: '#B79AE8', ink: '#3D3149' },
  { id: 'ocean', name: 'Ocean & Mint', label: 'Breezy', bg: '#F1FAF8', surface: '#FCFFFE', primary: '#205A63', secondary: '#CDEDE3', accent: '#88D8C2', accent2: '#78BCE7', ink: '#173D43' },
  { id: 'peach', name: 'Peach & Berry', label: 'Playful', bg: '#FFF5F1', surface: '#FFFDFC', primary: '#783E55', secondary: '#F7DAD2', accent: '#F6A98E', accent2: '#D66C94', ink: '#4D2738' },
  { id: 'butter', name: 'Butter & Lilac', label: 'Sunny', bg: '#FFFBEF', surface: '#FFFFFB', primary: '#65522D', secondary: '#EEE4C7', accent: '#F4D971', accent2: '#B59AE7', ink: '#44371F' },
]

const seedResources = [
  { id: 1, title: 'OOP in Java — complete notes', subject: 'Object Oriented Programming', tag: 'Notes', meta: '18 pages', votes: 126, tone: 'lavender', teacher: 'Dr. Mehta', set: 'A', hash: 'seed-oop' },
  { id: 2, title: 'DBMS Normalisation Cheat Sheet', subject: 'Database Management', tag: 'Cheat sheet', meta: '8 pages', votes: 98, tone: 'mint', teacher: 'Prof. Shah', set: 'A', hash: 'seed-dbms' },
  { id: 3, title: 'Data Structures PYQ Pack', subject: 'Data Structures', tag: 'PYQs', meta: '32 pages', votes: 184, tone: 'peach', teacher: 'Dr. Rao', set: 'B', hash: 'seed-dsa' },
  { id: 4, title: 'Computer Networks Practicals', subject: 'Computer Networks', tag: 'Practicals', meta: '14 pages', votes: 72, tone: 'butter', teacher: 'Prof. Khan', set: 'A', hash: 'seed-cn' },
]

const seedRequests = [
  { id: 1, title: 'Print 48 pages near Block B', detail: 'Need it before 5 PM today.', bounty: 20, state: 'OPEN' as RequestState, helper: '', createdByMe: false, deliveredAt: '' },
  { id: 2, title: 'Explain recursion for tomorrow', detail: '30 minute walkthrough, beginner level.', bounty: 16, state: 'DELIVERED' as RequestState, helper: 'Rohan', createdByMe: false, deliveredAt: '2026-10-01T06:00:00.000Z' },
  { id: 3, title: 'Carry a file to the library', detail: 'Small envelope. Pickup after 4 PM.', bounty: 8, state: 'OPEN' as RequestState, helper: '', createdByMe: false, deliveredAt: '' },
]

const seedEvents = [
  { id: 1, title: 'HackSprint 4.0', kind: 'Hackathon', date: '12 Oct', place: 'Innovation Lab', color: 'pink', registered: false },
  { id: 2, title: 'Java After Hours', kind: 'Workshop', date: '15 Oct', place: 'Seminar Hall', color: 'mint', registered: false },
  { id: 3, title: 'Cultural Open Mic', kind: 'Cultural', date: '18 Oct', place: 'Amphitheatre', color: 'yellow', registered: false },
]

const seedLost = [
  { id: 1, title: 'Black wallet', place: 'Library · 2nd floor', type: 'FOUND', status: 'OPEN', description: 'Black leather wallet with a small silver logo.' },
  { id: 2, title: 'Blue calculator', place: 'Block C · Room 204', type: 'LOST', status: 'OPEN', description: 'Casio scientific calculator, blue body.' },
]

const offers = [
  { name: 'PrintMint', offer: '10% off on bulk printing', meta: '0.8 km · Open until 8 PM', icon: '▤' },
  { name: 'ByteCafe', offer: 'Study combo under ₹99', meta: '1.2 km · Student special', icon: '✦' },
]

const nav = [
  { id: 'home' as Tab, label: 'Home', icon: Home },
  { id: 'resources' as Tab, label: 'Resources', icon: BookOpen },
  { id: 'requests' as Tab, label: 'Requests', icon: Send },
  { id: 'cred' as Tab, label: 'Cred', icon: WalletCards },
  { id: 'profile' as Tab, label: 'Profile', icon: UserRound },
]

const featureDescription: Record<string, string> = {
  'Academic resources': 'Find notes, assignments, practicals and previous-year papers filtered to your branch, semester and set.',
  'Campus requests': 'Post student-to-student tasks, lock a Cred bounty, deliver work and settle it safely.',
  'Events & clubs': 'Discover hackathons, workshops, competitions, cultural activities and verified campus clubs.',
  'Lost & found': 'Report or discover misplaced items with image-first listings and clear resolution states.',
  'Local offers': 'See useful student-focused offers from printing, food, stationery and repair businesses.',
}

const cn = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(' ')

function useLocalState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key)
      if (raw) setValue(JSON.parse(raw) as T)
    } catch {}
    setHydrated(true)
  }, [key])

  useEffect(() => {
    if (!hydrated) return
    try { window.localStorage.setItem(key, JSON.stringify(value)) } catch {}
  }, [key, value, hydrated])

  return [value, setValue] as const
}

async function sha256(file: File) {
  const buffer = await file.arrayBuffer()
  const digest = await crypto.subtle.digest('SHA-256', buffer)
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

const CUBE_BYPASS_LOGIN = true
const CUBE_DEMO_SESSION: Session = { id: 'demo-atharv', name: 'Atharv', role: 'STUDENT' }

export function CubeExperience() {
  const [session, setSession] = useState<Session | null>(CUBE_BYPASS_LOGIN ? CUBE_DEMO_SESSION : null)
  const [pdfUploads, setPdfUploads] = useState(CUBE_BYPASS_LOGIN ? 2 : 0)

  useEffect(() => {
    if (CUBE_BYPASS_LOGIN) return
    try {
      const raw = window.localStorage.getItem('cube-session')
      if (raw) setSession(JSON.parse(raw) as Session)
    } catch {}
  }, [])

  useEffect(() => {
    if (!session || CUBE_BYPASS_LOGIN) return
    void cubeApi.user(session.id).wallet().then((wallet) => setPdfUploads(wallet.validPdfUploads)).catch(() => {})
  }, [session])

  const login = async (next: Session) => {
    try {
      const wallet = await cubeApi.user(next.id).role(next.role)
      setPdfUploads(wallet.validPdfUploads)
    } catch {}
    setSession(next)
    window.localStorage.setItem('cube-session', JSON.stringify(next))
  }

  const logout = () => {
    if (CUBE_BYPASS_LOGIN) return
    setSession(null)
    setPdfUploads(0)
    window.localStorage.removeItem('cube-session')
  }

  if (!session) return <CubeLogin onLogin={login} />
  if (session.role === 'STUDENT' && pdfUploads < 2) {
    return <PdfUnlockScreen session={session} count={pdfUploads} onCountChange={setPdfUploads} onLogout={logout} />
  }

  return <CubeExperienceCore session={session} pdfUploads={pdfUploads} onPdfUploaded={() => setPdfUploads((value) => value + 1)} onLogout={logout} />
}

function CubeExperienceCore({ session, pdfUploads, onPdfUploaded, onLogout }: {
  session: Session
  pdfUploads: number
  onPdfUploaded: () => void
  onLogout: () => void
}) {
  const [themeId, setThemeId] = useLocalState('cube-theme', 'emerald')
  const [tab, setTab] = useState<Tab>('home')
  const [query, setQuery] = useState('')
  const [saved, setSaved] = useLocalState<number[]>('cube-saved', [1, 2])
  const [liked, setLiked] = useLocalState<number[]>('cube-liked', [])
  const [resources, setResources] = useLocalState('cube-resources', seedResources)
  const [requests, setRequests] = useLocalState('cube-requests', seedRequests)
  const [events, setEvents] = useLocalState('cube-events', seedEvents)
  const [lostItems, setLostItems] = useLocalState('cube-lost', seedLost)
  const [spendable, setSpendable] = useLocalState('cube-spendable', 148)
  const [monthly, setMonthly] = useLocalState('cube-monthly', 72)
  const [conduct] = useState(36)
  const [notifications, setNotifications] = useLocalState('cube-notifications', [
    { id: 1, title: 'Request delivered', text: 'Your recursion help request is waiting for review.', read: false },
    { id: 2, title: '+15 Monthly Cred', text: 'You helped a classmate with a practical.', read: false },
    { id: 3, title: 'New event nearby', text: 'HackSprint 4.0 opened registrations.', read: false },
  ])
  const [notice, setNotice] = useState('')
  const [showThemes, setShowThemes] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null)
  const [modal, setModal] = useState<Modal>(null)
  const [loading, setLoading] = useState(true)

  const theme = themes.find((item) => item.id === themeId) ?? themes[0]
  const unreadCount = notifications.filter((item) => !item.read).length
  const roleNav = session.role === 'CLUB'
    ? [...nav.slice(0, 4), { id: 'club' as Tab, label: 'Club', icon: Users }]
    : session.role === 'ADMIN'
      ? [...nav.slice(0, 4), { id: 'admin' as Tab, label: 'Admin', icon: ShieldCheck }]
      : nav

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--cube-bg', theme.bg)
    root.style.setProperty('--cube-surface', theme.surface)
    root.style.setProperty('--cube-primary', theme.primary)
    root.style.setProperty('--cube-secondary', theme.secondary)
    root.style.setProperty('--cube-accent', theme.accent)
    root.style.setProperty('--cube-accent-2', theme.accent2)
    root.style.setProperty('--cube-ink', theme.ink)
  }, [theme])

  useEffect(() => {
    const hydrateFromApi = async () => {
      if (!cubeApi.enabled()) {
        setLoading(false)
        return
      }
      try {
        const apiClient = cubeApi.user(session.id)
        const [remoteResources, remoteRequests, remoteWallet, remoteEvents] = await Promise.all([
          apiClient.resources.list(),
          apiClient.requests.list(),
          apiClient.wallet(),
          apiClient.events.list(),
        ])
        if (remoteResources.length) {
          setResources(remoteResources.map((r) => ({
            id: r.id, title: r.title, subject: r.subject, tag: r.tag, meta: r.fileName,
            votes: r.votes, tone: 'lavender', teacher: r.teacher || 'Optional', set: r.setName, hash: r.id.toString(),
          })))
        }
        if (remoteRequests.length) {
          setRequests(remoteRequests.map((r) => ({
            id: r.id, title: r.title, detail: r.detail, bounty: r.bounty, state: r.state as RequestState,
            helper: r.helperExternalId === 'demo-atharv' ? 'You' : (r.helperExternalId || ''),
            createdByMe: r.requesterExternalId === 'demo-atharv', deliveredAt: r.deliveredAt || '',
          })))
        }
        setSpendable(remoteWallet.spendable)
        setMonthly(remoteWallet.monthly)
        setPdfUploads(remoteWallet.validPdfUploads)
        if (remoteEvents.length) {
          setEvents(remoteEvents.map((event) => ({
            id: event.id, title: event.title, kind: event.kind,
            date: new Date(event.startsAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short' }),
            place: event.venue, color: 'mint', registered: false,
          })))
        }
      } catch (error) {
        console.error('CUBE API hydration failed', error)
        setNotice('Backend unavailable · using local demo state')
      } finally {
        setLoading(false)
      }
    }
    void hydrateFromApi()
  }, [setResources, setRequests, setSpendable, setMonthly])

  useEffect(() => {
    if (!notice) return
    const id = window.setTimeout(() => setNotice(''), 2600)
    return () => window.clearTimeout(id)
  }, [notice])

  const filteredResources = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return resources
    return resources.filter((item) => [item.title, item.subject, item.tag, item.teacher].some((value) => value.toLowerCase().includes(q)))
  }, [query, resources])

  const syncBackend = async (operation: Promise<unknown>, successMessage?: string) => {
    if (!cubeApi.enabled()) return
    try {
      await operation
      if (successMessage) setNotice(successMessage)
    } catch (error) {
      console.error('CUBE API operation failed', error)
      setNotice('Saved locally · backend sync failed')
    }
  }

  const notify = (title: string, text: string) => {
    setNotifications((prev) => [{ id: Date.now(), title, text, read: false }, ...prev].slice(0, 16))
  }

  const toggleSaved = (id: number) => {
    const already = saved.includes(id)
    setSaved((prev) => already ? prev.filter((item) => item !== id) : [...prev, id])
    setNotice(already ? 'Removed from saved' : 'Saved to your library')
  }

  const toggleLiked = (id: number) => {
    const nextLiked = liked.includes(id) ? liked.filter((item) => item !== id) : [...liked, id]
    setLiked(nextLiked)
    if (!liked.includes(id)) void syncBackend(cubeApi.user(session.id).resources.vote(id))
  }

  const downloadResource = (resource: any) => {
    const blob = new Blob([`CampusHub demo export\\n\\n${resource.title}\\n${resource.subject}\\nSet ${resource.set}\\nHash ${resource.hash}\\n`], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${resource.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.txt`
    link.click()
    URL.revokeObjectURL(url)
    setNotice('Demo export started')
  }

  const acceptRequest = (id: number) => {
    setRequests((prev) => prev.map((request) => request.id === id ? { ...request, state: 'ACCEPTED', helper: 'You' } : request))
    void syncBackend(cubeApi.user(session.id).requests.accept(id))
    notify('Request accepted', 'Cred remains locked until you submit delivery.')
    setNotice('Accepted · Cred stays locked')
  }

  const submitDelivery = (id: number) => {
    const now = new Date().toISOString()
    setRequests((prev) => prev.map((request) => request.id === id ? { ...request, state: 'DELIVERED', deliveredAt: now, helper: 'You' } : request))
    void syncBackend(cubeApi.user(session.id).requests.deliver(id))
    notify('Delivery submitted', 'The requester now has 48 hours to accept or dispute.')
    setNotice('Delivered · 48h auto-release started')
  }

  const settleRequest = (id: number, auto = false) => {
    const request = requests.find((item) => item.id === id)
    if (!request || request.state !== 'DELIVERED' || request.helper === '') return
    const payout = Math.max(request.bounty - 2, 0)
    const helperIsCurrentUser = request.helper === 'You'

    setRequests((prev) => prev.map((item) => item.id === id ? { ...item, state: auto ? 'AUTO_RELEASED' : 'COMPLETED' } : item))

    if (helperIsCurrentUser) {
      setSpendable((value) => value + payout)
      setMonthly((value) => value + 15)
      notify(auto ? 'Cred auto-released' : 'Request completed', `+${payout} Spendable Cred and +15 Monthly Cred.`)
      setNotice(`+${payout} Spendable Cred · +15 Monthly`)
    } else {
      notify(auto ? 'Request auto-released' : 'Request completed', 'The locked Cred has been released to the helper.')
      setNotice(auto ? '48h elapsed · Cred released' : 'Delivery accepted')
    }
  }

  const disputeRequest = (id: number) => {
    setRequests((prev) => prev.map((request) => request.id === id ? { ...request, state: 'DISPUTED' } : request))
    void syncBackend(cubeApi.user(session.id).requests.dispute(id))
    notify('Dispute opened', 'Automatic release is paused while an admin reviews the request.')
    setNotice('Dispute opened · release paused')
  }

  const cancelRequest = (id: number) => {
    const request = requests.find((item) => item.id === id)
    if (!request || request.state !== 'OPEN' || !request.createdByMe) return
    setRequests((prev) => prev.map((item) => item.id === id ? { ...item, state: 'CANCELLED' } : item))
    setSpendable((value) => value + request.bounty)
    void syncBackend(cubeApi.user(session.id).requests.cancel(id))
    notify('Request cancelled', `${request.bounty} Cred returned to your wallet.`)
    setNotice('Request cancelled · Cred refunded')
  }

  useEffect(() => {
    const checkAutoRelease = () => {
      const cutoff = Date.now() - 48 * 60 * 60 * 1000
      requests.forEach((request) => {
        if (request.state === 'DELIVERED' && request.deliveredAt && new Date(request.deliveredAt).getTime() <= cutoff) {
          settleRequest(request.id, true)
        }
      })
    }
    checkAutoRelease()
    const id = window.setInterval(checkAutoRelease, 15000)
    return () => window.clearInterval(id)
  }, [requests])

  const redeem = (cost: number, item: string) => {
    if (spendable < cost) return setNotice('Not enough Spendable Cred')
    setSpendable((value) => value - cost)
    notify('Reward redeemed', `${item} is now active in demo mode.`)
    setNotice(`${item} redeemed`)
  }

  const registerEvent = (id: number) => {
    setEvents((prev) => prev.map((event) => event.id === id ? { ...event, registered: !event.registered } : event))
    const event = events.find((item) => item.id === id)
    setNotice(event?.registered ? 'Registration cancelled' : 'You are registered')
  }

  const resolveLostItem = (id: number) => {
    setLostItems((prev) => prev.map((item) => item.id === id ? { ...item, status: 'RESOLVED' } : item))
    setNotice('Listing marked resolved')
  }

  const markAllRead = () => setNotifications((prev) => prev.map((item) => ({ ...item, read: true })))

  const handleCreateResource = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const file = form.get('file')
    const title = String(form.get('title') || '').trim()
    const subject = String(form.get('subject') || '').trim()
    const teacher = String(form.get('teacher') || 'Optional').trim()
    const tag = String(form.get('tag') || 'Notes')

    if (!(file instanceof File) || file.size === 0) return setNotice('Choose a PDF first')
    if (file.type !== 'application/pdf') return setNotice('Only PDF files are accepted')
    if (file.size > 10 * 1024 * 1024) return setNotice('PDF must be 10 MB or smaller')
    if (!title || !subject) return setNotice('Add a title and subject')

    const hash = await sha256(file)
    if (resources.some((item) => item.hash === hash)) return setNotice('Duplicate PDF detected')

    const next = {
      id: Date.now(),
      title,
      subject,
      tag,
      meta: `${Math.max(1, Math.ceil(file.size / 18000))} pages est.`,
      votes: 0,
      tone: 'lavender',
      teacher,
      set: 'A',
      hash,
    }
    setResources((prev) => [next, ...prev])
    setMonthly((value) => value + 10)
    setSpendable((value) => value + 10)
    if (session.role === 'STUDENT') onPdfUploaded()
    if (cubeApi.enabled()) {
      void syncBackend(cubeApi.user(session.id).resources.uploadPdf(file,{title,subject,tag,teacher,setName:'A'}))
    }
    notify('Resource uploaded', '+10 Monthly Cred and +10 Spendable Cred.')
    setModal(null)
    setNotice('+10 Monthly · +10 Spendable')
  }

  const handleCreateRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const title = String(form.get('title') || '').trim()
    const detail = String(form.get('detail') || '').trim()
    const bounty = Math.max(1, Number(form.get('bounty') || 1))

    if (!title || !detail) return setNotice('Add a title and description')
    if (!Number.isFinite(bounty)) return setNotice('Enter a valid bounty')
    if (bounty > spendable) return setNotice('Not enough Spendable Cred to lock this bounty')

    const next = {
      id: Date.now(),
      title,
      detail,
      bounty,
      state: 'OPEN' as RequestState,
      helper: '',
      createdByMe: true,
      deliveredAt: '',
    }
    setSpendable((value) => value - bounty)
    setRequests((prev) => [next, ...prev])
    void syncBackend(cubeApi.user(session.id).requests.create({ title, detail, bounty }))
    notify('Request posted', `${bounty} Cred is temporarily locked.`)
    setModal(null)
    setNotice(`${bounty} Cred locked · request is live`)
  }

  const handleCreateLost = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const title = String(form.get('title') || '').trim()
    const place = String(form.get('place') || '').trim()
    const type = String(form.get('type') || 'LOST')
    const description = String(form.get('description') || '').trim()

    if (!title || !place) return setNotice('Add an item and location')

    setLostItems((prev) => [{ id: Date.now(), title, place, type, status: 'OPEN', description }, ...prev])
    setModal(null)
    setNotice('Lost & Found listing published')
  }

  return (
    <div className="cube-app-shell">
      <div className="cube-atmosphere" />

      <header className="cube-topbar">
        <button className="cube-brand" onClick={() => setTab('home')} aria-label="CampusHub home">
          <span className="cube-logo">C</span>
          <span><strong>CampusHub</strong><small>your campus, but alive.</small></span>
        </button>
        <div className="cube-top-actions">
          <button className="cube-icon-button" onClick={() => setShowThemes((value) => !value)} aria-label="Change theme"><Sparkles size={18} /></button>
          <button className="cube-icon-button" onClick={() => setShowNotifications((value) => !value)} aria-label="Notifications"><Bell size={18} />{unreadCount > 0 && <span className="cube-notification-dot" />}</button>
        </div>
      </header>

      <AnimatePresence>
        {showThemes && (
          <motion.div className="cube-theme-drawer" initial={{ opacity: 0, y: -12, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -12, scale: .98 }}>
            <div className="cube-drawer-heading"><div><span className="cube-kicker">Visual Lab</span><h3>Pick a mood</h3></div><button className="cube-mini-close" onClick={() => setShowThemes(false)} aria-label="Close"><X size={17}/></button></div>
            <div className="cube-theme-grid">{themes.map((option) => <button key={option.id} className={cn('cube-theme-swatch', option.id === theme.id && 'is-active')} onClick={() => { setThemeId(option.id); setShowThemes(false); setNotice(`${option.name} applied`) }}><span className="cube-swatch-preview"><i style={{ background: option.primary }}/><i style={{ background: option.accent }}/><i style={{ background: option.secondary }}/></span><span><strong>{option.name}</strong><small>{option.label}</small></span>{option.id === theme.id && <Check size={17}/>}</button>)}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNotifications && (
          <motion.div className="cube-notification-panel" initial={{ opacity: 0, y: -10, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: .98 }}>
            <div className="cube-drawer-heading"><div><span className="cube-kicker">Inbox</span><h3>Little updates</h3></div><button className="cube-mini-close" onClick={() => setShowNotifications(false)} aria-label="Close"><X size={17}/></button></div>
            <div className="cube-notification-actions"><button onClick={markAllRead}>Mark all read</button></div>
            {notifications.length === 0 ? <EmptyState icon={<Bell size={20}/>} title="Nothing new" text="Your campus inbox is clear."/> : notifications.map((item) => <button key={item.id} className={cn('cube-notice-item','cube-notice-button',!item.read&&'is-unread')} onClick={() => setNotifications((prev) => prev.map((noticeItem) => noticeItem.id === item.id ? { ...noticeItem, read: true } : noticeItem))}><span className="cube-notice-icon mint">{item.read ? <Check size={15}/> : <Sparkles size={15}/>}</span><div><strong>{item.title}</strong><small>{item.text}</small></div></button>)}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="cube-content">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .34, ease: [0.22,1,.36,1] }}>
            {tab === 'home' && <HomeView loading={loading} theme={theme} spendable={spendable} monthly={monthly} query={query} setQuery={setQuery} resources={filteredResources.slice(0,3)} saved={saved} liked={liked} toggleSaved={toggleSaved} toggleLiked={toggleLiked} downloadResource={downloadResource} onOpenFeature={setSelectedFeature} onSeeResources={() => setTab('resources')} onJump={setTab} events={events} registerEvent={registerEvent} lostItems={lostItems} resolveLostItem={resolveLostItem} setModal={setModal} offers={offers} setNotice={setNotice}/>}
            {tab === 'resources' && <ResourcesView loading={loading} query={query} setQuery={setQuery} resources={filteredResources} saved={saved} liked={liked} toggleSaved={toggleSaved} toggleLiked={toggleLiked} downloadResource={downloadResource} setModal={setModal}/>}
            {tab === 'requests' && <RequestsView requests={requests} onAccept={acceptRequest} onDeliver={submitDelivery} onComplete={settleRequest} onDispute={disputeRequest} onCancel={cancelRequest} setModal={setModal}/>}
            {tab === 'cred' && <CredView spendable={spendable} monthly={monthly} conduct={conduct} redeem={redeem}/>}
            {tab === 'profile' && <ProfileView spendable={spendable} monthly={monthly} conduct={conduct} resourcesCount={resources.length} requestCount={requests.length} theme={theme} onTheme={() => setShowThemes(true)} onLogout={onLogout} pdfUploads={pdfUploads}/>}
            {tab === 'club' && <ClubView session={session} events={events} onLogout={onLogout} setNotice={setNotice} />}
            {tab === 'admin' && <AdminView setNotice={setNotice} onLogout={onLogout} />}
          </motion.div>
        </AnimatePresence>
      </main>

      <nav className="cube-bottom-nav" aria-label="Primary">
        {roleNav.map((item) => { const Icon = item.icon; return <button key={item.id} className={cn('cube-nav-item', tab === item.id && 'is-active')} onClick={() => setTab(item.id)} aria-current={tab === item.id ? 'page' : undefined}><span className="cube-nav-icon"><Icon size={19}/></span><span>{item.label}</span></button> })}
      </nav>

      <AnimatePresence>
        {selectedFeature && <FeatureSheet title={selectedFeature} description={featureDescription[selectedFeature]} onClose={() => setSelectedFeature(null)}/>}
        {modal === 'upload' && <Sheet title="Share a resource" subtitle="Upload useful material for your exact semester." onClose={() => setModal(null)}><form className="cube-form" onSubmit={handleCreateResource}><label>PDF file<input name="file" type="file" accept="application/pdf,.pdf" required /></label><label>Resource title<input name="title" placeholder="e.g. OOP Unit 3 notes" required /></label><label>Subject<input name="subject" placeholder="e.g. Object Oriented Programming" required /></label><label>Teacher <span>optional</span><input name="teacher" placeholder="Teacher name" /></label><label>Type<select name="tag" defaultValue="Notes"><option>Notes</option><option>Assignments</option><option>Practicals</option><option>PYQs</option><option>Cheat sheet</option></select></label><div className="cube-upload-drop"><UploadCloud size={26}/><strong>PDF validation is live</strong><small>Type, size and SHA-256 duplicate checks run in the browser.</small></div><button className="cube-primary-cta" type="submit">Publish resource <ArrowUpRight size={16}/></button></form></Sheet>}
        {modal === 'request' && <Sheet title="Create a campus request" subtitle="Set a Cred bounty. CampusHub locks it until the request settles." onClose={() => setModal(null)}><form className="cube-form" onSubmit={handleCreateRequest}><label>What do you need?<input name="title" placeholder="e.g. Print 40 pages near Block B" required /></label><label>Description<textarea name="detail" placeholder="Add the details someone needs to finish it." required /></label><label>Bounty<input name="bounty" type="number" min="1" max={spendable} defaultValue="20" /></label><div className="cube-form-note"><ShieldCheck size={17}/><span>Available balance: <strong>{spendable} Cred</strong>. The bounty is locked on publish.</span></div><button className="cube-primary-cta" type="submit">Lock Cred & publish <Send size={16}/></button></form></Sheet>}
        {modal === 'lost' && <Sheet title="Post Lost & Found" subtitle="A clearer listing makes campus mysteries easier to solve." onClose={() => setModal(null)}><form className="cube-form" onSubmit={handleCreateLost}><label>Item<input name="title" placeholder="e.g. Black wallet" required /></label><label>Location<input name="place" placeholder="e.g. Library, 2nd floor" required /></label><label>Type<select name="type" defaultValue="LOST"><option>LOST</option><option>FOUND</option></select></label><label>Description<textarea name="description" placeholder="Color, markings, approximate time..." /></label><button className="cube-primary-cta" type="submit">Publish listing <ArrowUpRight size={16}/></button></form></Sheet>}
      </AnimatePresence>

      <AnimatePresence>{notice && <motion.div className="cube-toast" initial={{opacity:0,y:14,scale:.96}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:8,scale:.98}}><Check size={16}/>{notice}</motion.div>}</AnimatePresence>
    </div>
  )
}

function SpatialCampus({onJump,theme}:{onJump:(tab:Tab)=>void;theme:Theme}) {
  const [chapter,setChapter]=useState<'resources'|'requests'|'events'|'cred'>('resources')
  const details={
    resources:{eyebrow:'01 / RESOURCES',title:'Pull your notes into focus.',text:'The resource world comes forward as you scroll. Open the library from the object itself.',button:'Open Resources'},
    requests:{eyebrow:'02 / REQUESTS',title:'Turn a favor into a task.',text:'The request world takes over next. Bounties, helpers and delivery all live in the real Requests tab.',button:'Open Requests'},
    events:{eyebrow:'03 / EVENTS',title:'See what is happening next.',text:'The event beacon becomes the focus. Jump straight to the live campus calendar instead of hunting for it.',button:'Open Events'},
    cred:{eyebrow:'04 / CRED',title:'Your contribution has weight.',text:'The final chapter brings Cred forward. Spend it, earn it, and see the wallet behind the system.',button:'Open Cred'},
  }[chapter]
  const openChapter=()=>{
    if(chapter==='events'){
      document.getElementById('cube-events-section')?.scrollIntoView({behavior:'smooth',block:'start'})
      return
    }
    onJump(chapter as Tab)
  }
  const chooseChapter=(next:'resources'|'requests'|'events'|'cred')=>{
    if(next==='events'){
      document.getElementById('cube-events-section')?.scrollIntoView({behavior:'smooth',block:'start'})
      return
    }
    onJump(next as Tab)
  }
  return <section className="cube-world-wrap">
    <div className="cube-world-copy">
      <span className="cube-kicker">CUBE / SPATIAL CAMPUS</span>
      <h2>Not another flat dashboard.</h2>
      <p>Scroll through four functional chapters. The scene changes focus as you move, then hands you directly to the feature you just explored.</p>
      <div className="cube-world-legend"><span className={chapter==='resources'?'is-active':''}><i className="resource-dot"/>Resources</span><span className={chapter==='requests'?'is-active':''}><i className="request-dot"/>Requests</span><span className={chapter==='events'?'is-active':''}><i className="event-dot"/>Events</span><span className={chapter==='cred'?'is-active':''}><i className="cred-dot"/>Cred</span></div>
    </div>
    <div className="cube-world-stage">
      <CubeWorldScene
        accent={theme.accent}
        accent2={theme.accent2}
        primary={theme.primary}
        onChapterChange={setChapter}
        onObjectActivate={(target)=>{
          if(target==='events'){
            document.getElementById('cube-events-section')?.scrollIntoView({behavior:'smooth',block:'start'})
          }else{
            onJump(target as Tab)
          }
        }}
      />
      <div className="cube-world-story-card" key={chapter}>
        <span className="cube-kicker">{details.eyebrow}</span>
        <strong>{details.title}</strong>
        <small>{details.text}</small>
        <button onClick={openChapter}>{details.button}<ArrowUpRight size={14}/></button>
      </div>
      <div className="cube-world-chapters" aria-label="Spatial campus chapters">
        {(['resources','requests','events','cred'] as const).map((item)=><button key={item} className={item===chapter?'is-active':''} onClick={()=>chooseChapter(item)} aria-label={item}>{item.slice(0,1).toUpperCase()}</button>)}
      </div>
      <div className="cube-world-swipe"><span>Scroll to change · drag to orbit</span><i/></div>
    </div>
  </section>
}

function HomeView(props: any) {
  const { loading, theme, spendable, monthly, query, setQuery, resources, saved, liked, toggleSaved, toggleLiked, downloadResource, onOpenFeature, onSeeResources, onJump, events, registerEvent, lostItems, resolveLostItem, setModal, offers, setNotice } = props
  return <div className="cube-page">
    <section className="cube-hero"><div className="cube-hero-copy"><motion.span className="cube-live-pill" animate={{y:[0,-2,0]}} transition={{duration:3,repeat:Infinity,ease:'easeInOut'}}><span className="cube-live-dot"/> Friday · Week 7</motion.span><h1>Your campus,<br/><em>beautifully alive.</em></h1><p>Resources, people, requests, events and little campus moments, all in one place.</p><div className="cube-search-wrap"><Search size={19}/><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search notes, requests, events..." aria-label="Search CampusHub"/><kbd>⌘ K</kbd></div><div className="cube-quick-row"><button onClick={()=>onJump('resources')}><BookOpen size={16}/> Study</button><button onClick={()=>onJump('requests')}><Zap size={16}/> Help someone</button><button onClick={()=>onJump('cred')}><Gift size={16}/> Spend Cred</button></div></div><motion.div className="cube-hero-orb" initial={{opacity:0,scale:.9,rotate:-4}} animate={{opacity:1,scale:1,rotate:0}} transition={{duration:.8}}><CubeScene accent={theme.primary} accent2={theme.accent2} intensity={1.05}/><div className="cube-hero-orb-caption"><span>03</span><small>things worth opening</small></div></motion.div></section>

    <SpatialCampus onJump={onJump} theme={theme} />

    <section className="cube-feature-rail">{[['Academic resources',BookOpen,'lavender','Notes, assignments & PYQs'],['Campus requests',Send,'mint','Tasks powered by Cred'],['Events & clubs',Compass,'peach','What is happening next'],['Lost & found',PackageSearch,'yellow','Find what wandered off'],['Local offers',Store,'blue','Student-friendly deals']].map(([title,Icon,tone,desc],index)=>{const I=Icon as typeof BookOpen;return <motion.button key={String(title)} className={`cube-feature-card cube-3d-card-interactive tone-${tone}`} style={{transformStyle:'preserve-3d'}} whileTap={{scale:.965,rotateX:1,z:-4}} whileHover={{y:-5,rotateX:-2,rotateY:index%2?2:-2,z:9}} onClick={()=>onOpenFeature(String(title))}><span className="cube-feature-number">0{index+1}</span><span className="cube-feature-icon"><I size={20}/></span><strong>{String(title)}</strong><small>{String(desc)}</small><span className="cube-feature-arrow"><ArrowUpRight size={16}/></span></motion.button>})}</section>

    <section className="cube-stat-strip"><div><span>Spendable</span><strong>{spendable}</strong><small>Cred</small></div><div><span>Monthly</span><strong>{monthly}</strong><small>Cred</small></div><div><span>Saved</span><strong>{saved.length}</strong><small>resources</small></div><div><span>Events</span><strong>{events.filter((e:any)=>e.registered).length}</strong><small>joined</small></div></section>

    <section className="cube-section"><SectionHeading eyebrow="For your semester" title="Resources worth keeping" action="See all" onClick={onSeeResources}/>{loading?<SkeletonList/>:<div className="cube-resource-list">{resources.map((r:any,index:number)=><ResourceCard key={r.id} resource={r} saved={saved.includes(r.id)} liked={liked.includes(r.id)} onSave={()=>toggleSaved(r.id)} onLike={()=>toggleLiked(r.id)} onDownload={()=>downloadResource(r)} index={index}/>)}</div>}</section>

    <section className="cube-split-grid"><div className="cube-large-card cube-request-feature"><div><span className="cube-kicker">Campus Requests</span><h2>Small favors can become a campus superpower.</h2><p>Lock Cred, ask for help, deliver the task, and let the system handle the release.</p><button className="cube-ghost-cta" onClick={()=>onJump('requests')}>Open requests <ArrowUpRight size={16}/></button></div><div className="cube-stack-art"><span className="cube-paper paper-a"/><span className="cube-paper paper-b"/><span className="cube-paper paper-c"/><span className="cube-coin">C</span></div></div><div className="cube-large-card cube-cred-feature"><span className="cube-kicker">Cred wallet</span><div className="cube-cred-head"><span className="cube-mini-label">Spendable</span><strong>{spendable}</strong><span className="cube-cred-unit">C</span></div><div className="cube-wave"/><div className="cube-cred-foot"><span><span className="cube-dot"/> Monthly {monthly}</span><button onClick={()=>onJump('cred')}>Open wallet <ChevronRight size={15}/></button></div></div></section>

    <section id="cube-events-section" className="cube-section"><SectionHeading eyebrow="This week" title="Things happening around you" action="Explore"/><div className="cube-event-row">{events.map((event:any,index:number)=><motion.article className={`cube-event-card cube-3d-card-interactive event-${event.color}`} key={event.id} style={{transformStyle:'preserve-3d'}} whileHover={{y:-5,rotateX:-2,rotateY:index%2?1.5:-1.5,z:8}} whileTap={{scale:.975,rotateX:1,z:-3}} initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.2}} transition={{delay:index*.08}}><div className="cube-event-poster"><span>{event.date}</span><strong>{event.title}</strong><small>{event.kind}</small><i/></div><div className="cube-event-meta"><MapPin size={14}/>{event.place}<button className="cube-event-register" onClick={()=>registerEvent(event.id)}>{event.registered?<><Check size={13}/>Registered</>:'Join'}</button></div></motion.article>)}</div></section>

    <section className="cube-split-grid"><div className="cube-small-card cube-lost-card"><SectionHeading eyebrow="Lost & Found" title="Tiny mysteries, solved." action="Post" onClick={()=>setModal('lost')}/>{lostItems.slice(0,3).map((item:any)=><div className="cube-lost-item" key={item.id}><span className={`cube-lost-art ${item.type==='FOUND'?'mint':'lavender'}`}><Archive size={18}/></span><div><strong>{item.title}</strong><small>{item.place}</small></div><span className={`cube-status ${item.type.toLowerCase()}`}>{item.status==='RESOLVED'?'RESOLVED':item.type}</span>{item.status!=='RESOLVED'&&<button className="cube-inline-action" onClick={()=>resolveLostItem(item.id)} aria-label="Resolve listing"><Check size={13}/></button>}</div>)}<button className="cube-inline-link" onClick={()=>setModal('lost')}><Plus size={14}/> Add a listing</button></div><div className="cube-small-card cube-offer-card"><SectionHeading eyebrow="Nearby" title="Useful little deals" action="Open"/>{offers.map((offer:any)=><button className="cube-offer-item cube-offer-button" key={offer.name} onClick={()=>setNotice(`${offer.name}: ${offer.offer}`)}><span className="cube-offer-logo">{offer.icon}</span><div><strong>{offer.name}</strong><small>{offer.offer}</small><em>{offer.meta}</em></div><ChevronRight size={15}/></button>)}</div></section>
  </div>
}

function ResourcesView(props: any) {
  const { loading, query, setQuery, resources, saved, liked, toggleSaved, toggleLiked, downloadResource, setModal }=props
  const [filter,setFilter]=useState('All')
  const filters=['All','Notes','PYQs','Practicals','Assignments','Cheat sheet']
  const visible=filter==='All'?resources:resources.filter((r:any)=>r.tag===filter)
  return <div className="cube-page"><div className="cube-page-head"><PageIntro eyebrow="Library" title="Find something useful." subtitle="Your semester, without the scavenger hunt."/><button className="cube-primary-cta cube-page-cta" onClick={()=>setModal('upload')}><UploadCloud size={16}/> Share resource</button></div><div className="cube-search-wrap cube-search-wide"><Search size={19}/><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search a subject, teacher or topic..."/></div><div className="cube-chip-row">{filters.map((item)=><button key={item} className={cn('cube-chip',filter===item&&'is-active')} onClick={()=>setFilter(item)}>{item}</button>)}</div>{loading?<SkeletonList/>:<div className="cube-resource-grid">{visible.map((r:any,index:number)=><ResourceCard key={r.id} resource={r} saved={saved.includes(r.id)} liked={liked.includes(r.id)} onSave={()=>toggleSaved(r.id)} onLike={()=>toggleLiked(r.id)} onDownload={()=>downloadResource(r)} index={index} large/>)}</div>}{!loading&&!visible.length&&<EmptyState icon={<FileText size={22}/>} title="Nothing matched" text="Try another subject, teacher or type."/>}<div className="cube-empty-hint"><CircleHelp size={16}/> Duplicate-aware PDF uploads and real search/filter state are enabled in demo mode.</div></div>
}

function RequestsView(props:any) {
  const { requests,onAccept,onDeliver,onComplete,onDispute,onCancel,setModal }=props
  return <div className="cube-page"><div className="cube-page-head"><PageIntro eyebrow="Peer marketplace" title="Need a hand?" subtitle="Post a task. Someone nearby can pick it up."/><button className="cube-primary-cta cube-page-cta" onClick={()=>setModal('request')}><Plus size={17}/> Create request</button></div><div className="cube-request-list">{requests.map((request:any,index:number)=><motion.article className="cube-request-card" key={request.id} layout><div className="cube-request-main"><span className="cube-kicker">Request · {String(index+1).padStart(2,'0')}</span><h3>{request.title}</h3><p>{request.detail}</p><div className="cube-request-meta"><span><Clock3 size={14}/>{request.state==='DELIVERED'?'48h auto-release after delivery':'Cred locked by the system'}</span><span className={`cube-status request-${request.state.toLowerCase()}`}>{request.state}</span></div></div><div className="cube-request-bounty"><small>Bounty</small><strong>{request.bounty}</strong><span>Cred</span>{request.state==='OPEN'&&!request.createdByMe&&<button className="cube-small-cta" onClick={()=>onAccept(request.id)}>Accept</button>}{request.state==='OPEN'&&request.createdByMe&&<button className="cube-small-cta" onClick={()=>onCancel(request.id)}>Cancel & refund</button>}{request.state==='ACCEPTED'&&request.helper==='You'&&<button className="cube-small-cta" onClick={()=>onDeliver(request.id)}>Submit delivery</button>}{request.state==='DELIVERED'&&request.helper!=='You'&&<div className="cube-action-row"><button className="cube-small-cta" onClick={()=>onComplete(request.id)}>Accept</button><button className="cube-danger-cta" onClick={()=>onDispute(request.id)}>Dispute</button></div>}{request.state==='DELIVERED'&&request.helper==='You'&&<span className="cube-wait-pill">Waiting for requester</span>}{request.state==='DISPUTED'&&<span className="cube-wait-pill"><Flag size={13}/>Admin review</span>}{(request.state==='COMPLETED'||request.state==='AUTO_RELEASED')&&<span className="cube-complete-pill"><Check size={13}/>settled</span>}</div></motion.article>)}</div><div className="cube-escrow-explainer"><div className="cube-escrow-ring"><WalletCards size={24}/></div><div><span className="cube-kicker">Locked Cred, explained</span><h3>Requester → lock → delivery → release.</h3><p>Cred is temporarily locked and released after acceptance, or automatically after 48 hours unless a dispute is active.</p></div></div></div>
}

function CredView({spendable,monthly,conduct,redeem}:{spendable:number;monthly:number;conduct:number;redeem:(cost:number,item:string)=>void}) {
  const rewards=[{name:'Resource Boost',cost:40,icon:Zap,color:'mint',desc:'Push one resource higher in discovery.'},{name:'Request Boost',cost:30,icon:Send,color:'lavender',desc:'Give a campus request extra visibility.'},{name:'Profile Glow',cost:24,icon:Sparkles,color:'peach',desc:'Unlock an animated profile frame.'}]
  return <div className="cube-page"><PageIntro eyebrow="Virtual economy" title="Cred, but make it tangible." subtitle="One balance to spend. One score to contribute. One conduct signal to protect."/><div className="cube-wallet-card"><div className="cube-wallet-orbit"/><div className="cube-wallet-top"><span>CampusHub</span><span>Spendable Cred</span></div><div className="cube-wallet-balance">{spendable}<small>C</small></div><div className="cube-wallet-bottom"><span>Monthly {monthly}</span><span>Conduct {conduct>0?'+':''}{conduct}</span><span>•••• 2048</span></div></div><div className="cube-cred-three"><div><span>Monthly</span><strong>{monthly}</strong><small>resets each month</small></div><div><span>Spendable</span><strong>{spendable}</strong><small>never resets</small></div><div><span>Conduct</span><strong>{conduct>0?'+':''}{conduct}</strong><small>long-term behavior</small></div></div><SectionHeading eyebrow="Cred Store" title="Spend it on useful things."/><div className="cube-reward-grid">{rewards.map((reward)=>{const Icon=reward.icon;return <motion.article key={reward.name} className={`cube-reward-card cube-3d-card-interactive ${reward.color}`} style={{transformStyle:'preserve-3d'}} whileHover={{y:-4,rotateX:-2,rotateY:2,z:8}} whileTap={{scale:.975,rotateX:1,z:-4}}><span className="cube-reward-icon"><Icon size={19}/></span><strong>{reward.name}</strong><p>{reward.desc}</p><footer><span>{reward.cost} Cred</span><button onClick={()=>redeem(reward.cost,reward.name)}>Redeem</button></footer></motion.article>})}</div><div className="cube-transaction-card"><div className="cube-transaction-heading"><span className="cube-kicker">Recent movement</span><span>Auditable ledger</span></div>{[['+15','Request completion','Today'],['+10','Resource upload','Yesterday'],['−20','Escrow lock','Yesterday'],['+10','Resource upload','Mon']].map(([amount,label,date])=><div className="cube-transaction" key={label+date}><span className={amount.startsWith('+')?'positive':'negative'}>{amount}</span><div><strong>{label}</strong><small>{date}</small></div><ChevronRight size={15}/></div>)}</div></div>
}

function ProfileView({theme,spendable,monthly,conduct,resourcesCount,requestCount,onTheme,onLogout,pdfUploads}:{theme:Theme;spendable:number;monthly:number;conduct:number;resourcesCount:number;requestCount:number;onTheme:()=>void;onLogout:()=>void;pdfUploads:number}) {
  return <div className="cube-page"><PageIntro eyebrow="You" title="Make your corner of campus yours." subtitle="Academic identity, contribution history and the little settings that keep everything tidy."/><div className="cube-profile-hero"><div className="cube-avatar"><span>AS</span><i/></div><div><h2>Atharv</h2><p>CSE · 2nd Year · Semester 3 · Set A</p><span className="cube-profile-tag">RGPV · LNCT</span></div><button className="cube-icon-button" onClick={onTheme} aria-label="Visual settings"><Settings2 size={18}/></button></div><div className="cube-profile-grid"><div className="cube-profile-stat"><UploadCloud size={18}/><strong>{Math.min(pdfUploads,2)}/2</strong><span>PDF unlock</span></div><div className="cube-profile-stat"><BookOpen size={18}/><strong>{resourcesCount}</strong><span>resources</span></div><div className="cube-profile-stat"><Users size={18}/><strong>{requestCount}</strong><span>request activity</span></div><div className="cube-profile-stat"><WalletCards size={18}/><strong>{spendable}</strong><span>spendable Cred</span></div><div className="cube-profile-stat"><Trophy size={18}/><strong>{monthly}</strong><span>monthly Cred</span></div></div><div className="cube-large-card cube-profile-theme-card"><span className="cube-kicker">Current visual style</span><h3>{theme.name}</h3><p>Five visual themes share the same interaction language, so CUBE can change personality without breaking usability.</p><div className="cube-profile-actions"><button className="cube-primary-cta" onClick={onTheme}>Open Visual Lab <Sparkles size={15}/></button><button className="cube-secondary-cta" onClick={onLogout}>Log out</button></div></div></div>
}

function ResourceCard({resource,saved,liked,onSave,onLike,onDownload,index,large=false}:{resource:any;saved:boolean;liked:boolean;onSave:()=>void;onLike:()=>void;onDownload:()=>void;index:number;large?:boolean}) {
  return <motion.article className={cn('cube-resource-card','cube-3d-card-interactive',large&&'is-large')} style={{transformStyle:'preserve-3d'}} whileHover={{y:-5,rotateX:-2,rotateY:index%2?2:-2,z:8}} whileTap={{scale:.975,rotateX:1,rotateY:0,z:-4}} initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.12}} transition={{delay:index*.06,duration:.38}}><div className={`cube-resource-art art-${resource.tone}`}><FileText size={30}/><span>{String(index+1).padStart(2,'0')}</span></div><div className="cube-resource-body"><div className="cube-resource-topline"><span>{resource.tag}</span><span>{resource.meta}</span></div><h3>{resource.title}</h3><p>{resource.subject} · Set {resource.set} · {resource.teacher}</p><div className="cube-resource-bottom"><span className="cube-resource-votes"><button onClick={onLike} className={liked?'is-liked':''} aria-label="Like resource"><Heart size={15} fill={liked?'currentColor':'none'}/></button>{resource.votes+(liked?1:0)}</span><span className="cube-resource-uploader">shared by Aanya</span><button onClick={onSave} className={saved?'is-saved':''} aria-label="Save resource"><Bookmark size={16} fill={saved?'currentColor':'none'}/></button><button className="cube-download" onClick={onDownload} aria-label="Download resource"><Download size={16}/></button></div></div></motion.article>
}

function SectionHeading({eyebrow,title,action,onClick}:{eyebrow:string;title:string;action?:string;onClick?:()=>void}){return <div className="cube-section-heading"><div><span className="cube-kicker">{eyebrow}</span><h2>{title}</h2></div>{action&&<button onClick={onClick}>{action}<ArrowUpRight size={14}/></button>}</div>}
function PageIntro({eyebrow,title,subtitle}:{eyebrow:string;title:string;subtitle:string}){return <div className="cube-page-intro"><span className="cube-kicker">{eyebrow}</span><h1>{title}</h1><p>{subtitle}</p></div>}
function SkeletonList(){return <div className="cube-resource-list">{[1,2,3].map((i)=><div className="cube-skeleton" key={i}><span className="cube-skeleton-art"/><div><span/><span/><span className="short"/></div></div>)}</div>}
function EmptyState({icon,title,text}:{icon:ReactNode;title:string;text:string}){return <div className="cube-empty-panel">{icon}<div><strong>{title}</strong><small>{text}</small></div></div>}
function FeatureSheet({title,description,onClose}:{title:string;description:string;onClose:()=>void}){return <motion.div className="cube-modal-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose}><motion.div className="cube-feature-modal" initial={{opacity:0,y:30,scale:.97}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:20,scale:.98}} onClick={(e)=>e.stopPropagation()}><div className="cube-modal-orbit"><span/><span/><span/><span/></div><span className="cube-kicker">CampusHub · what it does</span><h2>{title}</h2><p>{description}</p><button className="cube-primary-cta" onClick={onClose}>Explore <ArrowUpRight size={17}/></button></motion.div></motion.div>}
function Sheet({title,subtitle,onClose,children}:{title:string;subtitle:string;onClose:()=>void;children:ReactNode}){return <motion.div className="cube-sheet-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose}><motion.div className="cube-sheet" initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}} transition={{type:'spring',stiffness:280,damping:30}} onClick={(e)=>e.stopPropagation()}><div className="cube-sheet-handle"/><div className="cube-sheet-head"><div><span className="cube-kicker">CUBE Studio</span><h2>{title}</h2><p>{subtitle}</p></div><button className="cube-mini-close" onClick={onClose} aria-label="Close"><X size={17}/></button></div>{children}</motion.div></motion.div>}
