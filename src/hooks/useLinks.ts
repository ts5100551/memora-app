'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import type { Link } from '@/types'
import {
  getLinksWithTags,
  createLink,
  updateLink,
  deleteLink,
  setLinkTags,
  type CreateLinkInput,
} from '@/lib/mockStore'

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
  addLink: (input: CreateLinkInput) => Link
  removeLink: (id: string) => void
  toggleRead: (id: string) => void
  updateLinkTags: (id: string, tagIds: string[]) => void
  refresh: () => void
}

export function useLinks(): UseLinksReturn {
  const [links, setLinks] = useState<Link[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterTagId, setFilterTagId] = useState<string | null>(null)
  const [filterUnread, setFilterUnread] = useState(false)

  const refresh = useCallback(() => {
    setLinks(getLinksWithTags())
  }, [])

  useEffect(() => {
    setLinks(getLinksWithTags())
    setIsLoading(false)
  }, [])

  const addLink = useCallback(
    (input: CreateLinkInput): Link => {
      const newLink = createLink(input)
      refresh()
      return newLink
    },
    [refresh]
  )

  const removeLink = useCallback(
    (id: string) => {
      deleteLink(id)
      refresh()
    },
    [refresh]
  )

  const toggleRead = useCallback(
    (id: string) => {
      const link = links.find((l) => l.id === id)
      if (!link) return
      updateLink(id, { is_read: !link.is_read })
      refresh()
    },
    [links, refresh]
  )

  const updateLinkTags = useCallback(
    (id: string, tagIds: string[]) => {
      setLinkTags(id, tagIds)
      refresh()
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
      result = result.filter((l) =>
        l.tags?.some((t) => t.id === filterTagId)
      )
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
