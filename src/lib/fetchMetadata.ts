import type { LinkMetadata } from '@/types'

function extractMeta(html: string, property: string): string | null {
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`, 'i'),
  ]
  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match) return match[1].trim()
  }
  return null
}

function extractTitle(html: string): string | null {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  return match ? match[1].trim() : null
}

export async function fetchMetadata(url: string): Promise<LinkMetadata> {
  const empty: LinkMetadata = { title: null, description: null, thumbnail_url: null, site_name: null }
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000)

    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Memora/1.0)' },
    })
    clearTimeout(timeoutId)

    if (!response.ok) return empty

    const html = await response.text()

    const ogTitle = extractMeta(html, 'og:title')
    const ogDescription = extractMeta(html, 'og:description')
    const ogImage = extractMeta(html, 'og:image')
    const ogSiteName = extractMeta(html, 'og:site_name')

    return {
      title: ogTitle ?? extractTitle(html),
      description: ogDescription,
      thumbnail_url: ogImage,
      site_name: ogSiteName,
    }
  } catch {
    return empty
  }
}
