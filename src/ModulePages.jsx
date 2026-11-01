import { useMemo, useState } from "react";
import {
  ArrowDownUp,
  ArrowUpRight,
  Bookmark,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  Code2,
  Compass,
  Download,
  FileText,
  Filter,
  Flame,
  Gamepad2,
  GraduationCap,
  Heart,
  MapPin,
  MessageCircle,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Star,
  Tag,
  Ticket,
  Trophy,
  Users,
  Wallet,
  X,
} from "lucide-react";

function PageIntro({ eyebrow, title, description, action, onAction }) {
  return (
    <div className="module-page-intro">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action && <button className="create-button" onClick={onAction}><Plus size={16} />{action}</button>}
    </div>
  );
}

function SearchBox({ value, onChange, placeholder = "Search..." }) {
  return (
    <label className="module-search">
      <Search size={16} />
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </label>
  );
}

function EmptyState({ title, detail }) {
  return <div className="module-empty"><Search size={20} /><strong>{title}</strong><span>{detail}</span></div>;
}

const communityData = [
  { id: 1, name: "Programming", description: "Build, debug and learn with people who love making things.", members: 1248, posts: 86, icon: Code2, tint: "violet", featured: true, channels: ["general", "cpp", "java", "web-development", "dsa", "resources"] },
  { id: 2, name: "Placements & Internships", description: "Prepare together, share openings and compare interview notes.", members: 892, posts: 41, icon: GraduationCap, tint: "blue", featured: true, channels: ["general", "interview-prep", "opportunities", "resume-review"] },
  { id: 3, name: "Creative Corner", description: "A home for poetry, photography, illustration and everything in between.", members: 486, posts: 23, icon: Heart, tint: "rose", featured: false, channels: ["general", "poetry", "visual-art", "photography"] },
  { id: 4, name: "Gaming Lounge", description: "Find teammates, talk games and organise campus tournaments.", members: 328, posts: 19, icon: Gamepad2, tint: "green", featured: false, channels: ["general", "looking-for-players", "tournaments"] },
  { id: 5, name: "Entrepreneurship Cell", description: "Ideas, early products, founder stories and campus ventures.", members: 214, posts: 14, icon: Sparkles, tint: "orange", featured: false, channels: ["general", "ideas", "build-in-public", "resources"] },
  { id: 6, name: "CSE Semester 2", description: "Coursework, labs, exam prep and questions for your semester.", members: 376, posts: 52, icon: BookOpen, tint: "cyan", featured: true, channels: ["general", "data-structures", "mathematics", "electronics"] },
];

const discussionsByChannel = {
  general: [
    { title: "What are you building outside the syllabus?", text: "Share a project you're working on and what you've learned so far.", author: "Aarav K.", time: "24 min ago", replies: 28, votes: 64, type: "DISCUSSION", initials: "AK" },
    { title: "A good resource for learning Git branches?", text: "I understand the basic commands, but I want to get comfortable with feature branches and PRs.", author: "Sana R.", time: "1 hr ago", replies: 12, votes: 31, type: "QUESTION", initials: "SR" },
  ],
  cpp: [
    { title: "When would you choose a linked list over a vector in practice?", text: "Looking for examples where the trade-offs actually matter, not just textbook definitions.", author: "Dev M.", time: "35 min ago", replies: 17, votes: 42, type: "QUESTION", initials: "DM" },
    { title: "A tiny C++ reference sheet for pointers and references", text: "Put together a one-page revision sheet. Suggestions and corrections are welcome.", author: "Nidhi P.", time: "2 hrs ago", replies: 9, votes: 27, type: "RESOURCE", initials: "NP" },
  ],
  java: [
    { title: "Java collections: what should I learn first?", text: "HashMap, ArrayList, Set... looking for a sensible order with practice problems.", author: "Rohan S.", time: "48 min ago", replies: 14, votes: 36, type: "QUESTION", initials: "RS" },
  ],
  "web-development": [
    { title: "Show us the UI you shipped this week", text: "A small weekly thread to share deployed pages and get constructive feedback.", author: "Meera J.", time: "18 min ago", replies: 21, votes: 53, type: "DISCUSSION", initials: "MJ" },
  ],
  dsa: [
    { title: "How do you decide which data structure fits a problem?", text: "I can solve basic questions, but choosing the approach quickly is still difficult.", author: "Kabir A.", time: "3 hrs ago", replies: 16, votes: 39, type: "QUESTION", initials: "KA" },
  ],
  resources: [
    { title: "Free algorithms visualiser for revision", text: "Found a useful visual tool for sorting and graph algorithms. Sharing it here.", author: "Ishita V.", time: "Yesterday", replies: 7, votes: 24, type: "RESOURCE", initials: "IV" },
  ],
};

const marketplaceListings = [
  { id: 1, title: "Engineering Drawing Set", category: "Buy & sell", price: "₹450", condition: "Good condition", seller: "Rishabh T.", initials: "RT", location: "Campus pickup", tone: "listing-blue", tag: "STUDY ESSENTIAL" },
  { id: 2, title: "Scientific Calculator FX-991ES", category: "Buy & sell", price: "₹650", condition: "Like new", seller: "Ananya M.", initials: "AM", location: "LNCT Campus", tone: "listing-violet", tag: "POPULAR" },
  { id: 3, title: "DSA doubt-solving sessions", category: "Student services", price: "₹150 / session", condition: "Peer tutoring", seller: "Kunal P.", initials: "KP", location: "Online / Campus", tone: "listing-green", tag: "STUDENT SERVICE" },
  { id: 4, title: "Semester 2 mathematics textbook", category: "Rent", price: "₹80 / week", condition: "Used, readable", seller: "Priya S.", initials: "PS", location: "Campus pickup", tone: "listing-orange", tag: "RENTAL" },
  { id: 5, title: "Hostel desk lamp", category: "Free / giveaway", price: "Free", condition: "Working", seller: "Yash V.", initials: "YV", location: "Near main gate", tone: "listing-rose", tag: "FREE" },
];

const clubData = [
  { name: "LNCT Coding Club", category: "TECHNICAL", description: "Learn by building. Workshops, peer sessions and coding challenges.", members: "1.8k followers", next: "CodeSprint 2026", tint: "violet", initials: "</>" },
  { name: "Art & Design Society", category: "CREATIVE", description: "A space for illustrators, photographers and visual storytellers.", members: "640 followers", next: "Canvas After Class", tint: "rose", initials: "✳" },
  { name: "Entrepreneurship Cell", category: "STARTUP", description: "Connect ideas with people, mentors and opportunities to build.", members: "520 followers", next: "Build in Public", tint: "orange", initials: "E" },
  { name: "Literary & Debate Club", category: "LITERARY", description: "Debates, writing circles, open mics and thoughtful conversations.", members: "410 followers", next: "Open Mic Friday", tint: "blue", initials: "L" },
];

const eventData = [
  { title: "CodeSprint 2026", host: "LNCT Coding Club", date: "07 Nov", time: "9:30 AM", venue: "Innovation Lab", category: "Hackathon", tone: "event-violet", mark: "CS", status: "Registration open" },
  { title: "Canvas After Class", host: "Art & Design Society", date: "12 Nov", time: "4:00 PM", venue: "Open Air Theatre", category: "Creative", tone: "event-orange", mark: "✳", status: "Free entry" },
  { title: "Campus Culture Night", host: "Cultural Council", date: "18 Nov", time: "6:30 PM", venue: "Main Auditorium", category: "Cultural", tone: "event-blue", mark: "CN", status: "Limited seats" },
  { title: "Build in Public", host: "Entrepreneurship Cell", date: "22 Nov", time: "2:00 PM", venue: "Seminar Hall 2", category: "Workshop", tone: "event-green", mark: "BP", status: "Registration open" },
  { title: "Open Mic Friday", host: "Literary & Debate Club", date: "27 Nov", time: "5:00 PM", venue: "Amphitheatre", category: "Literary", tone: "event-violet", mark: "OM", status: "Free entry" },
];

const resourceData = [
  { title: "Data Structures — Complete Notes", code: "CS201", branch: "CSE", semester: "Semester 2", set: "Set A", type: "Notes", pages: "42 pages", uploaded: "18 min ago", initials: "AK" },
  { title: "Engineering Mathematics II — PYQ", code: "MA202", branch: "CSE", semester: "Semester 2", set: "Set A", type: "Previous year", pages: "8 pages", uploaded: "1 hr ago", initials: "SR" },
  { title: "OOP Lab Practical File", code: "CS204", branch: "CSE", semester: "Semester 2", set: "Set B", type: "Practicals", pages: "26 pages", uploaded: "3 hrs ago", initials: "VP" },
  { title: "Basic Electronics Assignment 3", code: "EC203", branch: "CSE", semester: "Semester 2", set: "Set A", type: "Assignments", pages: "5 pages", uploaded: "Yesterday", initials: "NK" },
  { title: "Engineering Chemistry Notes", code: "CY201", branch: "ECE", semester: "Semester 2", set: "Set C", type: "Notes", pages: "31 pages", uploaded: "Yesterday", initials: "PM" },
  { title: "Programming in C — Unit 4", code: "CS105", branch: "IT", semester: "Semester 1", set: "Set B", type: "Notes", pages: "18 pages", uploaded: "2 days ago", initials: "AS" },
];

const businessData = [
  { name: "Bean Theory", category: "Cafés & food", rating: "4.6", reviews: 128, offer: "20% student discount", distance: "0.8 km from campus", tint: "coffee", initial: "B", sponsored: true },
  { name: "PrintLab", category: "Print & stationery", rating: "4.4", reviews: 86, offer: "Bulk notes from ₹1/page", distance: "Near Gate 2", tint: "print", initial: "P", sponsored: true },
  { name: "The Lunch Box", category: "Tiffin & meals", rating: "4.3", reviews: 74, offer: "Student meals from ₹79", distance: "1.1 km from campus", tint: "lunch", initial: "L", sponsored: false },
  { name: "FixPoint Laptop Care", category: "Repairs & services", rating: "4.7", reviews: 52, offer: "Free diagnosis for students", distance: "1.4 km from campus", tint: "repair", initial: "F", sponsored: false },
];

function CommunityDiscussion({ item }) {
  return (
    <article className="community-discussion-card">
      <div className="community-discussion-top">
        <span className="discussion-initials">{item.initials}</span>
        <div className="community-discussion-author"><strong>{item.author}</strong><small>{item.time}</small></div>
        <span className={"discussion-kind " + (item.type === "QUESTION" ? "kind-question" : "")}>{item.type}</span>
      </div>
      <h3>{item.title}</h3>
      <p>{item.text}</p>
      <div className="community-discussion-actions"><span><TrendingIcon />{item.votes} useful</span><span><MessageCircle size={14} />{item.replies} answers</span><button>Open discussion <ArrowUpRight size={14} /></button></div>
    </article>
  );
}

function TrendingIcon() {
  return <ArrowDownUp size={14} />;
}

export function CommunitiesPage() {
  const [tab, setTab] = useState("My communities");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(1);
  const [channel, setChannel] = useState("general");
  const [joined, setJoined] = useState([1, 2, 6]);
  const selected = communityData.find((item) => item.id === selectedId) || communityData[0];
  const visible = useMemo(() => communityData.filter((item) => {
    const matches = (item.name + " " + item.description).toLowerCase().includes(search.toLowerCase());
    return matches && (tab !== "My communities" || joined.includes(item.id));
  }), [search, tab, joined]);
  const discussions = discussionsByChannel[channel] || discussionsByChannel.general;

  const toggleJoin = (id) => setJoined((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]);

  return (
    <div className="module-page">
      <PageIntro eyebrow="FIND YOUR PEOPLE" title="Communities" description="Join conversations around what you study, build and love." action="Create community" onAction={() => alert("Community creation form will be connected here.")} />
      <div className="community-feature-banner">
        <div className="community-banner-copy"><span className="eyebrow">YOUR CAMPUS, YOUR CORNER</span><h2>Good conversations<br />start with shared interests.</h2><p>Follow communities, explore channels and learn from people across campus.</p><div className="banner-stats"><span><strong>24</strong> communities</span><span><strong>3.8k</strong> members</span><span><strong>126</strong> new discussions this week</span></div></div>
        <div className="community-banner-art"><div className="banner-orbit" /><div className="banner-bubble bubble-one"><Code2 size={24} /></div><div className="banner-bubble bubble-two"><MessageCircle size={22} /></div><div className="banner-bubble bubble-three"><Sparkles size={21} /></div><div className="banner-center"><Users size={35} /></div></div>
      </div>
      <div className="module-toolbar">
        <div className="module-tabs">{["My communities", "Discover", "Trending"].map((item) => <button key={item} className={tab === item ? "module-tab active" : "module-tab"} onClick={() => setTab(item)}>{item}</button>)}</div>
        <SearchBox value={search} onChange={setSearch} placeholder="Find a community..." />
      </div>
      <div className="communities-layout">
        <section className="community-directory">
          <div className="module-subheading"><strong>{tab}</strong><span>{visible.length} communities</span></div>
          {visible.length === 0 ? <EmptyState title="No communities found" detail="Try another name or explore all communities." /> : visible.map((item) => {
            const Icon = item.icon;
            const isJoined = joined.includes(item.id);
            return <button key={item.id} className={"community-directory-card " + (selectedId === item.id ? "selected" : "")} onClick={() => { setSelectedId(item.id); setChannel("general"); }}>
              <span className={"community-large-icon tint-" + item.tint}><Icon size={21} /></span>
              <span className="community-directory-copy"><strong>{item.name}</strong><small>{item.description}</small><span className="community-counts"><Users size={12} />{item.members.toLocaleString()} members <i />{item.posts} new posts</span></span>
              <span className="community-card-action" onClick={(event) => { event.stopPropagation(); toggleJoin(item.id); }}>{isJoined ? <Check size={15} /> : <Plus size={15} />}{isJoined ? "Joined" : "Join"}</span>
            </button>;
          })}
        </section>
        <section className="community-board">
          <div className="community-board-header">
            <div className={"community-large-icon tint-" + selected.tint}><selected.icon size={22} /></div>
            <div><span className="eyebrow">COMMUNITY BOARD</span><h2>{selected.name}</h2><p>{selected.members.toLocaleString()} members · {selected.description}</p></div>
            <button className="board-more"><Bookmark size={16} /></button>
          </div>
          <div className="channel-bar"><strong>CHANNELS</strong><div className="channel-scroll">{selected.channels.map((item) => <button key={item} className={channel === item ? "channel-pill active" : "channel-pill"} onClick={() => setChannel(item)}><span>#</span>{item.replaceAll("-", " ")}</button>)}</div></div>
          <div className="board-feed-heading"><div><span className="eyebrow">DISCUSSION BOARD</span><h3># {channel.replaceAll("-", " ")}</h3></div><button className="small-primary"><Plus size={14} />Start a discussion</button></div>
          <div className="community-discussions">{discussions.map((item, index) => <CommunityDiscussion item={item} key={item.title + index} />)}</div>
          <button className="board-load-more">Explore more discussions <ArrowUpRight size={14} /></button>
        </section>
      </div>
    </div>
  );
}

const marketTabs = ["All listings", "Buy & sell", "Rent", "Student services", "Free / giveaway"];

export function MarketplacePage() {
  const [tab, setTab] = useState("All listings");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Recently added");
  const visible = useMemo(() => marketplaceListings.filter((item) => (tab === "All listings" || item.category === tab) && (item.title + " " + item.category + " " + item.seller).toLowerCase().includes(search.toLowerCase())), [tab, search]);
  return (
    <div className="module-page">
      <PageIntro eyebrow="STUDENT TO STUDENT" title="Marketplace" description="Find useful things, pass them on, or offer a skill to your campus." action="Post a listing" onAction={() => alert("Listing form will be connected here.")} />
      <div className="marketplace-highlight"><div className="highlight-icon"><ShoppingBag size={25} /></div><div><strong>A little something for your next semester.</strong><span>Buy, sell, rent or give away things within your college community.</span></div><div className="highlight-tags"><span>NO PLATFORM FEE</span><span>STUDENT LISTINGS</span></div></div>
      <div className="module-toolbar marketplace-toolbar"><div className="module-tabs tab-scroll">{marketTabs.map((item) => <button key={item} className={tab === item ? "module-tab active" : "module-tab"} onClick={() => setTab(item)}>{item}</button>)}</div><SearchBox value={search} onChange={setSearch} placeholder="Search listings..." /></div>
      <div className="listing-toolbar-row"><span>{visible.length} listings around your campus</span><label><SlidersHorizontal size={14} /><select value={sort} onChange={(event) => setSort(event.target.value)}><option>Recently added</option><option>Price: low to high</option><option>Price: high to low</option></select><ChevronDown size={13} /></label></div>
      {visible.length === 0 ? <EmptyState title="No listings found" detail="Try another search or switch the category." /> : <div className="marketplace-grid">{visible.map((item) => <article className="market-listing-card" key={item.id}><div className={"listing-visual " + item.tone}><span className="listing-tag">{item.tag}</span><div className="listing-placeholder-icon">{item.category === "Student services" ? <GraduationCap size={37} /> : item.category === "Rent" ? <BookOpen size={37} /> : <ShoppingBag size={37} />}</div><button className="listing-save"><Heart size={16} /></button></div><div className="market-listing-body"><div className="listing-category">{item.category}</div><h3>{item.title}</h3><div className="listing-price">{item.price}</div><div className="listing-condition">{item.condition}</div><div className="listing-seller"><span className="seller-avatar">{item.initials}</span><span><strong>{item.seller}</strong><small><MapPin size={11} />{item.location}</small></span><button className="contact-seller" onClick={() => alert("Seller contact details will be connected here.")}>Contact</button></div></div></article>)}</div>}
      <p className="module-disclaimer">CampusHub connects students through listings. Buyers and sellers arrange and verify their own exchanges.</p>
    </div>
  );
}

const ticketListings = [
  { title: "College Fest — Pro Pass", event: "Campus Culture Night", date: "18 Nov 2026", type: "Event ticket", price: "₹350", seller: "Mihir P.", initials: "MP", tone: "event-orange", note: "Transfer permitted by organiser" },
  { title: "Tech Summit Entry", event: "Central India Tech Summit", date: "14 Nov 2026", type: "Event ticket", price: "₹200", seller: "Ira S.", initials: "IS", tone: "event-blue", note: "Digital ticket transfer" },
  { title: "Stand-up Night — General", event: "Laugh Track Live", date: "21 Nov 2026", type: "Event ticket", price: "₹499", seller: "Dev A.", initials: "DA", tone: "event-violet", note: "Check organiser's transfer policy" },
];

export function TicketExchangePage() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("All tickets");
  const visible = ticketListings.filter((item) => (item.title + item.event + item.type).toLowerCase().includes(search.toLowerCase()) && (tab === "All tickets" || item.type === tab));
  return (
    <div className="module-page">
      <PageIntro eyebrow="PASS IT ON" title="Ticket Exchange" description="Discover event tickets listed by other students in your college." action="List a ticket" onAction={() => alert("Ticket listing form will be connected here.")} />
      <div className="ticket-note"><Ticket size={20} /><div><strong>Student-listed tickets</strong><span>Listings are provided by students. Check the event organiser's transfer rules and details directly with the seller.</span></div><ShieldCheck size={17} /></div>
      <div className="module-toolbar"><div className="module-tabs">{["All tickets", "Event ticket"].map((item) => <button key={item} className={tab === item ? "module-tab active" : "module-tab"} onClick={() => setTab(item)}>{item}</button>)}</div><SearchBox value={search} onChange={setSearch} placeholder="Search event tickets..." /></div>
      <div className="listing-toolbar-row"><span>{visible.length} student listings</span><span className="sort-note"><ArrowDownUp size={13} /> Recently listed</span></div>
      <div className="ticket-list">{visible.map((item) => <article className="ticket-list-card" key={item.title}><div className={"ticket-art " + item.tone}><Ticket size={31} /><span>ADMIT<br />ONE</span></div><div className="ticket-info"><span className="listing-category">{item.type}</span><h3>{item.title}</h3><strong>{item.event}</strong><small><CalendarDays size={12} />{item.date}</small><small><Check size={12} />{item.note}</small></div><div className="ticket-list-side"><strong>{item.price}</strong><span className="ticket-seller">Listed by {item.seller}</span><button className="small-primary" onClick={() => alert("Seller contact will be connected here.")}>Contact seller <ArrowUpRight size={14} /></button></div></article>)}</div>
      <p className="module-disclaimer">CampusHub provides the listing and discovery space only. It does not verify ticket validity, process payments or guarantee transfers.</p>
    </div>
  );
}

export function ClubsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All clubs");
  const categories = ["All clubs", "Technical", "Creative", "Startup", "Literary"];
  const visible = clubData.filter((club) => (filter === "All clubs" || club.category.toLowerCase() === filter.toLowerCase()) && (club.name + club.description).toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="module-page">
      <PageIntro eyebrow="THE PEOPLE BEHIND CAMPUS LIFE" title="Clubs" description="Discover the groups creating things, hosting events and bringing students together." />
      <div className="club-feature"><div className="club-feature-copy"><span className="eyebrow">GET INVOLVED</span><h2>Your next favourite<br />thing might be a club.</h2><p>Explore student communities beyond your classroom. Follow a club to keep up with what they're doing.</p><button className="light-button" onClick={() => alert("Club submission details will be connected here.")}>Add a club <ArrowUpRight size={14} /></button></div><div className="club-feature-art"><div className="club-art-circle"><Users size={53} /></div><span className="club-float float-a"><Code2 size={19} /></span><span className="club-float float-b"><Palette size={19} /></span><span className="club-float float-c"><Sparkles size={19} /></span></div></div>
      <div className="module-toolbar"><div className="module-tabs tab-scroll">{categories.map((item) => <button key={item} className={filter === item ? "module-tab active" : "module-tab"} onClick={() => setFilter(item)}>{item}</button>)}</div><SearchBox value={search} onChange={setSearch} placeholder="Search clubs..." /></div>
      <div className="club-grid">{visible.map((club) => <article className="club-card" key={club.name}><div className={"club-card-art club-art-" + club.tint}><span>{club.initials}</span><small>{club.category}</small></div><div className="club-card-body"><h3>{club.name}</h3><p>{club.description}</p><div className="club-followers"><Users size={13} />{club.members}</div><div className="club-next-event"><CalendarDays size={13} /><span>Next: <strong>{club.next}</strong></span></div><button className="club-follow-button" onClick={(event) => { const button = event.currentTarget; button.classList.toggle("following"); button.innerHTML = button.classList.contains("following") ? "Following ✓" : "Follow club +"; }}>{ "Follow club +" }</button></div></article>)}</div>
    </div>
  );
}

export function EventsPage() {
  const [filter, setFilter] = useState("All events");
  const [search, setSearch] = useState("");
  const filters = ["All events", "Hackathon", "Creative", "Cultural", "Workshop", "Literary"];
  const visible = eventData.filter((event) => (filter === "All events" || event.category === filter) && (event.title + event.host + event.venue).toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="module-page">
      <PageIntro eyebrow="MAKE SOME PLANS" title="Events around campus" description="Find what is happening, who's organising it and how to take part." />
      <div className="events-feature-banner"><div><span className="eyebrow">UP NEXT AT LNCT</span><h2>CodeSprint 2026</h2><p>A campus hackathon by LNCT Coding Club. Bring an idea, find a team and build something useful.</p><div className="featured-event-meta"><span><CalendarDays size={14} />07 November 2026</span><span><MapPin size={14} />Innovation Lab</span></div><button className="light-button" onClick={() => alert("Event details will be connected here.")}>View event <ArrowUpRight size={14} /></button></div><div className="events-banner-art"><span>CS</span><small>BUILD. BREAK. REPEAT.</small></div></div>
      <div className="module-toolbar"><div className="module-tabs tab-scroll">{filters.map((item) => <button key={item} className={filter === item ? "module-tab active" : "module-tab"} onClick={() => setFilter(item)}>{item}</button>)}</div><SearchBox value={search} onChange={setSearch} placeholder="Search events..." /></div>
      <div className="events-list-heading"><strong>Upcoming events</strong><span>{visible.length} events listed</span></div>
      <div className="events-list">{visible.map((event) => <article className="event-row-card" key={event.title}><div className={"event-row-poster " + event.tone}><span>{event.mark}</span></div><div className="event-row-info"><span className="listing-category">{event.category}</span><h3>{event.title}</h3><p>{event.host}</p><div className="event-row-meta"><span><CalendarDays size={13} />{event.date} · {event.time}</span><span><MapPin size={13} />{event.venue}</span></div></div><div className="event-row-action"><span className="event-status"><span />{event.status}</span><button className="small-primary" onClick={() => alert("Event page will be connected here.")}>View event <ArrowUpRight size={14} /></button></div></article>)}</div>
    </div>
  );
}

export function ResourcesPage() {
  const [branch, setBranch] = useState("CSE");
  const [semester, setSemester] = useState("Semester 2");
  const [set, setSet] = useState("Set A");
  const [subject, setSubject] = useState("All subject codes");
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All resources");
  const subjects = ["All subject codes", "CS201", "MA202", "CS204", "EC203"];
  const filtered = resourceData.filter((item) => item.branch === branch && item.semester === semester && item.set === set && (subject === "All subject codes" || item.code === subject) && (type === "All resources" || item.type === type) && (item.title + item.code).toLowerCase().includes(search.toLowerCase()));
  const updateBranch = (value) => { setBranch(value); setSubject("All subject codes"); };
  return (
    <div className="module-page">
      <PageIntro eyebrow="SHARED BY YOUR CAMPUS" title="Academic resources" description="Find notes, previous-year papers, assignments and practical files by your academic set." action="Upload resource" onAction={() => alert("Resource upload will be connected here.")} />
      <div className="resource-filter-panel"><div className="resource-filter-heading"><div><span className="eyebrow">YOUR ACADEMIC FILTERS</span><strong>Find material for your class</strong></div><button className="reset-filters" onClick={() => { setBranch("CSE"); setSemester("Semester 2"); setSet("Set A"); setSubject("All subject codes"); setType("All resources"); setSearch(""); }}>Reset filters</button></div><div className="resource-select-grid"><label><span>Branch</span><select value={branch} onChange={(event) => updateBranch(event.target.value)}><option>CSE</option><option>IT</option><option>ECE</option><option>Mechanical</option><option>Civil</option></select></label><label><span>Semester</span><select value={semester} onChange={(event) => setSemester(event.target.value)}><option>Semester 1</option><option>Semester 2</option><option>Semester 3</option><option>Semester 4</option></select></label><label><span>Set</span><select value={set} onChange={(event) => setSet(event.target.value)}><option>Set A</option><option>Set B</option><option>Set C</option></select></label><label><span>Subject code</span><select value={subject} onChange={(event) => setSubject(event.target.value)}>{subjects.map((item) => <option key={item}>{item}</option>)}</select></label></div></div>
      <div className="module-toolbar resource-toolbar"><div className="module-tabs tab-scroll">{["All resources", "Notes", "Previous year", "Assignments", "Practicals"].map((item) => <button key={item} className={type === item ? "module-tab active" : "module-tab"} onClick={() => setType(item)}>{item}</button>)}</div><SearchBox value={search} onChange={setSearch} placeholder="Search by title or subject code..." /></div>
      <div className="listing-toolbar-row"><span>{filtered.length} resources · {branch} · {semester} · {set}</span><span className="sort-note"><Clock3 size={13} /> Recently uploaded</span></div>
      {filtered.length === 0 ? <EmptyState title="No resources in this selection" detail="Try another subject code, set or resource type." /> : <div className="resource-results">{filtered.map((item) => <article className="resource-result-card" key={item.title}><div className="resource-result-icon"><FileText size={23} /></div><div className="resource-result-copy"><span className="listing-category">{item.type.toUpperCase()}</span><h3>{item.title}</h3><div className="resource-result-meta"><span>{item.code}</span><i />{item.branch}<i />{item.semester}<i />{item.set}</div><small>Uploaded by {item.initials} · {item.uploaded}</small></div><div className="resource-result-end"><span>{item.pages}</span><button className="small-primary" onClick={() => alert("PDF viewer/download will be connected here.")}><Download size={14} />Open PDF</button></div></article>)}</div>}
    </div>
  );
}

export function BusinessHubPage() {
  const [category, setCategory] = useState("All businesses");
  const [search, setSearch] = useState("");
  const categories = ["All businesses", "Cafés & food", "Print & stationery", "Tiffin & meals", "Repairs & services"];
  const visible = businessData.filter((item) => (category === "All businesses" || item.category === category) && (item.name + item.category + item.offer).toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="module-page">
      <PageIntro eyebrow="AROUND YOUR CAMPUS" title="Business Hub" description="Discover nearby places, student offers and services shared by local businesses." />
      <div className="business-feature-banner"><div><span className="eyebrow">CAMPUS PERKS</span><h2>Good deals, closer<br />than you think.</h2><p>Student discounts and useful local services, all in one place.</p><button className="light-button" onClick={() => setCategory("All businesses")}>Explore businesses <ArrowUpRight size={14} /></button></div><div className="business-feature-icons"><span><Coffee size={25} /></span><span><BookOpen size={24} /></span><span><Wallet size={25} /></span></div></div>
      <div className="module-toolbar"><div className="module-tabs tab-scroll">{categories.map((item) => <button key={item} className={category === item ? "module-tab active" : "module-tab"} onClick={() => setCategory(item)}>{item}</button>)}</div><SearchBox value={search} onChange={setSearch} placeholder="Search local businesses..." /></div>
      <div className="business-grid">{visible.map((item) => <article className="business-card" key={item.name}><div className={"business-card-cover cover-" + item.tint}><span className="business-card-logo">{item.initial}</span>{item.sponsored && <span className="sponsored-pill"><Sparkles size={11} />SPONSORED</span>}<span className="business-cover-deco"><Building2Icon /></span></div><div className="business-card-body"><span className="listing-category">{item.category}</span><h3>{item.name}</h3><div className="business-rating"><Star size={14} fill="currentColor" /><strong>{item.rating}</strong><span>({item.reviews} student ratings)</span></div><div className="business-offer"><Tag size={14} /><strong>{item.offer}</strong></div><div className="business-location"><MapPin size={13} />{item.distance}</div><button className="business-profile-button" onClick={() => alert("Business profile and reviews will be connected here.")}>View business <ArrowUpRight size={14} /></button></div></article>)}</div>
      <p className="module-disclaimer">Ratings are student-submitted. Sponsored placement does not affect a business's rating.</p>
    </div>
  );
}

function Building2Icon() {
  return <ShoppingBag size={58} />;
}

const rewards = [
  { name: "20% off at Bean Theory", partner: "Bean Theory Café", cost: 100, category: "FOOD & DRINK", tint: "reward-coffee" },
  { name: "₹30 off printing", partner: "PrintLab", cost: 75, category: "STUDY ESSENTIALS", tint: "reward-print" },
  { name: "Student meal combo", partner: "The Lunch Box", cost: 150, category: "FOOD & DRINK", tint: "reward-lunch" },
];

export function KarmaPage() {
  const [period, setPeriod] = useState("This month");
  const [redeemed, setRedeemed] = useState([]);
  const leaderboard = [{ name: "Meera J.", points: 680, initials: "MJ" }, { name: "Aarav K.", points: 540, initials: "AK" }, { name: "Sana R.", points: 420, initials: "SR" }, { name: "Atharv S.", points: 30, initials: "AS", self: true }];
  return (
    <div className="module-page">
      <PageIntro eyebrow="GOOD CONTRIBUTIONS ADD UP" title="Karma & rewards" description="Build your campus reputation by helping others and sharing useful things." />
      <div className="karma-overview-grid">
        <section className="karma-main-card"><div className="karma-main-top"><span className="eyebrow">YOUR CAMPUS KARMA</span><span className="karma-level"><Sparkles size={13} />NEWCOMER</span></div><div className="karma-big-number">30 <small>points</small></div><p>Every useful answer, approved resource and genuine contribution moves you forward.</p><div className="karma-large-track"><span /></div><div className="karma-large-label"><span>Newcomer · 0</span><strong>20 points to Contributor</strong><span>50</span></div><div className="karma-main-footer"><span><Trophy size={15} />Current level: <strong>Newcomer</strong></span><span><Star size={15} />1 badge earned</span></div></section>
        <section className="karma-how-card"><span className="eyebrow">HOW TO EARN</span><h2>Make campus better.<br />Earn as you go.</h2><div className="karma-earn-row"><span className="earn-icon"><MessageCircle size={16} /></span><span><strong>Helpful answer</strong><small>When your answer is marked helpful</small></span><b>+10</b></div><div className="karma-earn-row"><span className="earn-icon"><FileText size={16} /></span><span><strong>Approved resource</strong><small>Share useful academic material</small></span><b>+5</b></div><div className="karma-earn-row"><span className="earn-icon"><ShieldCheck size={16} /></span><span><strong>Genuine report</strong><small>When an issue report is accepted</small></span><b>+5</b></div></section>
      </div>
      <div className="karma-content-grid">
        <section className="karma-rewards-section"><div className="module-section-heading"><div><span className="eyebrow">PARTNER PERKS</span><h2>Rewards to unlock</h2></div><span className="points-available"><Sparkles size={13} />30 points available</span></div><div className="rewards-grid">{rewards.map((reward) => { const locked = reward.cost > 30; const isRedeemed = redeemed.includes(reward.name); return <article className="reward-card" key={reward.name}><div className={"reward-art " + reward.tint}><span>{reward.category}</span><Sparkles size={27} /></div><div className="reward-card-copy"><h3>{reward.name}</h3><p>{reward.partner}</p><div className="reward-card-bottom"><strong><Sparkles size={13} />{reward.cost} karma</strong><button disabled={locked || isRedeemed} onClick={() => setRedeemed((current) => [...current, reward.name])}>{isRedeemed ? "Unlocked" : locked ? "Locked" : "Redeem"}</button></div></div></article>; })}</div></section>
        <aside className="leaderboard-card"><div className="leaderboard-heading"><div><span className="eyebrow">CAMPUS-WIDE</span><h2>Leaderboard</h2></div><select value={period} onChange={(event) => setPeriod(event.target.value)}><option>This month</option><option>All time</option></select></div>{leaderboard.map((person, index) => <div className={"leaderboard-row " + (person.self ? "is-self" : "")} key={person.name}><span className={"leaderboard-rank rank-" + (index + 1)}>{index + 1}</span><span className="leaderboard-avatar">{person.initials}</span><strong>{person.name}{person.self && <small>YOU</small>}</strong><b>{person.points}</b></div>)}<button className="side-panel-link">View full leaderboard <ArrowUpRight size={14} /></button></aside>
      </div>
    </div>
  );
}
