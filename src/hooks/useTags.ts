'use client'

import { useState, useCallback, useEffect } from 'react'
import type { Tag } from '@/types'

export interface UseTagsReturn {
  tags: Tag[]
  isLoading: boolean
  addTag: (name: string, color: string) => Promise<Tag>
  editTag: (id: string, patch: { name?: string; color?: string }) => Promise<void>
  removeTag: (id: string) => Promise<void>
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

export function useTags(): UseTagsReturn {
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const refresh = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await apiFetch('/api/tags')
      const { data } = await res.json()
      setTags(data ?? [])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addTag = useCallback(
    async (name: string, color: string): Promise<Tag> => {
      const res = await apiFetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, color }),
      })
      const newTag: Tag = await res.json()
      await refresh()
      return newTag
    },
    [refresh]
  )

  const editTag = useCallback(
    async (id: string, patch: { name?: string; color?: string }) => {
      await apiFetch(`/api/tags/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      })
      await refresh()
    },
    [refresh]
  )

  const removeTag = useCallback(
    async (id: string) => {
      await apiFetch(`/api/tags/${id}`, { method: 'DELETE' })
      await refresh()
    },
    [refresh]
  )

  return { tags, isLoading, addTag, editTag, removeTag, refresh }
}
