'use client'

import { ThemeToggle } from '@/components/ThemeToggle'
import { useAuth } from '@/components/AuthProvider'
import { getLinks, getTags } from '@/lib/mockStore'
import { useEffect, useState } from 'react'
import styles from './settings.module.css'

/**
 * Settings page — theme preferences, statistics, and account actions.
 */
export default function SettingsPage() {
  const { logout } = useAuth()
  const [stats, setStats] = useState({ links: 0, readLinks: 0, tags: 0 })

  useEffect(() => {
    const links = getLinks()
    const tags = getTags()
    setStats({
      links: links.length,
      readLinks: links.filter((l) => l.is_read).length,
      tags: tags.length,
    })
  }, [])

  return (
    <div className="page-container">
      <h1 className={styles.pageTitle}>Settings</h1>

      {/* Stats */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Overview</h2>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <p className={styles.statValue}>{stats.links}</p>
            <p className={styles.statLabel}>Links saved</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statValue}>{stats.readLinks}</p>
            <p className={styles.statLabel}>Read</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statValue}>{stats.links - stats.readLinks}</p>
            <p className={styles.statLabel}>Unread</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statValue}>{stats.tags}</p>
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
            <p className={styles.rowDesc}>
              Currently using mock authentication. Google OAuth will be enabled in a future update.
            </p>
          </div>
        </div>
        <button className={styles.logoutBtn} onClick={logout} type="button">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" width={16} height={16}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
          </svg>
          Log out
        </button>
      </section>
    </div>
  )
}
