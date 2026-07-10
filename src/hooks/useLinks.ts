'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import type { Link } from '@/types'

export interface CreateLinkInput {
  url: string
  source?: string
  title?: string | null
  description?: string | null
  thumbnail_url?: string | null
  tag_ids?: string[]
}

export interface UseLinksReturn {
  links: Link[]
  filteredLinks: Link[]
  isLoading: boolean
  search: string
  setSearch: (v: string) => void
  filterTagId: string | null
  setFilterTagId: (v: string | null) => void
  filterUnread: boolean
  setFilterUnread: (v: boolean) => void
  addLink: (input: CreateLinkInput) => Promise<Link>
  removeLink: (id: string) => Promise<void>
  toggleRead: (id: string) => Promise<void>
  updateLinkTags: (id: string, tagIds: string[]) => Promise<void>
  refresh: () => Promise<void>
}

async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(path, options)
  if (!res.ok && res.status !== 204) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.error?.message ?? `Request failed: ${res.status}`)
  }
  return res
}

export function useLinks(): UseLinksReturn {
  const [links, setLinks] = useState<Link[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterTagId, setFilterTagId] = useState<string | null>(null)
  const [filterUnread, setFilterUnread] = useState(false)

  const refresh = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await apiFetch('/api/links')
      const { data } = await res.json()
      setLinks(data ?? [])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addLink = useCallback(
    async (input: CreateLinkInput): Promise<Link> => {
      const res = await apiFetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      const newLink: Link = await res.json()
      await refresh()
      return newLink
    },
    [refresh]
  )

  const removeLink = useCallback(
    async (id: string) => {
      await apiFetch(`/api/links/${id}`, { method: 'DELETE' })
      await refresh()
    },
    [refresh]
  )

  const toggleRead = useCallback(
    async (id: string) => {
      const link = links.find((l) => l.id === id)
      if (!link) return
      await apiFetch(`/api/links/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_read: !link.is_read }),
      })
      await refresh()
    },
    [links, refresh]
  )

  const updateLinkTags = useCallback(
    async (id: string, tagIds: string[]) => {
      await apiFetch(`/api/links/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag_ids: tagIds }),
      })
      await refresh()
    },
    [refresh]
  )

  const filteredLinks = useMemo(() => {
    let result = links
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (l) =>
          l.title?.toLowerCase().includes(q) ||
          l.url.toLowerCase().includes(q) ||
          l.description?.toLowerCase().includes(q)
      )
    }
    if (filterTagId) {
      result = result.filter((l) => l.tags?.some((t) => t.id === filterTagId))
    }
    if (filterUnread) {
      result = result.filter((l) => !l.is_read)
    }
    return result
  }, [links, search, filterTagId, filterUnread])

  return {
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
    updateLinkTags,
    refresh,
  }
}
