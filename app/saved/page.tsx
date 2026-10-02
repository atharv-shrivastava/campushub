import type { Metadata } from 'next'
import { SavedShelf } from '@/components/saved/saved-shelf'

export const metadata: Metadata = { title: 'Saved — CampusHub' }

export default function SavedPage() {
  return <SavedShelf />
}
