'use client'

import { ThemeToggle } from '@/components/ThemeToggle'
import { useAuth } from '@/components/AuthProvider'
import { useLinks } from '@/hooks/useLinks'
import { useTags } from '@/hooks/useTags'
import styles from './settings.module.css'

export default function SettingsPage() {
  const { logout } = useAuth()
  const { links, isLoading: linksLoading } = useLinks()
  const { tags, isLoading: tagsLoading } = useTags()

  const isLoading = linksLoading || tagsLoading
  const readLinks = links.filter((l) => l.is_read).length

  return (
    <div className="page-container">
      <h1 className={styles.pageTitle}>Settings</h1>

      {/* Stats */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Overview</h2>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <p className={styles.statValue}>{isLoading ? '—' : links.length}</p>
            <p className={styles.statLabel}>Links saved</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statValue}>{isLoading ? '—' : readLinks}</p>
            <p className={styles.statLabel}>Read</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statValue}>{isLoading ? '—' : links.length - readLinks}</p>
            <p className={styles.statLabel}>Unread</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statValue}>{isLoading ? '—' : tags.length}</p>
            <p className={styles.statLabel}>Tags</p>
          </div>
        </div>
      </section>

      <hr className={styles.divider} />

      {/* Appearance */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Appearance</h2>
        <div className={styles.row}>
          <label className={styles.rowLabel}>Theme</label>
          <ThemeToggle />
        </div>
      </section>

      <hr className={styles.divider} />

      {/* Account */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Account</h2>
        <div className={styles.row}>
          <div>
            <p className={styles.rowLabel}>Authentication</p>
            <p className={styles.rowDesc}>Signed in with Google.</p>
          </div>
        </div>
        <button className={`${styles.logoutBtn} press-scale`} onClick={logout} type="button">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" width={16} height={16}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
          </svg>
          Log out
        </button>
      </section>
    </div>
  )
}
