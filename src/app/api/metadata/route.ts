import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { fetchMetadata } from '@/lib/fetchMetadata'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
      { status: 401 }
    )
  }

  let body: { url?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: { code: 'BAD_REQUEST', message: 'Invalid JSON body' } },
      { status: 400 }
    )
  }

  const { url } = body
  if (!url || typeof url !== 'string') {
    return NextResponse.json(
      { error: { code: 'BAD_REQUEST', message: 'url is required' } },
      { status: 400 }
    )
  }

  const metadata = await fetchMetadata(url)
  return NextResponse.json(metadata)
}
