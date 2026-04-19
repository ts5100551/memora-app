import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { fetchMetadata } from '@/lib/fetchMetadata'
import type { Link, Tag } from '@/types'

type LinkRow = {
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
  link_tags: { tags: Tag | null }[]
}

function transformLink(row: LinkRow): Link {
  return {
    ...row,
    tags: (row.link_tags ?? []).map((lt) => lt.tags).filter((t): t is Tag => t !== null),
  }
}

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
      { status: 401 }
    )
  }

  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') ?? ''
  const tagId = searchParams.get('tag') ?? ''
  const unread = searchParams.get('unread') === 'true'
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '100'), 200)
  const offset = parseInt(searchParams.get('offset') ?? '0')

  let query = supabase
    .from('links')
    .select('*, link_tags(tags(*))')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (search) {
    query = query.or(`title.ilike.%${search}%,url.ilike.%${search}%,description.ilike.%${search}%`)
  }
  if (unread) {
    query = query.eq('is_read', false)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    )
  }

  let links = (data as LinkRow[]).map(transformLink)

  if (tagId) {
    links = links.filter((l) => l.tags?.some((t) => t.id === tagId))
  }

  return NextResponse.json({ data: links, count: links.length })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
      { status: 401 }
    )
  }

  let body: {
    url?: string
    source?: string
    title?: string | null
    description?: string | null
    thumbnail_url?: string | null
    tag_ids?: string[]
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: { code: 'BAD_REQUEST', message: 'Invalid JSON body' } },
      { status: 400 }
    )
  }

  const { url, source = 'web', tag_ids = [] } = body
  if (!url || typeof url !== 'string') {
    return NextResponse.json(
      { error: { code: 'BAD_REQUEST', message: 'url is required' } },
      { status: 400 }
    )
  }

  // Use caller-provided metadata if present; fall back to server-fetched
  const hasCallerMeta = body.title !== undefined || body.description !== undefined || body.thumbnail_url !== undefined
  const metadata = hasCallerMeta
    ? { title: body.title ?? null, description: body.description ?? null, thumbnail_url: body.thumbnail_url ?? null }
    : await fetchMetadata(url)

  const { data: link, error: insertError } = await supabase
    .from('links')
    .insert({
      user_id: user.id,
      url,
      source,
      title: metadata.title,
      description: metadata.description,
      thumbnail_url: metadata.thumbnail_url,
    })
    .select()
    .single()

  if (insertError) {
    if (insertError.code === '23505') {
      return NextResponse.json(
        { error: { code: 'CONFLICT', message: 'This URL is already saved' } },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: insertError.message } },
      { status: 500 }
    )
  }

  if (tag_ids.length > 0) {
    await supabase
      .from('link_tags')
      .insert(tag_ids.map((tag_id) => ({ link_id: link.id, tag_id })))
  }

  const { data: full } = await supabase
    .from('links')
    .select('*, link_tags(tags(*))')
    .eq('id', link.id)
    .single()

  return NextResponse.json(transformLink(full as LinkRow), { status: 201 })
}
