'use client'

import { useState } from 'react'
import { useLinks } from '@/hooks/useLinks'
import { useTags } from '@/hooks/useTags'
import { LinkCard } from '@/components/LinkCard'
import { AddLinkModal } from '@/components/AddLinkModal'
import { SearchAndFilter } from '@/components/SearchAndFilter'
import { SkeletonCard } from '@/components/SkeletonCard'
import styles from './home.module.css'

export default function HomePage() {
  const {
    links,
    filteredLinks,
    isLoading,
    search,
    setSearch,
    filterTagId,
    setFilterTagId,
    filterUnread,
    setFilterUnread,
    addLink,
    removeLink,
    toggleRead,
  } = useLinks()

  const { tags } = useTags()
  const [showModal, setShowModal] = useState(false)

  function handleSave(
    url: string,
    metadata: { title: string | null; description: string | null; thumbnail_url: string | null; site_name: string | null },
    tagIds: string[]
  ) {
    addLink({
      url,
      title: metadata.title,
      description: metadata.description,
      thumbnail_url: metadata.thumbnail_url,
      tag_ids: tagIds,
    })
    setShowModal(false)
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.pageTitle}>My Links</h1>
          {!isLoading && links.length > 0 && (
            <p className={styles.subtitle}>
              {links.length} link{links.length !== 1 ? 's' : ''} saved
            </p>
          )}
        </div>
        <button className={styles.addBtn} onClick={() => setShowModal(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" width="16" height="16">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Link
        </button>
      </div>

      {/* Search & Filter (show only when there are links) */}
      {!isLoading && links.length > 0 && (
        <SearchAndFilter
          search={search}
          onSearchChange={setSearch}
          tags={tags}
          filterTagId={filterTagId}
          onFilterTagChange={setFilterTagId}
          filterUnread={filterUnread}
          onFilterUnreadChange={setFilterUnread}
          resultCount={filteredLinks.length}
          totalCount={links.length}
        />
      )}

      {/* Loading skeletons */}
      {isLoading && (
        <div className={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && links.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🔖</div>
          <h2 className={styles.emptyTitle}>No links yet</h2>
          <p className={styles.emptyDesc}>
            Start saving interesting articles, videos, and pages you want to revisit.
          </p>
          <button className={styles.addBtn} onClick={() => setShowModal(true)}>
            Add your first link
          </button>
        </div>
      )}

      {/* No results after filter */}
      {!isLoading && links.length > 0 && filteredLinks.length === 0 && (
        <div className={styles.noResults}>
          <p>No links match your current filters.</p>
          <button
            className={styles.clearFiltersBtn}
            onClick={() => { setSearch(''); setFilterTagId(null); setFilterUnread(false) }}
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Link cards grid */}
      {!isLoading && filteredLinks.length > 0 && (
        <div className={styles.grid}>
          {filteredLinks.map((link) => (
            <LinkCard
              key={link.id}
              link={link}
              onDelete={removeLink}
              onToggleRead={toggleRead}
              onTagClick={(tagId) => setFilterTagId(filterTagId === tagId ? null : tagId)}
            />
          ))}
        </div>
      )}

      {/* Add Link Modal */}
      {showModal && (
        <AddLinkModal
          tags={tags}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}
