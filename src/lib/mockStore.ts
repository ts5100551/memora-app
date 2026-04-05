import type { Link, Tag } from '@/types'

const LINKS_KEY = 'memora-links'
const TAGS_KEY = 'memora-tags'
const LINK_TAGS_KEY = 'memora-link-tags'

/** Generates a simple UUID v4-like string. */
function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

function now(): string {
  return new Date().toISOString()
}

// ============================================================
// Links
// ============================================================

export function getLinks(): Link[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(LINKS_KEY)
    return raw ? (JSON.parse(raw) as Link[]) : []
  } catch {
    return []
  }
}

function saveLinks(links: Link[]): void {
  localStorage.setItem(LINKS_KEY, JSON.stringify(links))
}

export interface CreateLinkInput {
  url: string
  title?: string | null
  description?: string | null
  thumbnail_url?: string | null
  source?: string
  tag_ids?: string[]
  user_id?: string
}

export function createLink(input: CreateLinkInput): Link {
  const links = getLinks()
  const duplicate = links.find((l) => l.url === input.url)
  if (duplicate) {
    throw new Error('CONFLICT: URL already saved')
  }
  const linkId = generateId()
  const timestamp = now()
  const newLink: Link = {
    id: linkId,
    user_id: input.user_id ?? 'mock-user',
    url: input.url,
    title: input.title ?? null,
    description: input.description ?? null,
    thumbnail_url: input.thumbnail_url ?? null,
    source: input.source ?? 'web',
    is_read: false,
    created_at: timestamp,
    updated_at: timestamp,
    tags: [],
  }
  saveLinks([newLink, ...links])
  if (input.tag_ids && input.tag_ids.length > 0) {
    setLinkTags(linkId, input.tag_ids)
  }
  return getLinkById(linkId)!
}

export function getLinkById(id: string): Link | null {
  const links = getLinks()
  const link = links.find((l) => l.id === id) ?? null
  if (!link) return null
  return { ...link, tags: getTagsForLink(id) }
}

export interface UpdateLinkInput {
  title?: string | null
  description?: string | null
  thumbnail_url?: string | null
  is_read?: boolean
}

export function updateLink(id: string, patch: UpdateLinkInput): Link | null {
  const links = getLinks()
  const idx = links.findIndex((l) => l.id === id)
  if (idx === -1) return null
  links[idx] = { ...links[idx], ...patch, updated_at: now() }
  saveLinks(links)
  return getLinkById(id)
}

export function deleteLink(id: string): void {
  const links = getLinks().filter((l) => l.id !== id)
  saveLinks(links)
  // Clean up link_tags
  const lt = getLinkTagsMap()
  delete lt[id]
  saveLinkTagsMap(lt)
}

// ============================================================
// Tags
// ============================================================

export function getTags(): Tag[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(TAGS_KEY)
    return raw ? (JSON.parse(raw) as Tag[]) : []
  } catch {
    return []
  }
}

function saveTags(tags: Tag[]): void {
  localStorage.setItem(TAGS_KEY, JSON.stringify(tags))
}

export interface CreateTagInput {
  name: string
  color: string
  user_id?: string
}

export function createTag(input: CreateTagInput): Tag {
  const tags = getTags()
  const duplicate = tags.find(
    (t) => t.name.toLowerCase() === input.name.toLowerCase()
  )
  if (duplicate) {
    throw new Error('CONFLICT: Tag name already exists')
  }
  const newTag: Tag = {
    id: generateId(),
    user_id: input.user_id ?? 'mock-user',
    name: input.name,
    color: input.color,
    created_at: now(),
  }
  saveTags([...tags, newTag])
  return newTag
}

export interface UpdateTagInput {
  name?: string
  color?: string
}

export function updateTag(id: string, patch: UpdateTagInput): Tag | null {
  const tags = getTags()
  const idx = tags.findIndex((t) => t.id === id)
  if (idx === -1) return null
  tags[idx] = { ...tags[idx], ...patch }
  saveTags(tags)
  return tags[idx]
}

export function deleteTag(id: string): void {
  const tags = getTags().filter((t) => t.id !== id)
  saveTags(tags)
  // Remove this tag from all links
  const lt = getLinkTagsMap()
  for (const linkId of Object.keys(lt)) {
    lt[linkId] = lt[linkId].filter((tid) => tid !== id)
  }
  saveLinkTagsMap(lt)
}

// ============================================================
// Link-Tags (many-to-many)
// ============================================================

type LinkTagsMap = Record<string, string[]>

function getLinkTagsMap(): LinkTagsMap {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(LINK_TAGS_KEY)
    return raw ? (JSON.parse(raw) as LinkTagsMap) : {}
  } catch {
    return {}
  }
}

function saveLinkTagsMap(lt: LinkTagsMap): void {
  localStorage.setItem(LINK_TAGS_KEY, JSON.stringify(lt))
}

export function getTagsForLink(linkId: string): Tag[] {
  const lt = getLinkTagsMap()
  const tagIds = lt[linkId] ?? []
  const allTags = getTags()
  return tagIds
    .map((tid) => allTags.find((t) => t.id === tid))
    .filter((t): t is Tag => t !== undefined)
}

export function setLinkTags(linkId: string, tagIds: string[]): void {
  const lt = getLinkTagsMap()
  lt[linkId] = tagIds
  saveLinkTagsMap(lt)
  // Update the links array to reflect new tags (for consistency)
  const links = getLinks()
  const idx = links.findIndex((l) => l.id === linkId)
  if (idx !== -1) {
    links[idx].updated_at = now()
    saveLinks(links)
  }
}

// ============================================================
// Helpers
// ============================================================

/** Returns all links with their tags populated. */
export function getLinksWithTags(): Link[] {
  const links = getLinks()
  return links.map((l) => ({ ...l, tags: getTagsForLink(l.id) }))
}

/** Returns all tags with their link counts. */
export function getTagsWithCounts(): Tag[] {
  const tags = getTags()
  const lt = getLinkTagsMap()
  const counts: Record<string, number> = {}
  for (const tagIds of Object.values(lt)) {
    for (const tid of tagIds) {
      counts[tid] = (counts[tid] ?? 0) + 1
    }
  }
  return tags.map((t) => ({ ...t, link_count: counts[t.id] ?? 0 }))
}
