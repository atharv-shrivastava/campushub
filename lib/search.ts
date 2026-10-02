import { categoryLabel, resources, subjectByCode, type Resource } from './data'

const aliases: Record<string, string> = {
  maths: 'mathematics',
  math: 'mathematics',
  paper: 'pyq',
  previous: 'pyq',
  practical: 'practical',
  ds: 'data structures',
}

function haystack(r: Resource) {
  const s = subjectByCode(r.subjectCode)
  return [r.title, s.name, s.code, s.short, r.category, categoryLabel[r.category], r.unit ?? '', r.tags.join(' '), r.year ?? '']
    .join(' ')
    .toLowerCase()
}

export function searchResources(query: string, pool: Resource[] = resources) {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => aliases[t] ?? t)
  if (!terms.length) return pool
  return pool.filter((r) => {
    const h = haystack(r)
    return terms.every((t) => t.split(' ').every((p) => h.includes(p)) || (t === 'pyq' && r.category === 'PYQ'))
  })
}
