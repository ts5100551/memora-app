'use client'

import { ThemeToggle } from '@/components/ThemeToggle'
import { useAuth } from '@/components/AuthProvider'

/**
 * Settings page — theme preferences and account actions.
 *
 * Currently includes:
 *   - Theme selector (light / dark / system)
 *   - Log out button (mock — clears localStorage session)
 */
export default function SettingsPage() {
  const { logout } = useAuth()

  return (
    <div className="page-container">
      <h1 style={{ color: 'var(--color-text)', marginBottom: '8px' }}>
        Settings
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '32px' }}>
        Theme and account settings.
      </p>

      {/* Appearance */}
      <section style={{ marginBottom: '32px' }}>
        <h2 className="settings-section-title">Appearance</h2>
        <div style={{ maxWidth: '280px' }}>
          <label className="settings-label">Theme</label>
          <ThemeToggle />
        </div>
      </section>

      <hr className="settings-divider" />

      {/* Account */}
      <section style={{ marginTop: '32px' }}>
        <h2 className="settings-section-title">Account</h2>
        <button className="settings-logout-btn" onClick={logout} type="button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            width={18}
            height={18}
            style={{ flexShrink: 0 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
          </svg>
          Log out
        </button>
      </section>
    </div>
  )
}
