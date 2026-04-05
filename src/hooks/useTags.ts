'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Tag } from '@/types'
import {
  getTagsWithCounts,
  createTag,
  updateTag,
  deleteTag,
  type CreateTagInput,
  type UpdateTagInput,
} from '@/lib/mockStore'

export interface UseTagsReturn {
  tags: Tag[]
  addTag: (name: string, color: string) => Tag
  editTag: (id: string, patch: UpdateTagInput) => void
  removeTag: (id: string) => void
  refresh: () => void
}

export function useTags(): UseTagsReturn {
  const [tags, setTags] = useState<Tag[]>([])

  const refresh = useCallback(() => {
    setTags(getTagsWithCounts())
  }, [])

  useEffect(() => {
    setTags(getTagsWithCounts())
  }, [])

  const addTag = useCallback(
    (name: string, color: string): Tag => {
      const input: CreateTagInput = { name, color }
      const newTag = createTag(input)
      refresh()
      return newTag
    },
    [refresh]
  )

  const editTag = useCallback(
    (id: string, patch: UpdateTagInput) => {
      updateTag(id, patch)
      refresh()
    },
    [refresh]
  )

  const removeTag = useCallback(
    (id: string) => {
      deleteTag(id)
      refresh()
    },
    [refresh]
  )

  return { tags, addTag, editTag, removeTag, refresh }
}
