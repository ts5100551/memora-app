'use client'

import Link from 'next/link'
import type { Tag as TagType } from '@/types'
import type { Link as LinkType } from '@/types'
import { TagBadge } from './TagBadge'
import styles from './LinkCard.module.css'

interface LinkCardProps {
  link: LinkType
  onDelete: (id: string) => void
  onToggleRead: (id: string) => void
  onTagClick?: (tagId: string) => void
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '')
  } catch {
    return url
  }
}

export function LinkCard({ link, onDelete, onToggleRead, onTagClick }: LinkCardProps) {
  const tags: TagType[] = link.tags ?? []

  return (
    <article className={`${styles.card} ${link.is_read ? styles.read : ''}`}>
      {/* Thumbnail */}
      <Link href={`/links/${link.id}`} className={styles.thumbnailWrap}>
        {link.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={link.thumbnail_url}
            alt={link.title ?? 'Link thumbnail'}
            className={styles.thumbnail}
            loading="lazy"
          />
        ) : (
          <div className={styles.thumbnailPlaceholder}>
            <span className={styles.placeholderDomain}>{getDomain(link.url)}</span>
          </div>
        )}
      </Link>

      {/* Body */}
      <div className={styles.body}>
        <Link href={`/links/${link.id}`} className={styles.titleLink}>
          <h3 className={styles.title}>
            {link.title ?? getDomain(link.url)}
          </h3>
        </Link>

        {link.description && (
          <p className={styles.description}>{link.description}</p>
        )}

        <p className={styles.domain}>{getDomain(link.url)}</p>

        {tags.length > 0 && (
          <div className={styles.tags}>
            {tags.map((tag) => (
              <TagBadge
                key={tag.id}
                tag={tag}
                onClick={onTagClick ? () => onTagClick(tag.id) : undefined}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        <div className={styles.footer}>
          <span className={styles.date}>{formatDate(link.created_at)}</span>
          <div className={styles.actions}>
            <button
              className={`${styles.actionBtn} ${link.is_read ? styles.readBtn : styles.unreadBtn}`}
              onClick={() => onToggleRead(link.id)}
              title={link.is_read ? 'Mark as unread' : 'Mark as read'}
            >
              {link.is_read ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                  <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" width="16" height="16">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              )}
            </button>
            <button
              className={`${styles.actionBtn} ${styles.deleteBtn}`}
              onClick={() => onDelete(link.id)}
              title="Delete link"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" width="16" height="16">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
