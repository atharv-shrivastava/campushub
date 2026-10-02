import { notFound } from 'next/navigation'
import { resourceById, resources } from '@/lib/data'
import { ResourceDetail } from '@/components/resources/resource-detail'

export function generateStaticParams() {
  return resources.map((r) => ({ id: r.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const r = resourceById(id)
  return { title: r ? `${r.title} — CampusHub` : 'Resource — CampusHub' }
}

export default async function ResourcePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const resource = resourceById(id)
  if (!resource) notFound()
  return <ResourceDetail resource={resource} />
}
