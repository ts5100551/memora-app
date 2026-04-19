'use client'

import { useState, use, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { Link, Tag } from '@/types'
import { TagBadge } from '@/components/TagBadge'
import styles from './page.module.css'

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '')
  } catch {
    return url
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(path, options)
  if (!res.ok && res.status !== 204) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.error?.message ?? `Request failed: ${res.status}`)
  }
  return res
}

export default function LinkDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [link, setLink] = useState<Link | null | undefined>(undefined)
  const [allTags, setAllTags] = useState<Tag[]>([])
  const [showTagPicker, setShowTagPicker] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const refresh = useCallback(async () => {
    const [linkRes, tagsRes] = await Promise.all([
      fetch(`/api/links/${id}`),
      fetch('/api/tags'),
    ])
    if (linkRes.status === 404) { setLink(null); return }
    const linkData = await linkRes.json()
    const { data: tagsData } = await tagsRes.json()
    setLink(linkData)
    setAllTags(tagsData ?? [])
  }, [id])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh()
  }, [refresh])

  async function handleToggleRead() {
    if (!link) return
    await apiFetch(`/api/links/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_read: !link.is_read }),
    })
    await refresh()
  }

  async function handleDelete() {
    if (!link) return
    await apiFetch(`/api/links/${id}`, { method: 'DELETE' })
    router.push('/')
  }

  async function handleToggleTag(tagId: string) {
    if (!link) return
    const currentIds = link.tags?.map((t) => t.id) ?? []
    const newIds = currentIds.includes(tagId)
      ? currentIds.filter((tid) => tid !== tagId)
      : [...currentIds, tagId]
    await apiFetch(`/api/links/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tag_ids: newIds }),
    })
    await refresh()
  }

  if (link === undefined) {
    return (
      <div className="page-container">
        <p style={{ color: 'var(--color-text-secondary)' }}>Loading...</p>
      </div>
    )
  }

  if (link === null) {
    return (
      <div className="page-container">
        <div className={styles.notFound}>
          <p className={styles.notFoundIcon}>🔗</p>
          <h2>Link not found</h2>
          <p>This link may have been deleted.</p>
          <button className={styles.backBtn} onClick={() => router.push('/')}>
            ← Back to Home
          </button>
        </div>
      </div>
    )
  }

  const currentTagIds = link.tags?.map((t) => t.id) ?? []
  const unselectedTags = allTags.filter((t) => !currentTagIds.includes(t.id))

  return (
    <div className="page-container">
      <div className={styles.container}>
        {/* Back button */}
        <button className={styles.backBtn} onClick={() => router.push('/')}>
          ← Back
        </button>

        {/* Thumbnail */}
        {link.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={link.thumbnail_url}
            alt={link.title ?? 'Thumbnail'}
            className={styles.thumbnail}
          />
        ) : (
          <div className={styles.thumbnailPlaceholder}>
            <span>{getDomain(link.url)}</span>
          </div>
        )}

        {/* Title */}
        <h1 className={styles.title}>
          {link.title ?? getDomain(link.url)}
        </h1>

        {/* Meta */}
        <div className={styles.meta}>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.urlLink}
          >
            {getDomain(link.url)} ↗
          </a>
          <span className={styles.dot}>·</span>
          <span className={styles.date}>{formatDate(link.created_at)}</span>
          {link.is_read && <span className={styles.readBadge}>Read</span>}
        </div>

        {/* Description */}
        {link.description && (
          <p className={styles.description}>{link.description}</p>
        )}

        {/* Tags */}
        <div className={styles.tagsSection}>
          <p className={styles.sectionLabel}>Tags</p>
          <div className={styles.tagsList}>
            {(link.tags ?? []).map((tag) => (
              <TagBadge
                key={tag.id}
                tag={tag}
                onRemove={() => handleToggleTag(tag.id)}
              />
            ))}
            <button
              className={styles.addTagBtn}
              onClick={() => setShowTagPicker((v) => !v)}
              disabled={unselectedTags.length === 0}
              title={unselectedTags.length === 0 ? 'No more tags to add' : 'Add tag'}
            >
              + Tag
            </button>
          </div>

          {showTagPicker && unselectedTags.length > 0 && (
            <div className={styles.tagPicker}>
              {unselectedTags.map((tag) => (
                <button
                  key={tag.id}
                  className={styles.tagPickerItem}
                  onClick={() => { handleToggleTag(tag.id); setShowTagPicker(false) }}
                  style={{ borderLeftColor: tag.color }}
                >
                  <span
                    className={styles.tagPickerDot}
                    style={{ backgroundColor: tag.color }}
                  />
                  {tag.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnPrimary}
          >
            Open Original ↗
          </a>
          <button
            className={`${styles.btnSecondary} ${link.is_read ? styles.readActive : ''}`}
            onClick={handleToggleRead}
          >
            {link.is_read ? 'Mark as Unread' : 'Mark as Read'}
          </button>
          <button
            className={`${styles.btnDanger}`}
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete
          </button>
        </div>

        {/* Delete confirmation */}
        {showDeleteConfirm && (
          <div className={styles.confirmBox}>
            <p>Delete this link permanently?</p>
            <div className={styles.confirmActions}>
              <button className={styles.btnSecondary} onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button className={styles.btnDanger} onClick={handleDelete}>Delete</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
