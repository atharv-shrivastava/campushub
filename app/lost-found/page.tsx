import type { Metadata } from 'next'
import { LostFoundBoard } from '@/components/lost-found/lost-found-board'

export const metadata: Metadata = { title: 'Lost & Found — CampusHub' }

export default function LostFoundPage() {
  return <LostFoundBoard />
}
