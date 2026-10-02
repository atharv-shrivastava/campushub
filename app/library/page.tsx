import type { Metadata } from 'next'
import { LibraryExplorer } from '@/components/library/library-explorer'

export const metadata: Metadata = { title: 'Library — CampusHub' }

export default async function LibraryPage({ searchParams }: { searchParams: Promise<{ q?: string; subject?: string }> }) {
  const { q = '', subject = '' } = await searchParams
  return <LibraryExplorer key={`${q}-${subject}`} initialQuery={q} initialSubject={subject} />
}
