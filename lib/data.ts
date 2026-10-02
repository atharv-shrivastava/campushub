export type Category = 'Notes' | 'Assignment' | 'Practical' | 'PYQ' | 'Lab Manual' | 'Syllabus'

export type Subject = {
  code: string
  name: string
  short: string
  semester: number
  count: number
}

export type Resource = {
  id: string
  title: string
  subjectCode: string
  category: Category
  semester: number
  unit?: string
  uploader: { name: string; initials: string; branch: string }
  uploadedAt: string
  pages: number
  sizeMb: number
  downloads: number
  rating: number
  year?: number
  tags: string[]
  description: string
}

export const subjects: Subject[] = [
  { code: 'CS-204', name: 'Data Structures', short: 'DS', semester: 3, count: 48 },
  { code: 'CS-202', name: 'Object Oriented Programming', short: 'OOP', semester: 3, count: 36 },
  { code: 'MA-201', name: 'Engineering Mathematics II', short: 'Maths', semester: 2, count: 41 },
  { code: 'CS-301', name: 'Database Management Systems', short: 'DBMS', semester: 5, count: 29 },
  { code: 'CS-302', name: 'Operating Systems', short: 'OS', semester: 5, count: 33 },
  { code: 'CS-303', name: 'Computer Networks', short: 'CN', semester: 5, count: 22 },
  { code: 'EC-205', name: 'Digital Electronics', short: 'DE', semester: 3, count: 18 },
]

export const categories: Category[] = ['Notes', 'Assignment', 'Practical', 'PYQ', 'Lab Manual', 'Syllabus']

export const categoryLabel: Record<Category, string> = {
  Notes: 'Notes',
  Assignment: 'Assignment',
  Practical: 'Practical file',
  PYQ: 'Previous paper',
  'Lab Manual': 'Lab manual',
  Syllabus: 'Syllabus',
}

export const resources: Resource[] = [
  {
    id: 'ds-unit-3-trees',
    title: 'Unit 3 — Trees, BST & AVL Rotations',
    subjectCode: 'CS-204',
    category: 'Notes',
    semester: 3,
    unit: 'Unit 3',
    uploader: { name: 'Aanya Sharma', initials: 'AS', branch: 'CSE · 2nd yr' },
    uploadedAt: '2 days ago',
    pages: 24,
    sizeMb: 3.2,
    downloads: 1284,
    rating: 4.9,
    tags: ['handwritten', 'diagrams', 'exam-ready'],
    description:
      'Beautifully handwritten notes covering binary trees, traversal, BST insertion/deletion and every AVL rotation with step-by-step diagrams.',
  },
  {
    id: 'cs204-practical-file',
    title: 'CS-204 Practical File — All 12 Programs',
    subjectCode: 'CS-204',
    category: 'Practical',
    semester: 3,
    uploader: { name: 'Rohan Mehta', initials: 'RM', branch: 'CSE · 2nd yr' },
    uploadedAt: '5 days ago',
    pages: 38,
    sizeMb: 5.8,
    downloads: 942,
    rating: 4.7,
    tags: ['C++', 'outputs included'],
    description:
      'Complete practical file with aim, algorithm, code and output screenshots for stacks, queues, linked lists, sorting and graph traversals.',
  },
  {
    id: 'oop-notes-complete',
    title: 'OOP Complete Notes — Classes to Polymorphism',
    subjectCode: 'CS-202',
    category: 'Notes',
    semester: 3,
    unit: 'Units 1–5',
    uploader: { name: 'Ishaan Verma', initials: 'IV', branch: 'IT · 2nd yr' },
    uploadedAt: '1 week ago',
    pages: 56,
    sizeMb: 7.1,
    downloads: 2310,
    rating: 4.8,
    tags: ['typed', 'Java examples'],
    description:
      'A tidy, typed compilation of the entire OOP syllabus with Java snippets, UML sketches and quick-revision boxes at the end of each unit.',
  },
  {
    id: 'maths-pyq-2024',
    title: 'Engineering Maths II — End Sem 2024',
    subjectCode: 'MA-201',
    category: 'PYQ',
    semester: 2,
    year: 2024,
    uploader: { name: 'Meera Iyer', initials: 'MI', branch: 'ECE · 1st yr' },
    uploadedAt: '3 weeks ago',
    pages: 4,
    sizeMb: 0.9,
    downloads: 3120,
    rating: 4.6,
    tags: ['with solutions'],
    description: 'Original end-semester paper with fully worked solutions for Laplace transforms and vector calculus.',
  },
  {
    id: 'ds-assignment-2',
    title: 'Assignment 2 — Linked List Problems',
    subjectCode: 'CS-204',
    category: 'Assignment',
    semester: 3,
    uploader: { name: 'Kabir Singh', initials: 'KS', branch: 'CSE · 2nd yr' },
    uploadedAt: 'Yesterday',
    pages: 9,
    sizeMb: 1.4,
    downloads: 412,
    rating: 4.5,
    tags: ['due Oct 18'],
    description: 'Ten linked-list questions with dry runs. Reference only — please write your own solutions ✦',
  },
  {
    id: 'dbms-normalisation',
    title: 'Normalisation Cheatsheet — 1NF to BCNF',
    subjectCode: 'CS-301',
    category: 'Notes',
    semester: 5,
    unit: 'Unit 2',
    uploader: { name: 'Zoya Khan', initials: 'ZK', branch: 'CSE · 3rd yr' },
    uploadedAt: '4 days ago',
    pages: 6,
    sizeMb: 1.1,
    downloads: 1876,
    rating: 5.0,
    tags: ['one-pager', 'colour coded'],
    description: 'Every normal form on one colour-coded page with functional dependency examples.',
  },
  {
    id: 'os-lab-manual',
    title: 'OS Lab Manual — Scheduling & Deadlocks',
    subjectCode: 'CS-302',
    category: 'Lab Manual',
    semester: 5,
    uploader: { name: 'Dev Patel', initials: 'DP', branch: 'CSE · 3rd yr' },
    uploadedAt: '2 weeks ago',
    pages: 31,
    sizeMb: 4.0,
    downloads: 688,
    rating: 4.4,
    tags: ['official'],
    description: "Department lab manual with FCFS, SJF, Round Robin and Banker's algorithm experiments.",
  },
  {
    id: 'ds-pyq-2023',
    title: 'Data Structures — Mid Sem 2023',
    subjectCode: 'CS-204',
    category: 'PYQ',
    semester: 3,
    year: 2023,
    uploader: { name: 'Aanya Sharma', initials: 'AS', branch: 'CSE · 2nd yr' },
    uploadedAt: '1 month ago',
    pages: 2,
    sizeMb: 0.6,
    downloads: 2045,
    rating: 4.7,
    tags: ['scanned'],
    description: 'Mid-semester question paper — trees, hashing and complexity analysis.',
  },
  {
    id: 'cn-syllabus',
    title: 'Computer Networks — Syllabus 2025–26',
    subjectCode: 'CS-303',
    category: 'Syllabus',
    semester: 5,
    uploader: { name: 'CampusHub Team', initials: 'CH', branch: 'Official' },
    uploadedAt: '2 months ago',
    pages: 3,
    sizeMb: 0.3,
    downloads: 954,
    rating: 4.3,
    tags: ['official'],
    description: 'The updated unit-wise syllabus with reference books and marking scheme.',
  },
  {
    id: 'de-practical-kmaps',
    title: 'K-Maps & Logic Gates Practical',
    subjectCode: 'EC-205',
    category: 'Practical',
    semester: 3,
    uploader: { name: 'Nikhil Rao', initials: 'NR', branch: 'ECE · 2nd yr' },
    uploadedAt: '6 days ago',
    pages: 14,
    sizeMb: 2.2,
    downloads: 301,
    rating: 4.2,
    tags: ['circuit diagrams'],
    description: 'Breadboard experiments for logic gates and K-map simplification with truth tables.',
  },
]

export const subjectByCode = (code: string) => subjects.find((s) => s.code === code)!
export const resourceById = (id: string) => resources.find((r) => r.id === id)

export type LostFoundStatus = 'lost' | 'found' | 'matched'
export type LostFoundCategory = 'Electronics' | 'ID Card' | 'Books' | 'Accessories' | 'Keys' | 'Bottles'

export type LostFoundItem = {
  id: string
  status: LostFoundStatus
  title: string
  category: LostFoundCategory
  location: string
  when: string
  description: string
  reporter: { name: string; initials: string }
  color: string
}

export const lostFoundItems: LostFoundItem[] = [
  {
    id: 'lf-1',
    status: 'lost',
    title: 'Sage green AirPods case',
    category: 'Electronics',
    location: 'Central Library, 2nd floor',
    when: 'Today, 11:20 am',
    description: 'Has a tiny champagne star sticker on the lid. Left near the window desks.',
    reporter: { name: 'Aanya S.', initials: 'AS' },
    color: '#D9E5DC',
  },
  {
    id: 'lf-2',
    status: 'found',
    title: 'Green earbuds case with star sticker',
    category: 'Electronics',
    location: 'Library reading hall',
    when: 'Today, 1:05 pm',
    description: 'Found on a window desk. Handed to the library front counter.',
    reporter: { name: 'Kabir S.', initials: 'KS' },
    color: '#D9E5DC',
  },
  {
    id: 'lf-3',
    status: 'lost',
    title: 'Student ID — Rohan Mehta',
    category: 'ID Card',
    location: 'Canteen / Block C',
    when: 'Yesterday',
    description: 'Blue lanyard with a metro card tucked behind it.',
    reporter: { name: 'Rohan M.', initials: 'RM' },
    color: '#F3E4C3',
  },
  {
    id: 'lf-4',
    status: 'found',
    title: 'Steel water bottle (dented)',
    category: 'Bottles',
    location: 'Basketball court',
    when: '2 days ago',
    description: 'Matte black, has a "DS > Algo" sticker. With the sports office.',
    reporter: { name: 'Zoya K.', initials: 'ZK' },
    color: '#E9D3C5',
  },
  {
    id: 'lf-5',
    status: 'lost',
    title: 'Yellow scientific calculator',
    category: 'Accessories',
    location: 'Exam Hall 3',
    when: '3 days ago',
    description: 'Casio fx-991ES with my name scratched on the back.',
    reporter: { name: 'Meera I.', initials: 'MI' },
    color: '#F3E4C3',
  },
  {
    id: 'lf-6',
    status: 'matched',
    title: 'Hostel room keys (Room 214)',
    category: 'Keys',
    location: 'Hostel B lobby',
    when: 'Last week',
    description: 'Reunited with owner ✦',
    reporter: { name: 'Dev P.', initials: 'DP' },
    color: '#D9E5DC',
  },
  {
    id: 'lf-7',
    status: 'found',
    title: '"Let Us C" — annotated copy',
    category: 'Books',
    location: 'Lab 4, Block A',
    when: '4 days ago',
    description: 'Lots of pencil notes in the margins. Left on the bench after practical.',
    reporter: { name: 'Nikhil R.', initials: 'NR' },
    color: '#FAF7EF',
  },
]

export const searchSuggestions = [
  'Data Structures Unit 3',
  'CS-204 practical',
  'OOP notes',
  'Maths previous paper',
  'DBMS normalisation',
]
