'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Archive, ArrowUpRight, Bell, BookOpen, Bookmark, Check, ChevronRight, CircleHelp,
  Clock3, Compass, Download, FileText, Gift, Heart, Home, Layers3, MapPin,
  PackageSearch, Plus, Search, Send, Settings2, Sparkles, Store, Trophy, UserRound,
  Users, WalletCards, X, Zap,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { CubeScene } from './cube-scene'

type Theme = {
  id: string; name: string; label: string; bg: string; surface: string;
  primary: string; secondary: string; accent: string; accent2: string; ink: string
}

const themes: Theme[] = [
  { id: 'emerald', name: 'Emerald & Champagne', label: 'Editorial', bg: '#F7F3E9', surface: '#FFFDF7', primary: '#0C4D42', secondary: '#D9E7DF', accent: '#E9D39B', accent2: '#D49A78', ink: '#173B35' },
  { id: 'lavender', name: 'Lavender & Apricot', label: 'Dreamy', bg: '#F8F4FB', surface: '#FFF9FE', primary: '#5A466B', secondary: '#E6DCF5', accent: '#F4B7A7', accent2: '#B79AE8', ink: '#3D3149' },
  { id: 'ocean', name: 'Ocean & Mint', label: 'Breezy', bg: '#F1FAF8', surface: '#FCFFFE', primary: '#205A63', secondary: '#CDEDE3', accent: '#88D8C2', accent2: '#78BCE7', ink: '#173D43' },
  { id: 'peach', name: 'Peach & Berry', label: 'Playful', bg: '#FFF5F1', surface: '#FFFDFC', primary: '#783E55', secondary: '#F7DAD2', accent: '#F6A98E', accent2: '#D66C94', ink: '#4D2738' },
  { id: 'butter', name: 'Butter & Lilac', label: 'Sunny', bg: '#FFFBEF', surface: '#FFFFFB', primary: '#65522D', secondary: '#EEE4C7', accent: '#F4D971', accent2: '#B59AE7', ink: '#44371F' },
]

type Tab = 'home' | 'resources' | 'requests' | 'cred' | 'profile'

const resources = [
  { id: 1, title: 'OOP in Java — complete notes', subject: 'Object Oriented Programming', tag: 'Notes', meta: '18 pages', votes: 126, tone: 'lavender' },
  { id: 2, title: 'DBMS Normalisation Cheat Sheet', subject: 'Database Management', tag: 'Cheat sheet', meta: '8 pages', votes: 98, tone: 'mint' },
  { id: 3, title: 'Data Structures PYQ Pack', subject: 'Data Structures', tag: 'PYQs', meta: '32 pages', votes: 184, tone: 'peach' },
  { id: 4, title: 'Computer Networks Practicals', subject: 'Computer Networks', tag: 'Practicals', meta: '14 pages', votes: 72, tone: 'butter' },
]

const requestsSeed = [
  { id: 1, title: 'Print 48 pages near Block B', detail: 'Need it before 5 PM today.', bounty: 20, state: 'OPEN', helper: '' },
  { id: 2, title: 'Explain recursion for tomorrow', detail: '30 minute walkthrough, beginner level.', bounty: 16, state: 'DELIVERED', helper: 'Rohan' },
  { id: 3, title: 'Carry a file to the library', detail: 'Small envelope. Pickup after 4 PM.', bounty: 8, state: 'OPEN', helper: '' },
]

const events = [
  { title: 'HackSprint 4.0', kind: 'Hackathon', date: '12 Oct', place: 'Innovation Lab', color: 'pink' },
  { title: 'Java After Hours', kind: 'Workshop', date: '15 Oct', place: 'Seminar Hall', color: 'mint' },
  { title: 'Cultural Open Mic', kind: 'Cultural', date: '18 Oct', place: 'Amphitheatre', color: 'yellow' },
]

const offers = [
  { name: 'PrintMint', offer: '10% off on bulk printing', meta: '0.8 km · Open until 8 PM', icon: '▤' },
  { name: 'ByteCafe', offer: 'Study combo under ₹99', meta: '1.2 km · Student special', icon: '✦' },
]

const lostItems = [
  { title: 'Black wallet', place: 'Library · 2nd floor', type: 'FOUND', color: 'mint' },
  { title: 'Blue calculator', place: 'Block C · Room 204', type: 'LOST', color: 'lavender' },
]

const nav = [
  { id: 'home' as Tab, label: 'Home', icon: Home },
  { id: 'resources' as Tab, label: 'Resources', icon: BookOpen },
  { id: 'requests' as Tab, label: 'Requests', icon: Send },
  { id: 'cred' as Tab, label: 'Cred', icon: WalletCards },
  { id: 'profile' as Tab, label: 'Profile', icon: UserRound },
]

const cn = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(' ')

export function CubeExperience() {
  const [themeId, setThemeId] = useState('emerald')
  const [tab, setTab] = useState<Tab>('home')
  const [query, setQuery] = useState('')
  const [saved, setSaved] = useState<number[]>([1, 2])
  const [liked, setLiked] = useState<number[]>([])
  const [requests, setRequests] = useState(requestsSeed)
  const [spendable, setSpendable] = useState(148)
  const [monthly, setMonthly] = useState(72)
  const [conduct] = useState(36)
  const [notice, setNotice] = useState('')
  const [showThemes, setShowThemes] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null)
  const [showAllResources, setShowAllResources] = useState(false)

  const theme = themes.find((item) => item.id === themeId) ?? themes[0]

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
    if (!notice) return
    const id = window.setTimeout(() => setNotice(''), 2400)
    return () => window.clearTimeout(id)
  }, [notice])

  const filteredResources = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = !q ? resources : resources.filter((item) =>
      [item.title, item.subject, item.tag].some((value) => value.toLowerCase().includes(q)),
    )
    return showAllResources ? filtered : filtered.slice(0, 3)
  }, [query, showAllResources])

  const toggleSaved = (id: number) => {
    const nextSaved = saved.includes(id)
    setSaved((prev) => nextSaved ? prev.filter((item) => item !== id) : [...prev, id])
    setNotice(nextSaved ? 'Removed from saved' : 'Saved to your library')
  }

  const toggleLiked = (id: number) => {
    setLiked((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id])
  }

  const acceptRequest = (id: number) => {
    setRequests((prev) => prev.map((request) => request.id === id ? { ...request, state: 'ACCEPTED', helper: 'You' } : request))
    setNotice('Accepted. Cred stays locked until delivery is completed.')
  }

  const completeRequest = (id: number) => {
    const request = requests.find((item) => item.id === id)
    setRequests((prev) => prev.map((item) => item.id === id ? { ...item, state: 'COMPLETED' } : item))
    if (request) {
      setSpendable((value) => value + Math.max(request.bounty - 2, 0))
      setMonthly((value) => value + 15)
      setNotice(`+${Math.max(request.bounty - 2, 0)} Spendable Cred · +15 Monthly Cred`)
    }
  }

  const redeem = (cost: number, item: string) => {
    if (spendable < cost) return setNotice('Not enough Spendable Cred')
    setSpendable((value) => value - cost)
    setNotice(`${item} redeemed`)
  }

  const featureDescription: Record<string, string> = {
    'Academic resources': 'Find notes, assignments, practicals and previous-year papers filtered to your branch, semester and set.',
    'Campus requests': 'Post student-to-student tasks, lock a Cred bounty, deliver work and settle it safely.',
    'Events & clubs': 'Discover hackathons, workshops, competitions, cultural activities and verified campus clubs.',
    'Lost & found': 'Report or discover misplaced items with image-first listings and clear resolution states.',
    'Local offers': 'See useful student-focused offers from printing, food, stationery and repair businesses.',
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
          <button className="cube-icon-button" onClick={() => setShowNotifications((value) => !value)} aria-label="Notifications"><Bell size={18} /><span className="cube-notification-dot" /></button>
        </div>
      </header>

      <AnimatePresence>
        {showThemes && (
          <motion.div className="cube-theme-drawer" initial={{ opacity: 0, y: -12, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -12, scale: .98 }}>
            <div className="cube-drawer-heading">
              <div><span className="cube-kicker">Visual Lab</span><h3>Pick a mood</h3></div>
              <button className="cube-mini-close" onClick={() => setShowThemes(false)} aria-label="Close"><X size={17} /></button>
            </div>
            <div className="cube-theme-grid">
              {themes.map((option) => (
                <button key={option.id} className={cn('cube-theme-swatch', option.id === theme.id && 'is-active')} onClick={() => { setThemeId(option.id); setNotice(`${option.name} applied`) }}>
                  <span className="cube-swatch-preview"><i style={{ background: option.primary }} /><i style={{ background: option.accent }} /><i style={{ background: option.secondary }} /></span>
                  <span><strong>{option.name}</strong><small>{option.label}</small></span>
                  {option.id === theme.id && <Check size={17} />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNotifications && (
          <motion.div className="cube-notification-panel" initial={{ opacity: 0, y: -10, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: .98 }}>
            <div className="cube-drawer-heading">
              <div><span className="cube-kicker">Inbox</span><h3>Little updates</h3></div>
              <button className="cube-mini-close" onClick={() => setShowNotifications(false)} aria-label="Close"><X size={17} /></button>
            </div>
            {[
              ['mint', Check, 'Request delivered', 'Your recursion help request is waiting for review.'],
              ['peach', Trophy, '+15 Monthly Cred', 'You helped a classmate with a practical.'],
              ['yellow', Sparkles, 'New event nearby', 'HackSprint 4.0 opened registrations.'],
            ].map(([tone, Icon, title, text], index) => {
              const I = Icon as typeof Check
              return <div className="cube-notice-item" key={String(title) + index}><span className={`cube-notice-icon ${tone}`}><I size={15} /></span><div><strong>{String(title)}</strong><small>{String(text)}</small></div></div>
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="cube-content">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .34, ease: [0.22, 1, .36, 1] }}>
            {tab === 'home' && (
              <HomeView
                theme={theme} spendable={spendable} monthly={monthly} query={query} setQuery={setQuery}
                resources={filteredResources} saved={saved} liked={liked} toggleSaved={toggleSaved} toggleLiked={toggleLiked}
                onOpenFeature={setSelectedFeature} onSeeAllResources={() => { setTab('resources'); setShowAllResources(true) }} onJump={setTab}
              />
            )}
            {tab === 'resources' && (
              <ResourcesView
                query={query} setQuery={setQuery} resources={filteredResources} saved={saved} liked={liked}
                toggleSaved={toggleSaved} toggleLiked={toggleLiked} showAll={showAllResources} setShowAll={setShowAllResources}
              />
            )}
            {tab === 'requests' && <RequestsView requests={requests} onAccept={acceptRequest} onComplete={completeRequest} onCreate={() => setNotice('Create Request is ready for the POST /api/requests contract.')} />}
            {tab === 'cred' && <CredView spendable={spendable} monthly={monthly} conduct={conduct} redeem={redeem} />}
            {tab === 'profile' && <ProfileView theme={theme} />}
          </motion.div>
        </AnimatePresence>
      </main>

      <nav className="cube-bottom-nav" aria-label="Primary">
        {nav.map((item) => {
          const Icon = item.icon
          return <button key={item.id} className={cn('cube-nav-item', tab === item.id && 'is-active')} onClick={() => setTab(item.id)} aria-current={tab === item.id ? 'page' : undefined}><span className="cube-nav-icon"><Icon size={19} /></span><span>{item.label}</span></button>
        })}
      </nav>

      <AnimatePresence>
        {selectedFeature && (
          <motion.div className="cube-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedFeature(null)}>
            <motion.div className="cube-feature-modal" initial={{ opacity: 0, y: 30, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: .98 }} onClick={(event) => event.stopPropagation()}>
              <div className="cube-modal-orbit"><span /><span /><span /><span /></div>
              <span className="cube-kicker">CampusHub · what it does</span>
              <h2>{selectedFeature}</h2>
              <p>{featureDescription[selectedFeature]}</p>
              <button className="cube-primary-cta" onClick={() => setSelectedFeature(null)}>Explore <ArrowUpRight size={17} /></button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {notice && <motion.div className="cube-toast" initial={{ opacity: 0, y: 14, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: .98 }}><Check size={16} />{notice}</motion.div>}
      </AnimatePresence>
    </div>
  )
}

function HomeView(props: {
  theme: Theme; spendable: number; monthly: number; query: string; setQuery: (value: string) => void; resources: typeof resources;
  saved: number[]; liked: number[]; toggleSaved: (id: number) => void; toggleLiked: (id: number) => void;
  onOpenFeature: (value: string) => void; onSeeAllResources: () => void; onJump: (tab: Tab) => void
}) {
  const { theme, spendable, monthly, query, setQuery, resources, saved, liked, toggleSaved, toggleLiked, onOpenFeature, onSeeAllResources, onJump } = props
  return (
    <div className="cube-page">
      <section className="cube-hero">
        <div className="cube-hero-copy">
          <motion.span className="cube-live-pill" animate={{ y: [0, -2, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}><span className="cube-live-dot" /> Friday · Week 7</motion.span>
          <h1>Your campus,<br /><em>beautifully alive.</em></h1>
          <p>Resources, people, requests, events and little campus moments, all in one place.</p>
          <div className="cube-search-wrap"><Search size={19} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search notes, requests, events..." aria-label="Search CampusHub" /><kbd>⌘ K</kbd></div>
          <div className="cube-quick-row">
            <button onClick={() => onJump('resources')}><BookOpen size={16} /> Study</button>
            <button onClick={() => onJump('requests')}><Zap size={16} /> Help someone</button>
            <button onClick={() => onJump('cred')}><Gift size={16} /> Spend Cred</button>
          </div>
        </div>
        <motion.div className="cube-hero-orb" initial={{ opacity: 0, scale: .9, rotate: -4 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: .8 }}>
          <CubeScene accent={theme.primary} accent2={theme.accent2} intensity={1.05} />
          <div className="cube-hero-orb-caption"><span>03</span><small>things worth opening</small></div>
        </motion.div>
      </section>

      <section className="cube-feature-rail">
        {[
          ['Academic resources','Study',BookOpen,'lavender','Notes, assignments & PYQs'],
          ['Campus requests','Help',Send,'mint','Tasks powered by Cred'],
          ['Events & clubs','Discover',Compass,'peach','What is happening next'],
          ['Lost & found','Campus',PackageSearch,'yellow','Find what wandered off'],
          ['Local offers','Nearby',Store,'blue','Student-friendly deals'],
        ].map(([title,label,Icon,tone,desc], index) => {
          const I = Icon as typeof BookOpen
          return <motion.button key={String(title)} className={`cube-feature-card tone-${tone}`} whileTap={{ scale: .97 }} whileHover={{ y: -4 }} onClick={() => onOpenFeature(String(title))}>
            <span className="cube-feature-number">0{index + 1}</span><span className="cube-feature-icon"><I size={20} /></span><strong>{String(title)}</strong><small>{String(desc)}</small><span className="cube-feature-arrow"><ArrowUpRight size={16} /></span>
          </motion.button>
        })}
      </section>

      <section className="cube-stat-strip">
        <div><span>Spendable</span><strong>{spendable}</strong><small>Cred</small></div>
        <div><span>Monthly</span><strong>{monthly}</strong><small>Cred</small></div>
        <div><span>Saved</span><strong>{saved.length}</strong><small>resources</small></div>
        <div><span>Streak</span><strong>7</strong><small>days</small></div>
      </section>

      <section className="cube-section">
        <SectionHeading eyebrow="For your semester" title="Resources worth keeping" action="See all" onClick={onSeeAllResources} />
        <div className="cube-resource-list">{resources.map((resource, index) => <ResourceCard key={resource.id} resource={resource} saved={saved.includes(resource.id)} liked={liked.includes(resource.id)} onSave={() => toggleSaved(resource.id)} onLike={() => toggleLiked(resource.id)} index={index} />)}</div>
      </section>

      <section className="cube-split-grid">
        <div className="cube-large-card cube-request-feature">
          <div><span className="cube-kicker">Campus Requests</span><h2>Small favors can become a campus superpower.</h2><p>Lock Cred, ask for help, deliver the task, and let the system handle the release.</p><button className="cube-ghost-cta" onClick={() => onJump('requests')}>Open requests <ArrowUpRight size={16} /></button></div>
          <div className="cube-stack-art"><span className="cube-paper paper-a" /><span className="cube-paper paper-b" /><span className="cube-paper paper-c" /><span className="cube-coin">C</span></div>
        </div>
        <div className="cube-large-card cube-cred-feature">
          <span className="cube-kicker">Cred wallet</span>
          <div className="cube-cred-head"><span className="cube-mini-label">Spendable</span><strong>{spendable}</strong><span className="cube-cred-unit">C</span></div>
          <div className="cube-wave" />
          <div className="cube-cred-foot"><span><span className="cube-dot" /> Monthly {monthly}</span><button onClick={() => onJump('cred')}>Open wallet <ChevronRight size={15} /></button></div>
        </div>
      </section>

      <section className="cube-section">
        <SectionHeading eyebrow="This week" title="Things happening around you" action="Explore" />
        <div className="cube-event-row">{events.map((event, index) => <motion.article className={`cube-event-card event-${event.color}`} key={event.title} whileTap={{ scale: .985 }} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ delay: index * .08 }}><div className="cube-event-poster"><span>{event.date}</span><strong>{event.title}</strong><small>{event.kind}</small><i /></div><div className="cube-event-meta"><MapPin size={14} /> {event.place}</div></motion.article>)}</div>
      </section>

      <section className="cube-split-grid">
        <div className="cube-small-card cube-lost-card"><SectionHeading eyebrow="Lost & Found" title="Tiny mysteries, solved." action="View" />{lostItems.map((item) => <div className="cube-lost-item" key={item.title}><span className={`cube-lost-art ${item.color}`}><Archive size={18} /></span><div><strong>{item.title}</strong><small>{item.place}</small></div><span className={`cube-status ${item.type.toLowerCase()}`}>{item.type}</span></div>)}</div>
        <div className="cube-small-card cube-offer-card"><SectionHeading eyebrow="Nearby" title="Useful little deals" action="Open" />{offers.map((offer) => <div className="cube-offer-item" key={offer.name}><span className="cube-offer-logo">{offer.icon}</span><div><strong>{offer.name}</strong><small>{offer.offer}</small><em>{offer.meta}</em></div></div>)}</div>
      </section>
    </div>
  )
}

function ResourcesView(props: {
  query: string; setQuery: (value: string) => void; resources: typeof resources; saved: number[]; liked: number[];
  toggleSaved: (id: number) => void; toggleLiked: (id: number) => void; showAll: boolean; setShowAll: (value: boolean) => void
}) {
  const { query, setQuery, resources, saved, liked, toggleSaved, toggleLiked, showAll, setShowAll } = props
  const [filter, setFilter] = useState('All')
  const filters = ['All', 'Notes', 'PYQs', 'Practicals', 'Cheat sheet']
  const visible = resources.filter((item) => filter === 'All' || item.tag === filter)
  return <div className="cube-page">
    <PageIntro eyebrow="Library" title="Find something useful." subtitle="Your semester, without the scavenger hunt." />
    <div className="cube-search-wrap cube-search-wide"><Search size={19} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search a subject, teacher or topic..." /></div>
    <div className="cube-chip-row">{filters.map((item) => <button key={item} className={cn('cube-chip', filter === item && 'is-active')} onClick={() => setFilter(item)}>{item}</button>)}</div>
    <div className="cube-resource-grid">{visible.map((resource, index) => <ResourceCard key={resource.id} resource={resource} saved={saved.includes(resource.id)} liked={liked.includes(resource.id)} onSave={() => toggleSaved(resource.id)} onLike={() => toggleLiked(resource.id)} index={index} large />)}</div>
    {!showAll && <button className="cube-load-more" onClick={() => setShowAll(true)}><Layers3 size={16} /> Show more resources</button>}
    <div className="cube-empty-hint"><CircleHelp size={16} /> Every resource shows subject, set, type, votes and uploader context.</div>
  </div>
}

function RequestsView({ requests, onAccept, onComplete, onCreate }: { requests: typeof requestsSeed; onAccept: (id: number) => void; onComplete: (id: number) => void; onCreate: () => void }) {
  return <div className="cube-page">
    <div className="cube-page-head"><PageIntro eyebrow="Peer marketplace" title="Need a hand?" subtitle="Post a task. Someone nearby can pick it up." /><button className="cube-primary-cta cube-page-cta" onClick={onCreate}><Plus size={17} /> Create request</button></div>
    <div className="cube-request-list">{requests.map((request, index) => <motion.article className="cube-request-card" key={request.id} layout>
      <div className="cube-request-main"><span className="cube-kicker">Request · {String(index + 1).padStart(2, '0')}</span><h3>{request.title}</h3><p>{request.detail}</p><div className="cube-request-meta"><span><Clock3 size={14} /> 48h auto-release after delivery</span><span className={`cube-status request-${request.state.toLowerCase()}`}>{request.state}</span></div></div>
      <div className="cube-request-bounty"><small>Bounty</small><strong>{request.bounty}</strong><span>Cred</span>{request.state === 'OPEN' && <button className="cube-small-cta" onClick={() => onAccept(request.id)}>Accept</button>}{request.state === 'DELIVERED' && <button className="cube-small-cta" onClick={() => onComplete(request.id)}>Accept delivery</button>}{request.state === 'COMPLETED' && <span className="cube-complete-pill"><Check size={13} /> settled</span>}{request.state === 'ACCEPTED' && <span className="cube-wait-pill">In progress · {request.helper}</span>}</div>
    </motion.article>)}</div>
    <div className="cube-escrow-explainer"><div className="cube-escrow-ring"><WalletCards size={24} /></div><div><span className="cube-kicker">Locked Cred, explained</span><h3>Requester → lock → delivery → release.</h3><p>Cred is temporarily locked and released after acceptance or automatically after 48 hours unless a dispute is active.</p></div></div>
  </div>
}

function CredView({ spendable, monthly, conduct, redeem }: { spendable: number; monthly: number; conduct: number; redeem: (cost: number, item: string) => void }) {
  const rewards = [
    { name: 'Resource Boost', cost: 40, icon: Zap, color: 'mint', desc: 'Push one resource higher in discovery.' },
    { name: 'Request Boost', cost: 30, icon: Send, color: 'lavender', desc: 'Give a campus request extra visibility.' },
    { name: 'Profile Glow', cost: 24, icon: Sparkles, color: 'peach', desc: 'Unlock an animated profile frame.' },
  ]
  return <div className="cube-page">
    <PageIntro eyebrow="Virtual economy" title="Cred, but make it tangible." subtitle="One balance to spend. One score to contribute. One conduct signal to protect." />
    <div className="cube-wallet-card"><div className="cube-wallet-orbit" /><div className="cube-wallet-top"><span>CampusHub</span><span>Spendable Cred</span></div><div className="cube-wallet-balance">{spendable}<small>C</small></div><div className="cube-wallet-bottom"><span>Monthly {monthly}</span><span>Conduct {conduct > 0 ? '+' : ''}{conduct}</span><span>•••• 2048</span></div></div>
    <div className="cube-cred-three"><div><span>Monthly</span><strong>{monthly}</strong><small>resets each month</small></div><div><span>Spendable</span><strong>{spendable}</strong><small>never resets</small></div><div><span>Conduct</span><strong>{conduct > 0 ? '+' : ''}{conduct}</strong><small>long-term behavior</small></div></div>
    <SectionHeading eyebrow="Cred Store" title="Spend it on useful things." />
    <div className="cube-reward-grid">{rewards.map((reward) => { const Icon = reward.icon; return <motion.article key={reward.name} className={`cube-reward-card ${reward.color}`} whileHover={{ y: -3 }} whileTap={{ scale: .98 }}><span className="cube-reward-icon"><Icon size={19} /></span><strong>{reward.name}</strong><p>{reward.desc}</p><footer><span>{reward.cost} Cred</span><button onClick={() => redeem(reward.cost, reward.name)}>Redeem</button></footer></motion.article> })}</div>
    <div className="cube-transaction-card"><div className="cube-transaction-heading"><span className="cube-kicker">Recent movement</span><span>Auditable ledger</span></div>{[['+15','Request completion','Today'],['+10','Resource upload','Yesterday'],['−20','Escrow lock','Yesterday'],['+10','Resource upload','Mon']].map(([amount,label,date]) => <div className="cube-transaction" key={label + date}><span className={amount.startsWith('+') ? 'positive' : 'negative'}>{amount}</span><div><strong>{label}</strong><small>{date}</small></div><ChevronRight size={15} /></div>)}</div>
  </div>
}

function ProfileView({ theme }: { theme: Theme }) {
  return <div className="cube-page"><PageIntro eyebrow="You" title="Make your corner of campus yours." subtitle="Academic identity, contribution history and the little settings that keep everything tidy." />
    <div className="cube-profile-hero"><div className="cube-avatar"><span>AS</span><i /></div><div><h2>Atharv</h2><p>CSE · 2nd Year · Semester 3 · Set A</p><span className="cube-profile-tag">RGPV · LNCT</span></div><button className="cube-icon-button" aria-label="Settings"><Settings2 size={18} /></button></div>
    <div className="cube-profile-grid"><div className="cube-profile-stat"><BookOpen size={18} /><strong>24</strong><span>resources</span></div><div className="cube-profile-stat"><Users size={18} /><strong>11</strong><span>requests helped</span></div><div className="cube-profile-stat"><Heart size={18} /><strong>18</strong><span>saved</span></div><div className="cube-profile-stat"><Trophy size={18} /><strong>7</strong><span>day streak</span></div></div>
    <div className="cube-large-card cube-profile-theme-card"><span className="cube-kicker">Current visual style</span><h3>{theme.name}</h3><p>Five complete visual themes share the same interaction language, so the product can change personality without breaking hierarchy.</p></div>
  </div>
}

function PageIntro({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return <div className="cube-page-intro"><span className="cube-kicker">{eyebrow}</span><h1>{title}</h1><p>{subtitle}</p></div>
}

function SectionHeading({ eyebrow, title, action, onClick }: { eyebrow: string; title: string; action?: string; onClick?: () => void }) {
  return <div className="cube-section-heading"><div><span className="cube-kicker">{eyebrow}</span><h2>{title}</h2></div>{action && <button onClick={onClick}>{action} <ArrowUpRight size={14} /></button>}</div>
}

function ResourceCard({ resource, saved, liked, onSave, onLike, index, large = false }: {
  resource: (typeof resources)[number]; saved: boolean; liked: boolean; onSave: () => void; onLike: () => void; index: number; large?: boolean
}) {
  return <motion.article className={cn('cube-resource-card', large && 'is-large')} whileHover={{ y: -4, rotate: index % 2 ? -.35 : .35 }} whileTap={{ scale: .985 }} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .12 }} transition={{ delay: index * .06, duration: .38 }}>
    <div className={`cube-resource-art art-${resource.tone}`}><FileText size={30} /><span>{String(index + 1).padStart(2,'0')}</span></div>
    <div className="cube-resource-body"><div className="cube-resource-topline"><span>{resource.tag}</span><span>{resource.meta}</span></div><h3>{resource.title}</h3><p>{resource.subject}</p><div className="cube-resource-bottom"><span className="cube-resource-votes"><button onClick={onLike} className={liked ? 'is-liked' : ''} aria-label="Like resource"><Heart size={15} fill={liked ? 'currentColor' : 'none'} /></button>{resource.votes + (liked ? 1 : 0)}</span><span className="cube-resource-uploader">shared by Aanya</span><button onClick={onSave} className={saved ? 'is-saved' : ''} aria-label="Save resource"><Bookmark size={16} fill={saved ? 'currentColor' : 'none'} /></button><button className="cube-download" aria-label="Download resource"><Download size={16} /></button></div></div>
  </motion.article>
}
