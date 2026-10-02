'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ToastProvider } from './toast'
import { TopNav } from './top-nav'
import { MobileDock } from './mobile-dock'
import { CommandSearch } from './command-search'

type ShellContextValue = {
  openSearch: () => void
  saved: Set<string>
  toggleSaved: (id: string) => boolean
}

export const ShellContext = createContext<ShellContextValue>({
  openSearch: () => {},
  saved: new Set(),
  toggleSaved: () => false,
})

export const useShell = () => useContext(ShellContext)

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const immersive = pathname === '/'
  const [searchOpen, setSearchOpen] = useState(false)
  const [saved, setSaved] = useState<Set<string>>(
    () => new Set(['oop-notes-complete', 'dbms-normalisation']),
  )

  const toggleSaved = useCallback(
    (id: string) => {
      const willSave = !saved.has(id)
      setSaved((prev) => {
        const next = new Set(prev)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        return next
      })
      return willSave
    },
    [saved],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <ShellContext.Provider value={{ openSearch: () => setSearchOpen(true), saved, toggleSaved }}>
      <ToastProvider>
        {immersive ? (
          <main className="cube-route-root">{children}</main>
        ) : (
          <>
            <TopNav />
            <main className="mx-auto w-full max-w-6xl px-4 pb-32 pt-24 md:px-6 md:pb-20 md:pt-28">
              {children}
            </main>
            <MobileDock />
            <CommandSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
          </>
        )}
      </ToastProvider>
    </ShellContext.Provider>
  )
}
