'use client'

import { useState, useEffect, useRef } from 'react'
import type { Tag } from '@/types'
import { TagBadge } from './TagBadge'
import styles from './AddLinkModal.module.css'

interface MetadataPreview {
  title: string | null
  description: string | null
  thumbnail_url: string | null
  site_name: string | null
}

interface AddLinkModalProps {
  tags: Tag[]
  onSave: (url: string, metadata: MetadataPreview, tagIds: string[]) => void
  onClose: () => void
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '')
  } catch {
    return url
  }
}

async function fetchMetadataFromApi(url: string): Promise<MetadataPreview> {
  try {
    const res = await fetch('/api/metadata', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    })
    if (!res.ok) throw new Error('fetch failed')
    return await res.json()
  } catch {
    return { title: null, description: null, thumbnail_url: null, site_name: getDomain(url) }
  }
}

export function AddLinkModal({ tags, onSave, onClose }: AddLinkModalProps) {
  const [step, setStep] = useState<'input' | 'preview'>('input')
  const [url, setUrl] = useState('')
  const [urlError, setUrlError] = useState('')
  const [isFetching, setIsFetching] = useState(false)
  const [preview, setPreview] = useState<MetadataPreview | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
  const urlInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    urlInputRef.current?.focus()
  }, [])

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  function isValidUrl(value: string): boolean {
    try {
      const u = new URL(value)
      return u.protocol === 'http:' || u.protocol === 'https:'
    } catch {
      return false
    }
  }

  async function handleFetchPreview() {
    setUrlError('')
    if (!url.trim()) {
      setUrlError('Please enter a URL.')
      return
    }
    const normalized = url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`
    if (!isValidUrl(normalized)) {
      setUrlError('Please enter a valid URL (e.g. https://example.com).')
      return
    }
    setUrl(normalized)
    setIsFetching(true)
    const meta = await fetchMetadataFromApi(normalized)
    setPreview(meta)
    setEditTitle(meta.title ?? '')
    setEditDescription(meta.description ?? '')
    setStep('preview')
    setIsFetching(false)
  }

  function handleSave() {
    if (!preview) return
    try {
      onSave(
        url,
        {
          ...preview,
          title: editTitle.trim() || null,
          description: editDescription.trim() || null,
        },
        selectedTagIds
      )
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('CONFLICT')) {
        setUrlError('This URL has already been saved.')
        setStep('input')
      }
    }
  }

  function toggleTag(tagId: string) {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    )
  }

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Add Link">
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            {step === 'input' ? 'Add Link' : 'Preview & Save'}
          </h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="18" height="18">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Step 1: URL Input */}
        {step === 'input' && (
          <div className={styles.body}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="link-url">URL</label>
              <input
                id="link-url"
                ref={urlInputRef}
                type="url"
                className={`${styles.input} ${urlError ? styles.inputError : ''}`}
                placeholder="https://example.com/article"
                value={url}
                onChange={(e) => { setUrl(e.target.value); setUrlError('') }}
                onKeyDown={(e) => e.key === 'Enter' && handleFetchPreview()}
              />
              {urlError && <p className={styles.errorMsg}>{urlError}</p>}
            </div>
            <div className={styles.footer}>
              <button className={styles.btnSecondary} onClick={onClose}>Cancel</button>
              <button
                className={styles.btnPrimary}
                onClick={handleFetchPreview}
                disabled={isFetching}
              >
                {isFetching ? 'Fetching...' : 'Preview →'}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Preview + Edit */}
        {step === 'preview' && preview && (
          <div className={styles.body}>
            {/* Thumbnail */}
            {preview.thumbnail_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview.thumbnail_url} alt="Preview thumbnail" className={styles.previewImg} />
            ) : (
              <div className={styles.previewImgPlaceholder}>
                <span>{preview.site_name ?? getDomain(url)}</span>
              </div>
            )}

            <p className={styles.previewUrl}>{url}</p>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="link-title">Title</label>
              <input
                id="link-title"
                type="text"
                className={styles.input}
                placeholder="Enter a title (optional)"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="link-desc">Description</label>
              <textarea
                id="link-desc"
                className={styles.textarea}
                placeholder="Enter a description (optional)"
                value={editDescription}
                rows={3}
                onChange={(e) => setEditDescription(e.target.value)}
              />
            </div>

            {tags.length > 0 && (
              <div className={styles.field}>
                <label className={styles.label}>Tags</label>
                <div className={styles.tagList}>
                  {tags.map((tag) => (
                    <TagBadge
                      key={tag.id}
                      tag={tag}
                      onClick={() => toggleTag(tag.id)}
                      active={selectedTagIds.includes(tag.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className={styles.footer}>
              <button className={styles.btnSecondary} onClick={() => setStep('input')}>
                ← Back
              </button>
              <button className={styles.btnPrimary} onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
