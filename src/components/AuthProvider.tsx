'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Sidebar, BottomNav } from '@/components/Navigation'

/** Mock auth state stored in localStorage under this key. */
const STORAGE_KEY = 'mock_auth'

interface AuthContextValue {
  isLoggedIn: boolean
  /** Mock login — sets auth state without real OAuth. */
  login: () => void
  /** Clears auth state and redirects to /login. */
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

/**
 * Returns the mock auth context value.
 *
 * Raises:
 *   Error if called outside of AuthProvider.
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

/**
 * Provides mock authentication state for the app.
 *
 * - Persists login state to localStorage.
 * - Renders the full app shell (Sidebar + BottomNav) when logged in.
 * - Renders bare children on the /login page.
 * - Redirects unauthenticated users to /login.
 * - Redirects already-authenticated users away from /login.
 *
 * Args:
 *   children: Page content to render.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Hydrate auth state from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    setIsLoggedIn(stored === 'true')
    setMounted(true)
  }, [])

  // Handle redirects based on auth state
  useEffect(() => {
    if (!mounted) return
    if (!isLoggedIn && pathname !== '/login') {
      router.replace('/login')
    }
    if (isLoggedIn && pathname === '/login') {
      router.replace('/')
    }
  }, [isLoggedIn, mounted, pathname, router])

  const login = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, 'true')
    setIsLoggedIn(true)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setIsLoggedIn(false)
  }, [])

  // Render nothing during SSR / before hydration to avoid flash
  if (!mounted) return null

  // Login page: render without nav shell
  if (pathname === '/login') {
    return (
      <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
        {children}
      </AuthContext.Provider>
    )
  }

  // Not logged in: render nothing while redirect takes effect
  if (!isLoggedIn) return null

  // Logged in: render full app shell
  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
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
