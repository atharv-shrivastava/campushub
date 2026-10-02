import { BookOpen, Bookmark, Home, Search, Upload } from 'lucide-react'

export const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/library', label: 'Library', icon: BookOpen },
  { href: '/upload', label: 'Upload', icon: Upload },
  { href: '/lost-found', label: 'Lost & Found', icon: Search },
  { href: '/saved', label: 'Saved', icon: Bookmark },
]

export const isActive = (pathname: string, href: string) =>
  href === '/' ? pathname === '/' : pathname.startsWith(href) || (href === '/library' && pathname.startsWith('/resource'))
