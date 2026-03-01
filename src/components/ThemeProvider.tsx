'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { Theme } from '@/types'
import { THEME_KEY } from '@/constants/theme'

interface ThemeContextValue {
    theme: Theme
    resolvedTheme: 'light' | 'dark'
    setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue>({
    theme: 'system',
    resolvedTheme: 'light',
    setTheme: () => { },
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('system')
    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')

    // Apply theme to DOM
    const applyTheme = (t: Theme) => {
        const isDark =
            t === 'dark' ||
            (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
        setResolvedTheme(isDark ? 'dark' : 'light')
    }

    // Initialize from localStorage
    useEffect(() => {
        const saved = (localStorage.getItem(THEME_KEY) as Theme) || 'system'
        setThemeState(saved)
        applyTheme(saved)

        // Listen for system preference changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const handler = () => {
            if (saved === 'system') applyTheme('system')
        }
        mediaQuery.addEventListener('change', handler)
        return () => mediaQuery.removeEventListener('change', handler)
    }, [])

    const setTheme = (t: Theme) => {
        setThemeState(t)
        localStorage.setItem(THEME_KEY, t)
        applyTheme(t)
    }

    return (
        <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => useContext(ThemeContext)
