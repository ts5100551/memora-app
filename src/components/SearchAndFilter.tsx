'use client'

import { useEffect, useRef, useState } from 'react'
import type { Tag } from '@/types'
import styles from './SearchAndFilter.module.css'

interface SearchAndFilterProps {
  search: string
  onSearchChange: (v: string) => void
  tags: Tag[]
  filterTagId: string | null
  onFilterTagChange: (id: string | null) => void
  filterUnread: boolean
  onFilterUnreadChange: (v: boolean) => void
  resultCount: number
  totalCount: number
}

export function SearchAndFilter({
  search,
  onSearchChange,
  tags,
  filterTagId,
  onFilterTagChange,
  filterUnread,
  onFilterUnreadChange,
  resultCount,
  totalCount,
}: SearchAndFilterProps) {
  const [debounced, setDebounced] = useState(search)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleInput(value: string) {
    setDebounced(value)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => onSearchChange(value), 300)
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const isFiltered = search || filterTagId || filterUnread

  return (
    <div className={styles.wrap}>
      {/* Search row */}
      <div className={styles.searchRow}>
        <div className={styles.searchWrap}>
          <svg className={styles.searchIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" width="16" height="16">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Search links..."
            value={debounced}
            onChange={(e) => handleInput(e.target.value)}
          />
          {debounced && (
            <button
              className={styles.clearBtn}
              onClick={() => { setDebounced(''); onSearchChange('') }}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <button
          className={`${styles.filterBtn} ${filterUnread ? styles.active : ''}`}
          onClick={() => onFilterUnreadChange(!filterUnread)}
          title={filterUnread ? 'Show all' : 'Show unread only'}
        >
          Unread
        </button>
      </div>

      {/* Tag filter chips */}
      {tags.length > 0 && (
        <div className={styles.tagRow}>
          {tags.map((tag) => (
            <button
              key={tag.id}
              className={`${styles.tagChip} ${filterTagId === tag.id ? styles.tagChipActive : ''}`}
              style={filterTagId === tag.id ? { backgroundColor: tag.color, borderColor: tag.color, color: '#fff' } : { borderColor: tag.color, color: tag.color }}
              onClick={() => onFilterTagChange(filterTagId === tag.id ? null : tag.id)}
            >
              {tag.name}
            </button>
          ))}
        </div>
      )}

      {/* Result count */}
      {isFiltered && (
        <p className={styles.count}>
          {resultCount === totalCount
            ? `${totalCount} link${totalCount !== 1 ? 's' : ''}`
            : `${resultCount} of ${totalCount} link${totalCount !== 1 ? 's' : ''}`}
        </p>
      )}
    </div>
  )
}
