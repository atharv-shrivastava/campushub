import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Bell,
  BookOpen,
  Bookmark,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  Code2,
  Coffee,
  Compass,
  Download,
  ExternalLink,
  FileText,
  Flame,
  Gamepad2,
  GraduationCap,
  Heart,
  Home,
  MapPin,
  Megaphone,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Palette,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Ticket,
  TrendingUp,
  Trophy,
  Users,
  X,
} from "lucide-react";

const navigation = [
  { label: "Home", icon: Home },
  { label: "Communities", icon: Users, badge: "4" },
  { label: "Marketplace", icon: ShoppingBag },
  { label: "Ticket Exchange", icon: Ticket },
  { label: "Clubs", icon: ShieldCheck },
  { label: "Events", icon: CalendarDays },
  { label: "Resources", icon: BookOpen },
  { label: "Business Hub", icon: Building2 },
  { label: "Karma & Rewards", icon: Trophy },
];

const communities = [
  { name: "Programming", members: "1.2k", icon: Code2, color: "violet" },
  { name: "Creative Corner", members: "486", icon: Palette, color: "rose" },
  { name: "Gaming Lounge", members: "328", icon: Gamepad2, color: "blue" },
];

const promotions = [
  {
    id: 1,
    business: "Bean Theory",
    category: "CAFÉ · NEAR CAMPUS",
    offer: "Your 2 PM coffee break, sorted.",
    detail: "Flat 20% off for students this week.",
    code: "CAMPUS20",
    tone: "coffee",
    icon: Coffee,
  },
  {
    id: 2,
    business: "PrintLab",
    category: "PRINT & STATIONERY",
    offer: "Notes to paper. Without the queue.",
    detail: "Special rates on bulk notes and spiral binding.",
    code: "STUDENT10",
    tone: "print",
    icon: FileText,
  },
  {
    id: 3,
    business: "The Lunch Box",
    category: "FOOD · TIFFIN",
    offer: "A better lunch between lectures.",
    detail: "Student meal combos from ₹79.",
    code: "LUNCH79",
    tone: "lunch",
    icon: GraduationCap,
  },
];

const resources = [
  { id: 1, title: "Data Structures — Complete Notes", code: "CS201", semester: "Sem 2", set: "Set A", type: "NOTES", pages: "42 pages", time: "18 min ago" },
  { id: 2, title: "Engineering Mathematics II — PYQ", code: "MA202", semester: "Sem 2", set: "Set A", type: "PREVIOUS YEAR", pages: "8 pages", time: "1 hr ago" },
  { id: 3, title: "Object Oriented Programming Lab", code: "CS204", semester: "Sem 2", set: "Set B", type: "PRACTICAL", pages: "26 pages", time: "3 hrs ago" },
  { id: 4, title: "Basic Electronics Assignment 3", code: "EC203", semester: "Sem 2", set: "Set A", type: "ASSIGNMENT", pages: "5 pages", time: "Yesterday" },
];

const events = [
  { id: 1, title: "CodeSprint 2026", host: "LNCT Coding Club", date: "07 NOV", time: "9:30 AM", venue: "Innovation Lab", tone: "event-violet", tag: "HACKATHON", mark: "CS" },
  { id: 2, title: "Canvas After Class", host: "Art & Design Society", date: "12 NOV", time: "4:00 PM", venue: "Open Air Theatre", tone: "event-orange", tag: "CREATIVE", mark: "✳" },
  { id: 3, title: "Campus Culture Night", host: "Cultural Council", date: "18 NOV", time: "6:30 PM", venue: "Main Auditorium", tone: "event-blue", tag: "CULTURAL", mark: "CN" },
  { id: 4, title: "Build in Public", host: "Entrepreneurship Cell", date: "22 NOV", time: "2:00 PM", venue: "Seminar Hall 2", tone: "event-green", tag: "WORKSHOP", mark: "BP" },
];

const discussions = [
  {
    id: 1,
    community: "Programming",
    initials: "AK",
    author: "Aarav K.",
    time: "24 min ago",
    title: "What are you building for your first serious portfolio project?",
    body: "Trying to move beyond tutorial projects. Curious what everyone is working on and what problem it solves.",
    replies: 28,
    votes: 64,
    tag: "DISCUSSION",
    tone: "avatar-violet",
  },
  {
    id: 2,
    community: "Semester 2 · CSE",
    initials: "SR",
    author: "Sana R.",
    time: "1 hr ago",
    title: "Can someone explain the intuition behind a circular linked list?",
    body: "I understand the implementation, but I'm still confused about where it is actually useful compared with a normal linked list.",
    replies: 12,
    votes: 31,
    tag: "QUESTION",
    tone: "avatar-rose",
  },
];

const communityShortcuts = [
  { name: "Programming", icon: Code2, count: "1.2k members", tone: "violet" },
  { name: "Placements", icon: GraduationCap, count: "892 members", tone: "blue" },
  { name: "Poetry & Art", icon: Palette, count: "486 members", tone: "rose" },
  { name: "Gaming", icon: Gamepad2, count: "328 members", tone: "green" },
  { name: "Entrepreneurship", icon: TrendingUp, count: "214 members", tone: "orange" },
];

function SectionHeading({ eyebrow, title, action = "View all", onAction }) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h2>{title}</h2>
      </div>
      {action && (
        <button className="text-action" onClick={onAction}>
          {action}<ArrowUpRight size={15} />
        </button>
      )}
    </div>
  );
}

function PromoCard({ item, onOpen }) {
  const Icon = item.icon;
  return (
    <article className={"promo-card promo-" + item.tone}>
      <div className="promo-topline">
        <span className="sponsored-pill"><Sparkles size={11} /> SPONSORED</span>
        <button className="icon-button promo-menu" aria-label="More promotion options"><MoreHorizontal size={18} /></button>
      </div>
      <div className="promo-illustration">
        <div className="promo-orbit orbit-one" />
        <div className="promo-orbit orbit-two" />
        <div className="promo-icon-tile"><Icon size={31} strokeWidth={1.8} /></div>
        <span className="promo-sticker">{item.code}</span>
      </div>
      <div className="promo-copy">
        <div className="promo-category">{item.category}</div>
        <h3>{item.offer}</h3>
        <p>{item.detail}</p>
      </div>
      <div className="promo-bottom">
        <div className="business-name"><span className="business-avatar">{item.business.slice(0, 1)}</span>{item.business}</div>
        <button className="promo-cta" onClick={onOpen}>Explore <ArrowUpRight size={14} /></button>
      </div>
    </article>
  );
}

function ResourceCard({ item, onOpen }) {
  return (
    <article className="resource-card">
      <div className="resource-card-top">
        <div className="pdf-icon"><FileText size={22} /></div>
        <button className="icon-button subtle-button" aria-label="Save resource"><Bookmark size={16} /></button>
      </div>
      <div className="resource-type">{item.type}</div>
      <h3>{item.title}</h3>
      <div className="resource-code">{item.code}<span />{item.semester}<span />{item.set}</div>
      <div className="resource-card-bottom">
        <span><Clock3 size={13} />{item.time}</span>
        <button className="download-button" onClick={onOpen}><Download size={14} /> Open</button>
      </div>
    </article>
  );
}

function EventCard({ item, onOpen }) {
  return (
    <article className="event-card">
      <div className={"event-cover " + item.tone}>
        <span className="event-tag">{item.tag}</span>
        <span className="event-cover-mark">{item.mark}</span>
        <div className="event-cover-footer"><span>ON CAMPUS</span><span>2026</span></div>
      </div>
      <div className="event-card-body">
        <div className="event-date-line"><CalendarDays size={13} />{item.date}<span className="event-time">{item.time}</span></div>
        <h3>{item.title}</h3>
        <div className="event-host">{item.host}</div>
        <div className="event-card-footer">
          <span><MapPin size={13} />{item.venue}</span>
          <button className="round-arrow" onClick={onOpen} aria-label={"View " + item.title}><ArrowUpRight size={16} /></button>
        </div>
      </div>
    </article>
  );
}

function DiscussionCard({ item, onOpen }) {
  return (
    <article className="discussion-card">
      <div className="discussion-meta">
        <span className={"avatar " + item.tone}>{item.initials}</span>
        <div className="author-meta">
          <strong>{item.author}</strong>
          <span>in <b>{item.community}</b> · {item.time}</span>
        </div>
        <span className={"post-type " + (item.tag === "QUESTION" ? "question-type" : "")}>{item.tag}</span>
        <button className="icon-button subtle-button" aria-label="More post options"><MoreHorizontal size={18} /></button>
      </div>
      <button className="discussion-content" onClick={onOpen}>
        <h3>{item.title}</h3>
        <p>{item.body}</p>
      </button>
      <div className="discussion-actions">
        <button className="discussion-action"><TrendingUp size={15} />{item.votes} useful</button>
        <button className="discussion-action"><MessageCircle size={15} />{item.replies} replies</button>
        <button className="discussion-action"><Bookmark size={15} />Save</button>
        <button className="discussion-share"><ArrowUpRight size={15} />Open discussion</button>
      </div>
    </article>
  );
}

function App() {
  const [activeNav, setActiveNav] = useState("Home");
  const [query, setQuery] = useState("");
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [activeConversationTab, setActiveConversationTab] = useState("For you");

  const filteredResources = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return resources;
    return resources.filter((item) => (item.title + " " + item.code + " " + item.type).toLowerCase().includes(term));
  }, [query]);

  const showToast = (message) => {
    setToast(message);
    window.clearTimeout(window.__campusToastTimer);
    window.__campusToastTimer = window.setTimeout(() => setToast(""), 2600);
  };

  const selectNav = (label) => {
    setActiveNav(label);
    setMobileMenuOpen(false);
    if (label !== "Home") showToast(label + " is in the CampusHub build sequence.");
  };

  const handleCardAction = (label) => showToast(label + " preview opened. Connect this to live data next.");

  const activeItem = navigation.find((item) => item.label === activeNav) || navigation[0];
  const ActiveIcon = activeItem.icon;

  return (
    <div className="app-shell">
      <aside className={"sidebar " + (mobileMenuOpen ? "sidebar-open" : "")}>
        <div className="brand-row">
          <div className="brand-mark"><Sparkles size={21} /></div>
          <div className="brand-wordmark">campus<span>hub</span><sup>●</sup></div>
          <button className="icon-button sidebar-close" onClick={() => setMobileMenuOpen(false)} aria-label="Close navigation"><X size={18} /></button>
        </div>

        <button className="campus-switcher" onClick={() => showToast("College switching will be available when multi-college support is connected.")}>
          <div className="campus-emblem">L</div>
          <div className="campus-switcher-copy"><strong>LNCT Bhopal</strong><span>Student community</span></div>
          <ChevronDown size={15} />
        </button>

        <div className="sidebar-label">YOUR CAMPUS</div>
        <nav className="primary-navigation" aria-label="Main navigation">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.label} className={"nav-item " + (activeNav === item.label ? "nav-active" : "")} onClick={() => selectNav(item.label)}>
                <Icon size={18} strokeWidth={activeNav === item.label ? 2.3 : 1.8} />
                <span>{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-divider" />
        <div className="sidebar-section-heading"><span>YOUR COMMUNITIES</span><button className="tiny-add" onClick={() => showToast("Community creation will be connected in the Communities module.")} aria-label="Add community"><Plus size={15} /></button></div>
        <div className="community-mini-list">
          {communities.map((community) => {
            const Icon = community.icon;
            return (
              <button key={community.name} className="community-mini" onClick={() => selectNav("Communities")}>
                <span className={"community-mini-icon " + community.color}><Icon size={14} /></span>
                <span className="community-mini-name">{community.name}</span>
                <span className="community-mini-count">{community.members}</span>
              </button>
            );
          })}
        </div>

        <div className="sidebar-spacer" />
        <div className="sidebar-footer-card">
          <div className="sidebar-footer-icon"><Trophy size={17} /></div>
          <div><strong>Keep your streak going</strong><span>You're 20 karma from Contributor.</span></div>
          <ChevronRight size={15} />
        </div>
        <button className="profile-mini" onClick={() => showToast("Profile preview will open here.")}>
          <span className="profile-avatar">AS</span>
          <span className="profile-mini-copy"><strong>Atharv S.</strong><small>Newcomer · 30 karma</small></span>
          <MoreHorizontal size={18} />
        </button>
      </aside>

      {mobileMenuOpen && <button className="mobile-scrim" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu" />}

      <div className="main-panel">
        <header className="topbar">
          <button className="icon-button mobile-menu-button" onClick={() => setMobileMenuOpen(true)} aria-label="Open navigation"><Menu size={20} /></button>
          <div className="breadcrumb"><span>LNCT Bhopal</span><ChevronRight size={14} /><strong>{activeNav}</strong></div>
          <div className="topbar-actions">
            <label className="global-search">
              <Search size={17} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search CampusHub..." aria-label="Search CampusHub" />
              <kbd>⌘ K</kbd>
            </label>
            <div className="notification-wrap">
              <button className={"icon-button notification-button " + (noticeOpen ? "is-open" : "")} onClick={() => setNoticeOpen(!noticeOpen)} aria-label="Notifications">
                <Bell size={19} /><span className="notification-dot" />
              </button>
              {noticeOpen && (
                <div className="notification-popover">
                  <div className="popover-heading"><strong>Notifications</strong><button onClick={() => setNoticeOpen(false)}><X size={15} /></button></div>
                  <div className="notification-item"><span className="notification-icon violet"><MessageCircle size={15} /></span><div><strong>New reply in Programming</strong><p>Aarav replied to your discussion.</p><small>12 min ago</small></div></div>
                  <div className="notification-item"><span className="notification-icon amber"><Trophy size={15} /></span><div><strong>You're close to Contributor</strong><p>Earn 20 more karma to reach the next level.</p><small>Yesterday</small></div></div>
                </div>
              )}
            </div>
            <button className="top-profile" onClick={() => showToast("Profile preview will open here.")}><span className="profile-avatar">AS</span><ChevronDown size={14} /></button>
          </div>
        </header>

        <main className="page-content">
          {activeNav === "Home" ? (
            <>
              <section className="welcome-row">
                <div>
                  <div className="welcome-kicker"><span className="online-dot" /> YOUR CAMPUS, CONNECTED</div>
                  <h1>Good evening, Atharv <span className="wave">✳</span></h1>
                  <p>Pick up where your campus is happening.</p>
                </div>
                <button className="create-button" onClick={() => setCreateOpen(true)}><Plus size={17} />Create something</button>
              </section>

              <section className="content-section promotions-section">
                <SectionHeading eyebrow="BACKED BY LOCAL BUSINESSES" title="Good things around campus" action="All offers" onAction={() => selectNav("Business Hub")} />
                <div className="promo-rail">
                  {promotions.map((item) => <PromoCard key={item.id} item={item} onOpen={() => handleCardAction(item.business)} />)}
                </div>
              </section>

              <section className="community-discovery-strip">
                <div className="community-strip-title"><div><span className="eyebrow">FIND YOUR PEOPLE</span><strong>Jump into a community</strong></div><button className="text-action" onClick={() => selectNav("Communities")}>Explore all <ArrowUpRight size={14} /></button></div>
                <div className="community-chip-rail">
                  {communityShortcuts.map((item) => {
                    const Icon = item.icon;
                    return <button key={item.name} className="community-chip" onClick={() => selectNav("Communities")}><span className={"community-chip-icon " + item.tone}><Icon size={16} /></span><span className="community-chip-text"><strong>{item.name}</strong><small>{item.count}</small></span><ArrowUpRight size={14} /></button>;
                  })}
                </div>
              </section>

              <section className="content-section">
                <SectionHeading eyebrow="FRESH OFF THE DRIVE" title="Recently uploaded resources" action="Browse resources" onAction={() => selectNav("Resources")} />
                {query && filteredResources.length === 0 ? (
                  <div className="empty-search"><Search size={18} /><span>No resources match “{query}”. Try a subject code.</span></div>
                ) : (
                  <div className="resource-rail">
                    {filteredResources.map((item) => <ResourceCard key={item.id} item={item} onOpen={() => handleCardAction(item.title)} />)}
                  </div>
                )}
              </section>

              <section className="content-section events-section">
                <SectionHeading eyebrow="MAKE SOME PLANS" title="Trending events" action="Explore events" onAction={() => selectNav("Events")} />
                <div className="event-rail">
                  {events.map((item) => <EventCard key={item.id} item={item} onOpen={() => handleCardAction(item.title)} />)}
                </div>
              </section>

              <div className="lower-content-grid">
                <section className="content-section conversations-section">
                  <SectionHeading eyebrow="THE CAMPUS CONVERSATION" title="What's happening" action={null} />
                  <div className="conversation-tabs">
                    {["For you", "Trending", "Latest"].map((tab) => <button key={tab} className={activeConversationTab === tab ? "conversation-tab active" : "conversation-tab"} onClick={() => setActiveConversationTab(tab)}>{tab}{tab === "Trending" && <Flame size={13} />}</button>)}
                    <button className="filter-button" onClick={() => selectNav("Communities")}><Compass size={14} /> Communities</button>
                  </div>
                  <div className="discussion-list">
                    {discussions.map((item) => <DiscussionCard key={item.id} item={item} onOpen={() => handleCardAction(item.title)} />)}
                  </div>
                  <button className="load-more-button" onClick={() => selectNav("Communities")}>Explore more conversations <ArrowUpRight size={15} /></button>
                </section>

                <aside className="right-rail">
                  <section className="side-panel karma-panel">
                    <div className="side-panel-heading"><span className="eyebrow">YOUR PROGRESS</span><Trophy size={17} /></div>
                    <div className="karma-score-row"><strong>30</strong><span>karma points</span></div>
                    <div className="karma-progress-track"><span /></div>
                    <div className="karma-progress-label"><span>Newcomer</span><strong>20 pts to Contributor</strong></div>
                    <button className="side-panel-link" onClick={() => selectNav("Karma & Rewards")}>View your rewards <ArrowUpRight size={14} /></button>
                  </section>

                  <section className="side-panel popular-panel">
                    <div className="side-panel-heading"><span className="eyebrow">CAMPUS PULSE</span><TrendingUp size={17} /></div>
                    <h3>Communities on the move</h3>
                    {communities.map((item, index) => {
                      const Icon = item.icon;
                      return <button key={item.name} className="popular-community" onClick={() => selectNav("Communities")}><span className={"popular-community-icon " + item.color}><Icon size={15} /></span><span><strong>{item.name}</strong><small>{index === 0 ? "36 new discussions" : index === 1 ? "12 new discussions" : "8 new discussions"}</small></span><ChevronRight size={15} /></button>;
                    })}
                    <button className="side-panel-link" onClick={() => selectNav("Communities")}>Find your community <ArrowUpRight size={14} /></button>
                  </section>

                  <section className="side-panel mini-event-panel">
                    <div className="mini-event-icon"><CalendarDays size={18} /></div>
                    <div><span className="eyebrow">COMING UP NEXT</span><strong>CodeSprint 2026</strong><small>07 Nov · Innovation Lab</small></div>
                    <button className="mini-event-arrow" onClick={() => selectNav("Events")}><ArrowUpRight size={15} /></button>
                  </section>
                </aside>
              </div>

              <footer className="page-footer"><span>© 2026 CampusHub</span><span>Made for campus life <Heart size={12} /></span><button onClick={() => showToast("Help and feedback will be available here.")}>Help & feedback</button></footer>
            </>
          ) : (
            <section className="module-placeholder">
              <div className="module-placeholder-icon"><ActiveIcon size={27} /></div>
              <span className="eyebrow">CAMPUSHUB WORKSPACE</span>
              <h1>{activeNav}</h1>
              <p>This section is part of the CampusHub experience. The homepage and visual system are being established first; this workspace will connect to its own features next.</p>
              <button className="create-button" onClick={() => selectNav("Home")}>Back to Home <ArrowUpRight size={15} /></button>
            </section>
          )}
        </main>
      </div>

      {createOpen && (
        <div className="modal-backdrop" role="presentation" onClick={() => setCreateOpen(false)}>
          <div className="create-modal" role="dialog" aria-modal="true" aria-labelledby="create-title" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header"><div><span className="eyebrow">MAKE SOMETHING HAPPEN</span><h2 id="create-title">Create on CampusHub</h2></div><button className="icon-button" onClick={() => setCreateOpen(false)} aria-label="Close"><X size={18} /></button></div>
            <div className="create-options">
              {[["Start a discussion","Share an idea with your campus",MessageCircle],["Ask a question","Get help from your community",BookOpen],["Create a poll","Get your campus's take",TrendingUp],["Post a listing","Sell, rent or offer a service",ShoppingBag]].map(([title, description, Icon]) => <button key={title} className="create-option" onClick={() => { setCreateOpen(false); showToast(title + " will be available in the next build."); }}><span><Icon size={18} /></span><div><strong>{title}</strong><small>{description}</small></div><ChevronRight size={16} /></button>)}
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast-message"><Check size={16} />{toast}</div>}
    </div>
  );
}

export default App;
