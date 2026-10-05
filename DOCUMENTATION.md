# CampusHub Documentation

> CampusHub is a student-focused academic resource hub and Lost & Found web application prototype. It brings study resources into a structured library and adds lightweight campus utility features in a single responsive interface.

**Repository:** `atharv-shrivastava/campushub`  
**Default branch:** `main`  
**Current implementation:** Frontend prototype with local in-memory/mock data  
**Framework:** Next.js App Router  
**Inspection date:** October 5, 2026

---

## 1. Product Overview

CampusHub is designed around a simple problem: college study material is often scattered across messaging groups, folders, and individual devices. The application presents a central "shared shelf" where students can discover, filter, save, upload, and download academic resources.

The current UI also includes a friendly Lost & Found board so that common campus utilities live alongside academic resources.

The product currently contains two closely related areas:

1. **Academic resource sharing**
   - Notes
   - Assignments
   - Practical files
   - Previous-year questions (PYQ)
   - Lab manuals
   - Syllabus documents

2. **Campus utility**
   - Lost & Found reports
   - Possible-match presentation between a lost and found item
   - Finder messaging feedback
   - Notifications/toasts

The visual language intentionally resembles a student's physical notebook, bookshelf, folders, paper cards, and study desk rather than a conventional enterprise dashboard.

---

## 2. Important Current Status

The current repository is a **frontend prototype**.

It does **not** currently contain:

- a backend API
- PostgreSQL or another database
- Prisma
- Supabase
- authentication
- user registration/login
- persistent user accounts
- cloud file storage
- real PDF upload processing
- real PDF file downloads
- server-side resource CRUD
- persistent bookmarks
- persistent Lost & Found records
- real notification delivery
- server-side search

The data used by the interface lives in TypeScript files and React state.

This distinction is important because the UI intentionally simulates several real application workflows. For example, an upload displays progress and a successful "shelved" state, but no file is sent to a server.

---

# 3. Core User Workflow

## 3.1 Discover a resource

The primary journey is:

**Home → Search → Library → Resource Detail → Download / Save**

A student can enter a query from the home page or open the global search palette.

## 3.2 Browse by subject

The home page exposes a bookshelf-style subject shelf.

Selecting a subject navigates to:

`/library?subject=<subject-code>`

The library then limits the resource list to that subject.

## 3.3 Filter and sort

The library supports:

**Search → Subject → Category → Semester → Sort → Grid/List**

Available category filters:

- Notes
- Assignment
- Practical
- PYQ
- Lab manual
- Syllabus

Available semesters in the current dataset:

- Semester 2
- Semester 3
- Semester 5

Available sorting modes:

- Most downloaded
- Top rated
- Newest

## 3.4 Open a resource

Selecting a resource opens:

`/resource/<resource-id>`

The detail page shows:

- document preview
- title
- description
- rating
- download count
- page count
- subject
- subject code
- semester
- resource type
- unit where available
- upload time
- uploader information
- tags
- download action
- save/bookmark action
- share-link feedback
- related resources

## 3.5 Save a resource

The bookmark control adds/removes a resource from the local saved set.

Saved resources are grouped by subject at:

`/saved`

Current bookmarks are held in React context and reset when the application is reloaded.

## 3.6 Upload a resource

The upload workflow is:

**Choose → Describe → Upload → Shelved**

A student:

1. selects or drops a PDF
2. enters/edits the title
3. selects a subject
4. optionally enters a unit
5. selects the resource type
6. submits
7. watches simulated upload progress
8. sees the document "filed" into a visual folder
9. receives a success message

The interface currently accepts PDF files by extension. The displayed interface says uploads can be up to 25 MB, but the current client code does not implement an actual 25 MB size check.

## 3.7 Lost & Found

The Lost & Found workflow is:

**View board → Filter by status → Report an item → Review possible match**

The board has four tabs:

- Everything
- Lost
- Found
- Reunited

A report can be either:

- I lost something
- I found something

The current form collects:

- item title
- location
- description/details

The current client implementation inserts the new item into local component state.

## 3.8 Possible-match experience

The page contains a featured "Possible match" section comparing one lost item with one found item.

The interface communicates four matching signals:

- Same place
- Same colour
- Close in time
- Unique detail

The demo transitions to a **92% match** state and then exposes a "Message the finder" action.

The current matching experience is demonstrative UI rather than a dynamic matching engine. The comparison signals and score are predefined in the component.

---

# 4. Pages and Routes

| Route | Purpose |
|---|---|
| `/` | Home / dashboard-style discovery page |
| `/library` | Searchable, filterable resource library |
| `/resource/[id]` | Individual resource detail page |
| `/upload` | PDF upload and metadata workflow |
| `/lost-found` | Lost & Found board and reporting |
| `/saved` | Bookmarked resources grouped by subject |

The App Router uses dynamic routing for individual resources.

The resource route uses `generateStaticParams()` over the current resource dataset, so every seeded resource has a statically known route at build time.

Unknown resource IDs are handled with Next.js `notFound()`.

---

# 5. Home Page

The home page is intentionally more personal than a conventional admin dashboard.

It contains:

## Greeting and semester context

The hero displays a greeting such as:

> Good evening, Aanya. What are we studying tonight?

The page also shows a semester/week badge. These values are currently static presentation data.

## Search

The hero search:

- accepts free-text queries
- routes to the library
- rotates example search prompts when idle
- exposes trending query chips
- supports animated focus states

Examples included in the current data:

- Data Structures Unit 3
- CS-204 practical
- OOP notes
- Maths previous paper
- DBMS normalisation

## Subject bookshelf

The subject shelf renders the available subjects as book-spine-like cards.

Each subject displays:

- subject code
- short name
- file count

Clicking a shelf card opens the library filtered to that subject.

## Fresh resources

The home page shows the first three resources from the current resource dataset under "New this week".

## Exam countdown card

A stylized card presents:

- 6 days remaining
- Data Structures · Mid Sem
- 68% of Unit 1–3 resources reviewed

These values are static prototype content.

## Lost & Found pulse

The home page calculates the number of current Lost & Found items that are not marked matched.

The card links to `/lost-found`.

## Share-your-notes card

A CTA links to the upload workflow and displays prototype sharing statistics such as:

- 12 shared
- 3.4k downloads

Those figures are presentation data, not database metrics.

---

# 6. Global Navigation

The desktop navigation contains:

- Home
- Library
- Upload
- Lost & Found
- Saved

The navigation also provides:

- global search
- notification button
- current-user avatar presentation

The mobile layout replaces the desktop menu with a bottom dock.

The mobile dock places Upload in a central elevated action button.

Resource detail pages are treated as part of the Library navigation state.

---

# 7. Global Command Search

The command search is opened by:

- clicking the Search control
- `Ctrl+K` / `Cmd+K`

The modal supports:

- focused search input
- live resource matching
- result navigation
- arrow-key movement through results
- Enter to open the selected result
- Escape to close

If a query has matching resources, Enter opens the selected resource.

If there is no direct result, Enter sends the query to:

`/library?q=<query>`

The command palette currently limits visible direct matches to five resources.

---

# 8. Library Explorer

The Library is the main academic discovery interface.

## Search

Search is performed locally through `lib/search.ts`.

The searchable text contains:

- resource title
- subject name
- subject code
- subject short name
- category
- human-readable category label
- unit
- tags
- year

## Search behavior

The search system is intentionally lightweight.

Queries are:

1. lowercased
2. split by whitespace
3. normalized through aliases
4. matched against each resource's searchable "haystack"

Current aliases include:

| Query | Normalized meaning |
|---|---|
| `maths` | mathematics |
| `math` | mathematics |
| `paper` | pyq |
| `previous` | pyq |
| `practical` | practical |
| `ds` | data structures |

The matching model is token-based substring matching, not semantic search.

## Filters

### Subject

The current subject selector contains:

- All subjects
- CS-204 · Data Structures
- CS-202 · Object Oriented Programming
- MA-201 · Engineering Mathematics II
- CS-301 · Database Management Systems
- CS-302 · Operating Systems
- CS-303 · Computer Networks
- EC-205 · Digital Electronics

### Category

- Notes
- Assignment
- Practical
- PYQ
- Lab Manual
- Syllabus

### Semester

- 2
- 3
- 5

### Sorting

- Most downloaded
- Top rated
- Newest

## Views

Desktop users can switch between:

- Grid view
- List view

Grid view uses large resource cards.

List view shows a compact row with:

- resource preview
- category
- subject code
- title
- uploader
- upload time
- page count
- rating
- downloads
- bookmark

## Responsive filters

On smaller screens, filters move into a bottom-sheet style dialog.

The filter sheet supports:

- category selection
- semester selection
- sorting
- result count
- reset

The sheet is also draggable vertically for dismissal.

## Loading state

Changing search/filter/sort state triggers a short client-side loading transition with skeleton cards.

This is UX simulation rather than asynchronous server loading.

---

# 9. Resource Cards

Each resource card communicates:

- category
- subject code
- subject name
- title
- uploader
- page count
- download count
- bookmark state

Category labels receive different visual treatments.

The preview itself is generated by React/SVG/CSS rather than by loading actual PDF thumbnails.

The card links to the resource detail route.

Hover states use small lift/rotation effects to preserve the physical-paper metaphor.

---

# 10. Resource Detail

The resource detail page provides a fuller representation of a selected resource.

## Document presentation

The page shows a stylized first-page preview and a page indicator such as:

`Page 1 of X`

The preview is generated UI, not a PDF viewer.

## Metadata

The "Library card" section presents:

- Subject
- Code
- Semester
- Type
- Unit where available
- Uploaded date/time

## Statistics

The page shows:

- rating
- total downloads
- number of pages

These values come directly from the static dataset.

## Uploader

The uploader section shows:

- initials
- name
- branch/year
- tags

## Actions

### Download

The Download button:

- starts a simulated progress animation
- updates percentage over time
- changes to a completed state
- shows a toast

It does not currently fetch or save a real PDF file.

### Save

Uses the global bookmark state.

### Share

Currently gives "Link copied" feedback through a toast. There is no real clipboard operation in the current implementation.

## Related resources

Up to three other resources from the same subject are displayed.

If fewer than three same-subject resources exist, the UI falls back to other resources.

---

# 11. Saved Shelf

The Saved page is the user's bookmark shelf.

Resources are:

- filtered from the current in-memory resource list
- grouped by subject
- displayed using normal resource cards

The shell starts with two pre-seeded saved IDs:

- `oop-notes-complete`
- `dbms-normalisation`

This is demo state.

There is no browser storage or backend persistence.

When nothing is saved, an empty-state illustration and a link back to the Library are displayed.

---

# 12. Upload Studio

The Upload page is designed like a physical filing workflow.

## Upload states

The component uses these phases:

- `empty`
- `selected`
- `uploading`
- `filing`
- `done`

The visible progress steps map to:

1. Choose
2. Describe
3. Upload
4. Shelved

## File selection

Users can:

- click to browse
- drag and drop a file

The current implementation accepts PDF files.

A non-PDF selection produces the message:

> CampusHub only accepts PDF files for now.

## Metadata

The form supports:

- Title
- Subject
- Unit
- Type

Available types are the six resource categories.

The title is initially derived from the filename by removing the extension and replacing hyphens/underscores with spaces.

## Simulated progress

Upload progress is locally generated with a timer and random increments.

The progress messages evolve through:

- Reading pages…
- Stitching binding…
- Almost shelved…

After upload, the UI animates the document into a folder illustration.

## Completion

On completion:

- a success message is shown
- the local folder count increments
- a toast appears
- the user can go to the selected subject shelf
- the user can restart another upload

The current implementation does not retain the actual selected File object after the local component workflow and does not transmit file bytes to a server.

---

# 13. Lost & Found

The Lost & Found page is a separate utility module.

## Categories

The current item categories are:

- Electronics
- ID Card
- Books
- Accessories
- Keys
- Bottles

## Statuses

The underlying status type contains:

- `lost`
- `found`
- `matched`

The UI labels the matched state as "Reunited".

Lost items are visually described as "Searching".

Found items are visually described as "Found".

## Board filtering

The tab counts are calculated from local state.

Tabs:

| Tab | Behavior |
|---|---|
| Everything | Shows all items |
| Lost | Only lost items |
| Found | Only found items |
| Reunited | Only matched items |

## Report form

The modal lets a user choose:

- I lost something
- I found something

Fields:

- What is it?
- Where?
- Little details

Submitting creates a new local item.

The current prototype assigns:

- category: Accessories
- reporter: Aanya S.
- current timestamp label: Just now

unless a different value is explicitly handled elsewhere.

## Match presentation

The page contains a featured demonstration pairing:

- Sage green AirPods case
- Green earbuds case with star sticker

The component communicates that reports can be compared using:

- place
- colour
- time
- unique details

The current score displayed after checking is 92%.

The matching logic itself is not computed from arbitrary reports.

## Finder contact

After the demo match is confirmed, the page presents:

**Message the finder**

Clicking it produces a toast with a suggested meeting location.

No actual messaging system exists in the current repository.

---

# 14. Notifications and Toasts

CampusHub has a reusable toast provider.

Toasts support three visual tones:

- ink
- peach
- sage

The toast system:

- queues recent notifications
- displays up to three at once
- auto-removes them after roughly 3.6 seconds
- uses animated entry/exit

Examples used by the application include:

- resource saved
- resource downloaded
- upload completed
- Lost & Found report posted
- possible match found
- message sent
- share-link feedback

The top navigation's notification bell currently displays a prototype notification about the AirPods match.

---

# 15. Data Model

All prototype data is currently defined in `lib/data.ts`.

## 15.1 Category

The resource category union is:

`Notes | Assignment | Practical | PYQ | Lab Manual | Syllabus`

## 15.2 Subject

Each subject contains:

- `code`
- `name`
- `short`
- `semester`
- `count`

## 15.3 Resource

Each resource contains:

- `id`
- `title`
- `subjectCode`
- `category`
- `semester`
- optional `unit`
- uploader name
- uploader initials
- uploader branch
- `uploadedAt`
- `pages`
- `sizeMb`
- `downloads`
- `rating`
- optional `year`
- `tags`
- `description`

## 15.4 Lost & Found item

Each Lost & Found item contains:

- `id`
- `status`
- `title`
- `category`
- `location`
- `when`
- `description`
- reporter name
- reporter initials
- display colour

---

# 16. Current Seeded Subjects

| Code | Subject | Semester | Files |
|---|---|---:|---:|
| CS-204 | Data Structures | 3 | 48 |
| CS-202 | Object Oriented Programming | 3 | 36 |
| MA-201 | Engineering Mathematics II | 2 | 41 |
| CS-301 | Database Management Systems | 5 | 29 |
| CS-302 | Operating Systems | 5 | 33 |
| CS-303 | Computer Networks | 5 | 22 |
| EC-205 | Digital Electronics | 3 | 18 |

---

# 17. Current Seeded Resources

| ID | Title | Type | Subject |
|---|---|---|---|
| `ds-unit-3-trees` | Unit 3 — Trees, BST & AVL Rotations | Notes | CS-204 |
| `cs204-practical-file` | CS-204 Practical File — All 12 Programs | Practical | CS-204 |
| `oop-notes-complete` | OOP Complete Notes — Classes to Polymorphism | Notes | CS-202 |
| `maths-pyq-2024` | Engineering Maths II — End Sem 2024 | PYQ | MA-201 |
| `ds-assignment-2` | Assignment 2 — Linked List Problems | Assignment | CS-204 |
| `dbms-normalisation` | Normalisation Cheatsheet — 1NF to BCNF | Notes | CS-301 |
| `os-lab-manual` | OS Lab Manual — Scheduling & Deadlocks | Lab Manual | CS-302 |
| `ds-pyq-2023` | Data Structures — Mid Sem 2023 | PYQ | CS-204 |
| `cn-syllabus` | Computer Networks — Syllabus 2025–26 | Syllabus | CS-303 |
| `de-practical-kmaps` | K-Maps & Logic Gates Practical | Practical | EC-205 |

The resource dataset also contains the associated uploader, ratings, download counts, page counts, tags, descriptions, and optional year/unit metadata used by the UI.

---

# 18. Current Seeded Lost & Found Data

The initial board contains seven example entries:

| ID | Status | Item | Category | Location |
|---|---|---|---|---|
| `lf-1` | Lost | Sage green AirPods case | Electronics | Central Library, 2nd floor |
| `lf-2` | Found | Green earbuds case with star sticker | Electronics | Library reading hall |
| `lf-3` | Lost | Student ID — Rohan Mehta | ID Card | Canteen / Block C |
| `lf-4` | Found | Steel water bottle (dented) | Bottles | Basketball court |
| `lf-5` | Lost | Yellow scientific calculator | Accessories | Exam Hall 3 |
| `lf-6` | Matched | Hostel room keys (Room 214) | Keys | Hostel B lobby |
| `lf-7` | Found | "Let Us C" — annotated copy | Books | Lab 4, Block A |

---

# 19. Application Architecture

The current architecture is intentionally simple:

```
┌──────────────────────────────┐
│       Next.js App Router     │
│          React UI            │
├──────────────────────────────┤
│ Page components / route layer │
│        app/**                 │
├──────────────────────────────┤
│ Reusable client components    │
│      components/**            │
├──────────────────────────────┤
│ Local application state       │
│ React Context + useState      │
├──────────────────────────────┤
│ Static application data       │
│        lib/data.ts            │
├──────────────────────────────┤
│ Local search helper           │
│        lib/search.ts          │
└──────────────────────────────┘
```

There is currently no remote persistence layer.

---

# 20. State Management

The application uses React state rather than an external state-management library.

## App shell state

The shell context provides:

- opening global search
- current saved resource set
- bookmark toggling

## Local component state

Individual modules hold their own state.

Examples:

- Library search/filter/sort state
- Upload phase/progress/form state
- Lost & Found board state
- Match state
- Toast state
- Download progress state

The prototype therefore behaves like a single-page interactive application even though it uses Next.js routing.

---

# 21. Project Structure

The important application structure currently includes:

```
campushub/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── library/
│   │   └── page.tsx
│   ├── lost-found/
│   │   └── page.tsx
│   ├── resource/
│   │   └── [id]/
│   │       └── page.tsx
│   ├── saved/
│   │   └── page.tsx
│   └── upload/
│       └── page.tsx
│
├── components/
│   ├── brand/
│   ├── home/
│   ├── library/
│   ├── lost-found/
│   ├── resources/
│   ├── saved/
│   ├── shell/
│   ├── ui/
│   └── upload/
│
├── lib/
│   ├── data.ts
│   ├── search.ts
│   └── utils.ts
│
├── components.json
├── next.config.mjs
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

---

# 22. Technology Stack

## Core framework

- **Next.js 16.3.3**
- **React 19**
- **React DOM 19**
- **TypeScript 5.7.3**

Next.js App Router is used for route structure and page rendering.

## Styling

- **Tailwind CSS 4.3.3**
- **@tailwindcss/postcss**
- **tw-animate-css**
- custom CSS utilities/tokens in `app/globals.css`

There is no separate Tailwind configuration file in the current project.

## UI and animation

- **Motion 13.4.6**
- **Lucide React 1.16.0**
- **shadcn 4.11.0**
- **@base-ui/react**
- **class-variance-authority**
- **clsx**
- **tailwind-merge**

## Analytics

- **@vercel/analytics 1.6.1**

Analytics are rendered only when `NODE_ENV === 'production'`.

## Build tooling

- PostCSS
- TypeScript
- pnpm 12.3.4 is specified as the package manager

---

# 23. Design System

CampusHub uses a named visual palette in `app/globals.css`.

| Token | Value | Meaning |
|---|---|---|
| ink | `#123C35` | primary dark green |
| deep | `#0B2924` | deepest text/background tone |
| champagne | `#F3E4C3` | warm highlight |
| cream | `#FAF7EF` | main background |
| sage | `#D9E5DC` | soft secondary tone |
| peach | `#D99476` | accent |
| paper | `#FFFDF7` | card/document surface |

Typography uses:

- **Fraunces** as the serif display face
- **Geist** as the sans-serif UI face

The interface also uses:

- rounded paper/card shapes
- ruled-paper textures
- graph-paper textures
- subtle shadows
- soft rotations
- animated "sparkle" motifs

The style intentionally makes resources feel like physical documents on a bookshelf.

---

# 24. Motion and Interaction Design

Motion is a significant part of the product identity.

Implemented effects include:

- spring-based card entrances
- hover lifts
- subtle rotations
- animated navigation pills
- animated search dialog
- animated loading skeletons
- upload progress
- document-to-folder filing animation
- bookmark sparkle burst
- Lost & Found match animation
- pulsing match indicator
- animated status badges
- toast transitions
- floating illustrations
- notification-bell wiggle

The CSS also provides a reduced-motion mode using `prefers-reduced-motion: reduce`.

This is a useful accessibility safeguard despite the highly animated visual design.

---

# 25. Responsive Design

The application has desktop and mobile-specific interaction patterns.

## Desktop

- top navigation
- library side filter panel
- grid/list switch
- multi-column resource grids
- larger hero composition

## Mobile

- bottom navigation dock
- central upload action
- filter bottom sheet
- horizontally scrollable subject/category controls
- responsive resource cards
- stacked Lost & Found layouts

The shell reserves additional bottom spacing on mobile to account for the fixed navigation dock.

---

# 26. Accessibility-Oriented Behaviors

The implementation includes several accessible patterns:

- semantic `nav` elements
- labels for search inputs
- `aria-label` on icon-only actions
- `aria-current` on active navigation
- `aria-selected` on tabs
- `role="dialog"` and `aria-modal` for overlays
- `aria-live="polite"` for changing result/notification areas
- keyboard navigation for command search
- `prefers-reduced-motion` support
- focus-visible styles in several interactive controls

Accessibility is not complete across the entire application, but the current UI demonstrates intentional support.

---

# 27. Configuration and Build Behavior

The package scripts are:

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start"
}
```

No dedicated lint script is defined in the current package configuration.

The current `next.config.mjs` contains:

- `typescript.ignoreBuildErrors: true`
- `images.unoptimized: true`

The first setting means the production Next.js build is configured to ignore TypeScript build errors. This is useful for rapid prototyping, but it should be changed before treating the project as production-grade.

---

# 28. Local Development

Prerequisites:

- Node.js
- pnpm 12.x-compatible environment

Install dependencies:

```bash
pnpm install
```

Run development server:

```bash
pnpm dev
```

Build:

```bash
pnpm build
```

Run production build:

```bash
pnpm start
```

The standard Next.js development server is expected to run locally at:

`http://localhost:3000`

---

# 29. What Is Real vs Simulated

This section is important for demos, documentation, and future development.

| Capability | Current state |
|---|---|
| Responsive web UI | Implemented |
| Home discovery experience | Implemented |
| Resource browsing | Implemented |
| Local search | Implemented |
| Subject/category/semester filters | Implemented |
| Sorting | Implemented |
| Grid/list views | Implemented |
| Resource details | Implemented |
| Bookmark interaction | Implemented locally |
| Saved page | Implemented locally |
| PDF selection UI | Implemented |
| PDF validation by extension | Implemented |
| Actual upload to storage | Not implemented |
| Actual PDF persistence | Not implemented |
| Actual PDF download | Not implemented |
| Real database | Not implemented |
| Real authentication | Not implemented |
| Real user profiles | Not implemented |
| Real notifications | Not implemented |
| Lost & Found reporting | Implemented locally |
| Persistent Lost & Found | Not implemented |
| Match UI | Implemented |
| Dynamic match algorithm | Not implemented |
| Real messaging | Not implemented |
| Server-side API | Not implemented |
| AI search | Not implemented |
| Semantic search | Not implemented |
| Recommendation engine | Not implemented |

---

# 30. Recommended Production Architecture

The current repository is a good presentation/prototype layer. A production version can evolve without discarding the UI architecture.

A practical next-stage architecture would be:

```
┌──────────────────────┐
│ Next.js Frontend     │
│ App Router           │
└──────────┬───────────┘
           │ HTTPS
           ▼
┌──────────────────────┐
│ Application API      │
│ Auth / Resources     │
│ Uploads / L&F        │
└───────┬──────────────┘
        │
   ┌────┴───────────────┐
   ▼                    ▼
PostgreSQL          Object Storage
metadata            PDFs / files
   │
   ├── Users
   ├── Subjects
   ├── Resources
   ├── Downloads
   ├── Bookmarks
   ├── Ratings
   ├── LostFound
   └── Notifications
```

Potential next-stage services:

- authentication
- role-based access
- real PDF storage
- resource metadata APIs
- persistent bookmarks
- download tracking
- report moderation
- Lost & Found matching
- real-time notifications
- full-text search
- semantic/resource-content search

---

# 31. Suggested Production Data Entities

A future backend should separate the current UI data into persistent entities.

### User

- id
- name
- email
- college
- branch
- year
- avatar
- created_at

### Subject

- id
- code
- name
- semester
- branch

### Resource

- id
- title
- description
- subject_id
- category
- semester
- unit
- storage_key
- file_size
- page_count
- uploader_id
- created_at

### ResourceTag

- resource_id
- tag

### Bookmark

- user_id
- resource_id
- created_at

### Rating

- user_id
- resource_id
- score

### Download

- user_id
- resource_id
- created_at

### LostFoundItem

- id
- reporter_id
- status
- title
- category
- location
- description
- created_at
- matched_item_id

### Notification

- id
- recipient_id
- type
- title
- body
- read_at

---

# 32. Future Search Evolution

The current local search is deliberately simple and fast.

A production version could preserve the current UX while replacing the underlying implementation with:

1. PostgreSQL full-text search for exact/filterable discovery.
2. Extracted PDF text indexing.
3. Tag-based search.
4. Fuzzy matching for typos.
5. Subject/semester-aware ranking.
6. Semantic/embedding search for meaning-based queries.
7. Popularity and quality signals.
8. Personalized ranking using a user's course list.

For example, a query such as:

`"graphs traversal practical"`

could eventually find a resource even when those words are spread across its title, extracted document text, tags, and description.

---

# 33. Future Lost & Found Matching

The current 92% match is a demonstration of the experience.

A real system could calculate match confidence using weighted evidence:

```
matchScore =
  locationSimilarity * w1
+ timeSimilarity     * w2
+ categorySimilarity * w3
+ colourSimilarity   * w4
+ textSimilarity     * w5
+ imageSimilarity    * w6
```

The interface already provides a useful visual place for these signals.

A production implementation should also include:

- privacy controls
- abuse reporting
- status expiration
- item ownership verification
- moderation
- secure contact exchange
- duplicate report detection

---

# 34. Future Upload Pipeline

The current upload UI can become:

**Select PDF → Validate → Upload → Extract Metadata → Virus Scan → Persist → Index → Publish**

Potential validations:

- MIME type
- extension
- file size
- checksum
- page count
- duplicate detection

Potential metadata extraction:

- title
- subject
- unit
- page count
- file size
- extracted text
- tags

---

# 35. Product Principles Evident in the Current Implementation

The repository consistently follows several product principles:

### Reduce friction

Search is available directly from Home and globally through the command palette.

### Make organization visible

Subject shelves, categories, semester filters, and Library cards turn a folder-like dataset into a structured system.

### Reward contribution

The Upload experience makes sharing feel like adding something useful to the community.

### Keep utility close to the student

Lost & Found sits beside academic features instead of becoming an unrelated standalone application.

### Make digital information feel tangible

Folders, paper previews, bookmarks, shelves, ruled pages, and document cards create a physical metaphor.

### Use motion to communicate state

Animation is not limited to decoration. It communicates:

- selection
- progress
- completion
- saved state
- match state
- navigation state

---

# 36. Known Technical Limitations

The following should be considered before deployment as a real service:

1. All application data is static or locally held.
2. State resets when the page/application is refreshed.
3. The upload flow does not persist file contents.
4. The download flow does not retrieve a real file.
5. Search is not semantic and does not search actual document content.
6. User identity is presentation-only.
7. Ratings and download counts are not calculated from user activity.
8. Lost & Found matching is hardcoded for the featured demo.
9. Share feedback does not perform real clipboard sharing.
10. Notification data is not persistent.
11. TypeScript build errors are explicitly ignored in Next.js configuration.
12. No test suite is currently present in the inspected project configuration.
13. No backend/database schema is currently present.
14. The displayed upload size limit is not actually enforced.
15. The current repository is therefore best described as a functional UI prototype rather than a production-ready SaaS platform.

---

# 37. Summary

CampusHub currently provides a cohesive, responsive frontend for:

**Discover → Search → Filter → Open → Save → Download**

and:

**Report → Browse → Compare → Match**

The implementation has a strong product/UI foundation, a clear component structure, reusable data types, responsive navigation, local search, interactive resource discovery, a polished upload experience, and a distinct Lost & Found workflow.

Its current architecture is intentionally frontend-first. The next engineering step is not to redesign the UI, but to replace the mock/local behaviors with persistent services while preserving the existing interaction model.

In other words, the hard part currently solved by the repository is the product experience. The missing layer is the infrastructure behind it.

---
# 38. Full-Stack Product Specification

This section documents the broader CampusHub design defined for the project, including the backend features that the current frontend prototype is intended to connect to. Backend items below are target/planned functionality unless explicitly stated as implemented in earlier sections.

## 38.1 Product purpose

CampusHub is intended to be a college-specific platform for discovering, sharing, organizing, and accessing academic resources. It also provides a campus Lost & Found service.

The main academic loop is:

Sign in -> choose subject -> search/filter -> open resource -> save/download

The contribution loop is:

Sign in -> select PDF -> enter metadata -> upload -> resource becomes available -> students use/vote/download it

The campus utility loop is:

Report lost/found item -> browse reports -> detect possible match -> contact other user -> mark reunited

## 38.2 Target roles

Student:
- register/login with college email
- browse/search/filter resources
- view resource details
- save/bookmark resources
- download resources
- upload academic PDFs
- vote on resources
- manage own uploads
- report lost/found items
- receive notifications

Moderator/Admin:
- manage users
- manage subjects and categories
- review flagged resources
- remove/restore resources
- handle abusive or inappropriate uploads
- review Lost & Found reports
- manage platform configuration

## 38.3 Authentication

The target platform is restricted to a configured college domain.

Registration flow:
1. student submits college email and credentials
2. server validates the email domain
3. verification email is issued
4. account is activated after verification
5. authenticated session/JWT is returned

The backend must enforce this independently of the frontend.

JWT/session information should contain only authorization-safe claims such as user ID, role, campus identifier, issue time and expiry.

Protected operations include uploads, bookmarks, votes, downloads where required, profile changes, personal resource actions, Lost & Found mutations and notifications.

# 39. Target Technology Stack

Frontend:
- Next.js / React
- TypeScript
- Tailwind CSS
- Motion
- Lucide

Backend:
- Node.js
- Express.js
- TypeScript or JavaScript
- REST APIs
- Zod validation

Persistence:
- PostgreSQL
- Prisma ORM

Authentication:
- college-email verification
- JWT/session based authorization

Files:
- object storage for PDFs and future Lost & Found images

The current GitHub repository implements the frontend with Next.js 16.3.3 and React 19. It does not currently contain the Express/PostgreSQL/Prisma backend.

# 40. Target System Architecture

Client
  |
  | HTTPS / REST
  v
Next.js / React application
  |
  | API requests
  v
Express API
  |
  +--> Auth service
  +--> Resource service
  +--> Bookmark service
  +--> Vote/moderation service
  +--> Lost & Found service
  +--> Notification service
  +--> Search service
  |
  +--> Prisma ORM --> PostgreSQL
  |
  +--> File service --> Object storage

The frontend remains responsible for presentation and interaction. The backend becomes the source of truth for identity, metadata, permissions, counters, status and persistence.

# 41. Backend Modules

Recommended Express module structure:

backend/
  src/
    app
    server
    config
    middleware
    routes
    modules/
      auth
      users
      subjects
      resources
      bookmarks
      votes
      lost-found
      notifications
      moderation
      search
    services
    utils
  prisma/
    schema.prisma
    migrations/
    seed.ts

Each module should contain route/controller logic plus service/business logic rather than placing all functionality in one Express file.

# 42. Resource Backend

A Resource represents an academic document.

Core metadata:
- id
- title
- description
- subjectId
- subjectCode
- semester
- unit
- category
- uploaderId
- fileKey
- fileMimeType
- fileSize
- checksum
- pageCount
- ratingAverage
- ratingCount
- upvoteCount
- downvoteCount
- downloadCount
- status
- createdAt
- updatedAt

Allowed categories:
- Notes
- Assignment
- Practical
- PYQ
- Lab Manual
- Syllabus

Resource lifecycle:

UPLOAD -> VALIDATE -> STORE FILE -> CREATE METADATA -> PUBLISH -> DISCOVER -> SAVE/DOWNLOAD/VOTE -> FLAG/MODERATE -> RESTORE/REMOVE/ARCHIVE

Recommended statuses:
- DRAFT
- PUBLISHED
- FLAGGED
- HIDDEN
- REMOVED
- ARCHIVED

# 43. Resource Upload API

Target endpoint:

POST /api/resources

Request:
- authenticated user
- PDF
- title
- subject
- category
- semester
- optional unit
- optional description
- optional tags

Server workflow:

Request
 -> JWT/auth middleware
 -> request/schema validation
 -> file type/size validation
 -> checksum/duplicate check
 -> storage upload
 -> Prisma resource creation
 -> response with resource metadata

The backend should not trust browser validation.

Recommended file checks:
- extension
- MIME type
- actual file signature when practical
- maximum file size
- safe/generated storage key
- duplicate checksum

The current UI displays a 25 MB limit, so the production API should make that limit real and configurable.

# 44. Resource Download API

Target endpoint:

GET /api/resources/:id/download

Workflow:
1. authenticate when required
2. look up resource
3. confirm published/allowed status
4. generate an authorized file URL or stream
5. record a download event
6. return the file

The current DownloadButton only simulates progress. It should eventually call this endpoint.

# 45. Resource Search API

Target endpoint:

GET /api/resources

Parameters:
- q
- subject
- semester
- category
- unit
- year
- sort
- page
- limit

Supported discovery modes:
- exact search
- subject search
- code search
- category search
- semester filtering
- unit filtering
- year filtering
- popularity sorting
- rating sorting
- newest sorting

Search should initially use indexed PostgreSQL fields/full-text search. Extracted PDF text can be indexed later.

The current frontend search aliases maths/math, paper/previous, practical, and ds. The backend can preserve these aliases for consistent behavior.

# 46. Resource Voting and Moderation

Target voting endpoints:

POST /api/resources/:id/vote
DELETE /api/resources/:id/vote

A vote should contain:
- userId
- resourceId
- vote type
- createdAt

A unique constraint should prevent repeated votes by the same user on one resource.

Community quality control:
- upvotes increase positive score
- downvotes decrease score
- excessive negative feedback flags the resource
- the previously defined threshold is 10 downvotes

For production, the preferred behavior is:

10 downvotes -> flag/review -> moderator decision -> keep/restore/remove

Soft deletion is preferable to irreversible deletion.

# 47. Bookmarks / Saved Resources

Target endpoints:

GET /api/bookmarks
POST /api/bookmarks/:resourceId
DELETE /api/bookmarks/:resourceId

Database model:

User
  |
  +-- Bookmark -- Resource

Unique constraint:
(userId, resourceId)

This turns the current local Saved shelf into a persistent cross-device feature.

# 48. Ratings

The current UI displays seeded ratings.

The full-stack version can allow one rating per student per resource.

Possible model:
- userId
- resourceId
- score from 1 to 5
- createdAt
- updatedAt

The average and count can be derived or cached on Resource.

# 49. Subject Management

Subjects should be canonical database records rather than arbitrary text.

Example:

CS-204
Data Structures
Semester 3
Branch CSE

Resource records reference subject IDs.

This prevents duplicates caused by inconsistent text such as CS204, CS-204 and Data Structures.

Admin functionality should allow:
- create subject
- edit subject
- deactivate subject
- assign semester/branch
- view resource count

# 50. Pagination

The production API should paginate resources.

Example:

GET /api/resources?page=1&limit=20

Response should contain:
- data
- current page
- page size
- total records
- total pages

This is required once the library grows beyond the current seeded dataset.

# 51. PDF Storage and Processing

File bytes and database metadata should be separated.

PostgreSQL stores:
- title
- metadata
- counters
- owner
- status
- storage key
- checksum

Object storage stores:
- actual PDF

Upload processing can later become:

Upload
 -> validate
 -> checksum
 -> malware scan
 -> store PDF
 -> extract page count
 -> optionally extract text
 -> persist metadata
 -> index text

The current prototype uses generated document previews and seeded page counts, so those values must eventually come from real files.

# 52. Lost & Found Backend

Target endpoints:

GET /api/lost-found
GET /api/lost-found/:id
POST /api/lost-found
PATCH /api/lost-found/:id
DELETE /api/lost-found/:id
POST /api/lost-found/:id/match
POST /api/lost-found/:id/contact

Target fields:
- id
- reporterId
- status
- title
- category
- location
- description
- optional imageKey
- createdAt
- updatedAt
- matchedItemId

Target statuses:
- LOST
- FOUND
- MATCH_PENDING
- MATCHED
- CLOSED
- EXPIRED

The current frontend uses lost, found and matched.

# 53. Lost & Found Matching

The current UI demonstrates a possible match using:
- same place
- same colour
- close time
- unique detail
- displayed 92% score

The production system should calculate the score instead of hardcoding it.

Possible weighted factors:
location similarity
time similarity
category similarity
text-description similarity
colour similarity
distinctive attributes
optional image similarity later

A match score is only a candidate signal. It must never be presented as proof of ownership.

# 54. Lost & Found Contact

The current "Message the finder" action is a demo toast.

Production design should use an internal contact mechanism rather than exposing personal email/phone details.

Recommended flow:

Possible match
 -> authenticated contact request
 -> notification to finder
 -> protected conversation/contact exchange
 -> item marked matched/reunited
 -> posts eventually closed

# 55. Notifications

Current implementation:
- client-side ToastProvider
- transient notifications only

Target persistent notification entity:
- id
- userId
- type
- title
- message
- readAt
- createdAt

Examples:
- resource approved
- resource flagged
- resource removed
- Lost & Found possible match
- finder contacted
- moderation decision
- account/security notification

Real-time delivery can be added later.

# 56. API Authentication and Middleware

Recommended request chain:

HTTP request
 -> CORS/security middleware
 -> rate limiting
 -> JWT/session middleware
 -> role/ownership check
 -> Zod validation
 -> controller
 -> service
 -> Prisma
 -> response

Controllers should remain thin. Business rules belong in services.

# 57. Suggested REST API

Authentication:
POST /api/auth/register
POST /api/auth/login
POST /api/auth/verify-email
POST /api/auth/refresh
POST /api/auth/logout
GET /api/auth/me

Users:
GET /api/users/me
PATCH /api/users/me

Subjects:
GET /api/subjects
GET /api/subjects/:id
GET /api/subjects/:id/resources

Resources:
GET /api/resources
GET /api/resources/:id
POST /api/resources
PATCH /api/resources/:id
DELETE /api/resources/:id
GET /api/resources/:id/download

Bookmarks:
GET /api/bookmarks
POST /api/bookmarks/:resourceId
DELETE /api/bookmarks/:resourceId

Votes:
POST /api/resources/:id/vote
DELETE /api/resources/:id/vote

Lost & Found:
GET /api/lost-found
GET /api/lost-found/:id
POST /api/lost-found
PATCH /api/lost-found/:id
DELETE /api/lost-found/:id
POST /api/lost-found/:id/match
POST /api/lost-found/:id/contact

Notifications:
GET /api/notifications
PATCH /api/notifications/:id/read
PATCH /api/notifications/read-all

Admin/moderation:
GET /api/admin/resources/flagged
PATCH /api/admin/resources/:id/status
GET /api/admin/users
PATCH /api/admin/users/:id/status
POST /api/admin/subjects
PATCH /api/admin/subjects/:id

# 58. Database Relationships

Main relationships:

User
  ├── Resource
  ├── Bookmark
  ├── Vote
  ├── Rating
  ├── Download
  ├── LostFoundItem
  └── Notification

Subject
  └── Resource

Resource
  └── ResourceTag

LostFoundItem
  └── optional matched LostFoundItem

Suggested tables:
- users
- subjects
- resources
- resource_tags
- bookmarks
- votes
- ratings
- downloads
- lost_found_items
- notifications
- moderation_actions

# 59. Security

Required production protections:
- server-side validation
- JWT/session verification
- role-based authorization
- ownership checks
- rate limiting
- secure file validation
- generated storage object names
- parameterized/ORM queries
- secret management through environment variables
- audit logs for moderation
- soft deletion
- abuse/report mechanisms

Personal information in Lost & Found must be minimized.

# 60. Error Handling

Use a consistent JSON error format:

{
  success: false,
  error: {
    code: "RESOURCE_NOT_FOUND",
    message: "The requested resource was not found."
  }
}

Suggested codes:
- UNAUTHORIZED
- FORBIDDEN
- VALIDATION_ERROR
- RESOURCE_NOT_FOUND
- SUBJECT_NOT_FOUND
- INVALID_FILE_TYPE
- FILE_TOO_LARGE
- DUPLICATE_BOOKMARK
- DUPLICATE_VOTE
- RATE_LIMITED
- INTERNAL_ERROR

# 61. Frontend-to-Backend Mapping

Home search -> GET /api/resources?q=...
LibraryExplorer -> GET /api/resources
ResourceDetail -> GET /api/resources/:id
DownloadButton -> GET /api/resources/:id/download
BookmarkButton -> bookmark endpoints
SavedShelf -> GET /api/bookmarks
UploadStudio -> POST /api/resources
LostFoundBoard -> Lost & Found endpoints
MatchMoment -> matching service
Notifications/toasts -> notification API + frontend feedback

The existing component architecture can therefore be retained while the data source moves from local TypeScript state to the API.

# 62. Production User Workflow

### New student
College email registration
 -> verification
 -> login
 -> browse subjects
 -> save resources
 -> download material

### Resource contributor
Login
 -> upload PDF
 -> add metadata
 -> server validates
 -> file stored
 -> resource published
 -> other students discover/download/vote

### Flagged resource
Resource receives negative votes
 -> threshold reached
 -> flagged
 -> moderator reviews
 -> keep / restore / remove

### Lost item
Student reports lost item
 -> record stored
 -> candidate found reports compared
 -> possible match notification
 -> contact finder
 -> confirmed reunion
 -> item closed

# 63. Future Enhancements

Possible future features that fit the existing design:
- PDF text extraction and full-text search
- semantic search
- resource recommendations
- duplicate document detection
- verified/official resource badges
- contribution leaderboard
- richer user profiles
- admin dashboard
- campus-specific configuration
- multiple colleges/campuses
- real-time notifications
- image-based Lost & Found matching
- automatic resource-quality checks
- content reporting
- audit logs
- offline-friendly mobile behavior

# 64. Implementation Boundary

The current GitHub repository should be considered the **presentation/prototype layer**.

Implemented:
- responsive interface
- navigation
- home discovery
- local resource search/filter/sort
- resource detail screens
- local bookmarks
- upload interaction simulation
- Lost & Found local board
- match animation
- notification/toast UI
- responsive mobile/desktop interactions

Planned:
- real authentication
- Express backend
- PostgreSQL
- Prisma
- persistent users
- persistent resources
- object storage
- real PDF uploads/downloads
- persistent bookmarks
- ratings/votes
- moderation and 10-downvote review rule
- server-backed search
- persistent Lost & Found
- dynamic matching
- protected contact
- persistent notifications

## 65. Recommended first backend milestone

The first production milestone should be:

Authentication + PostgreSQL + Prisma + Subjects + Resources + real PDF storage + Library API.

Once that works, the current Home, Library, Resource Detail, Saved and Upload screens can be connected incrementally without redesigning the user experience.
