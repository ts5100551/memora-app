import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
      { status: 401 }
    )
  }

  const { data, error } = await supabase
    .from('tags')
    .select('*, link_tags(link_id)')
    .eq('user_id', user.id)
    .order('name', { ascending: true })

  if (error) {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    )
  }

  const tags = (data ?? []).map((t) => ({
    ...t,
    link_count: (t.link_tags as unknown[])?.length ?? 0,
    link_tags: undefined,
  }))

  return NextResponse.json({ data: tags })
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

  let body: { name?: string; color?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: { code: 'BAD_REQUEST', message: 'Invalid JSON body' } },
      { status: 400 }
    )
  }

  const { name, color = '#6366F1' } = body
  if (!name || typeof name !== 'string') {
    return NextResponse.json(
      { error: { code: 'BAD_REQUEST', message: 'name is required' } },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('tags')
    .insert({ user_id: user.id, name, color })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json(
        { error: { code: 'CONFLICT', message: 'Tag name already exists' } },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    )
  }

  return NextResponse.json({ ...data, link_count: 0 }, { status: 201 })
}
