import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { Tag } from '@/types'

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

function transformLink(row: LinkRow) {
  return {
    ...row,
    tags: (row.link_tags ?? []).map((lt) => lt.tags).filter((t): t is Tag => t !== null),
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
      { status: 401 }
    )
  }

  const { data, error } = await supabase
    .from('links')
    .select('*, link_tags(tags(*))')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !data) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'Link not found' } },
      { status: 404 }
    )
  }

  return NextResponse.json(transformLink(data as LinkRow))
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
      { status: 401 }
    )
  }

  let body: { is_read?: boolean; tag_ids?: string[] }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: { code: 'BAD_REQUEST', message: 'Invalid JSON body' } },
      { status: 400 }
    )
  }

  const { is_read, tag_ids } = body

  if (is_read !== undefined) {
    const { error } = await supabase
      .from('links')
      .update({ is_read })
      .eq('id', id)
      .eq('user_id', user.id)
    if (error) {
      return NextResponse.json(
        { error: { code: 'INTERNAL_ERROR', message: error.message } },
        { status: 500 }
      )
    }
  }

  if (tag_ids !== undefined) {
    await supabase.from('link_tags').delete().eq('link_id', id)
    if (tag_ids.length > 0) {
      await supabase
        .from('link_tags')
        .insert(tag_ids.map((tag_id) => ({ link_id: id, tag_id })))
    }
  }

  const { data, error: fetchError } = await supabase
    .from('links')
    .select('*, link_tags(tags(*))')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !data) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'Link not found' } },
      { status: 404 }
    )
  }

  return NextResponse.json(transformLink(data as LinkRow))
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
      { status: 401 }
    )
  }

  const { error } = await supabase
    .from('links')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    )
  }

  return new Response(null, { status: 204 })
}
