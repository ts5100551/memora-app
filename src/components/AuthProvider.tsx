'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { Sidebar, BottomNav } from '@/components/Navigation'

interface AuthContextValue {
  isLoggedIn: boolean
  user: User | null
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

/**
 * Provides Supabase authentication state for the app.
 *
 * - Syncs session from Supabase on mount and subscribes to auth changes.
 * - Renders the full app shell (Sidebar + BottomNav) when logged in.
 * - Renders bare children on the /login page.
 * - Redirects unauthenticated users to /login (client-side fallback;
 *   middleware.ts handles the server-side redirect).
 *
 * Args:
 *   children: Page content to render.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setMounted(true)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!mounted) return
    if (!user && pathname !== '/login') router.replace('/login')
    if (user && pathname === '/login') router.replace('/')
  }, [user, mounted, pathname, router])

  const logout = async () => {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  if (!mounted) return null

  const isLoggedIn = !!user

  if (pathname === '/login') {
    return (
      <AuthContext.Provider value={{ isLoggedIn, user, logout }}>
        {children}
      </AuthContext.Provider>
    )
  }

  if (!isLoggedIn) return null

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, logout }}>
      <div className="app-shell">
        <Sidebar />
        <BottomNav />
        <main className="main-content">
          {children}
        </main>
      </div>
    </AuthContext.Provider>
  )
}
