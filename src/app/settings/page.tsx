import { ThemeToggle } from '@/components/ThemeToggle'

export default function SettingsPage() {
  return (
    <div className="page-container">
      <h1 style={{ color: 'var(--color-text)', marginBottom: '8px' }}>
        Settings
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
        Theme and account settings. Coming soon.
      </p>
      <div style={{ maxWidth: '280px' }}>
        <label
          style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: 'var(--color-text-secondary)',
            marginBottom: '8px',
          }}
        >
          Theme
        </label>
        <ThemeToggle />
      </div>
    </div>
  )
}
