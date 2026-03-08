'use client'

import { useTheme } from '@/components/ThemeProvider'
import { THEMES } from '@/constants/theme'
import type { Theme } from '@/types'

const THEME_LABELS: Record<Theme, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="theme-toggle" role="group" aria-label="Theme selection">
      {THEMES.map((t) => (
        <button
          key={t}
          type="button"
          className={`theme-toggle-btn${theme === t ? ' active' : ''}`}
          onClick={() => setTheme(t)}
          aria-pressed={theme === t}
        >
          {THEME_LABELS[t]}
        </button>
      ))}
    </div>
  )
}
