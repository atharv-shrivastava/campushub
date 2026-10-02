import type { Metadata } from 'next'
import { UploadStudio } from '@/components/upload/upload-studio'

export const metadata: Metadata = { title: 'Upload — CampusHub' }

export default function UploadPage() {
  return <UploadStudio />
}
