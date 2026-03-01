export interface User {
  id: string
  email: string | null
  display_name: string | null
  avatar_url: string | null
  theme_preference: 'light' | 'dark' | 'system'
  created_at: string
}

export interface Tag {
  id: string
  user_id: string
  name: string
  color: string
  created_at: string
  link_count?: number
}

export interface Link {
  id: string
  user_id: string
  url: string
  title: string | null
  description: string | null
  thumbnail_url: string | null
  source: string
  is_read: boolean
  created_at: string
  updated_at: string
  tags?: Tag[]
}

export interface LinkMetadata {
  title: string | null
  description: string | null
  thumbnail_url: string | null
  site_name: string | null
}

export type Theme = 'light' | 'dark' | 'system'
