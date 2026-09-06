export interface DigestItem {
  title: string
  url: string
  points: number
  comments: number
  author: string
  createdAt: string
}

const CACHE_KEY = 'dangjq_ai_digest_v1'

function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

export async function getAIDigest(): Promise<{ date: string; items: DigestItem[] }> {
  const cached = localStorage.getItem(CACHE_KEY)
  if (cached) {
    const parsed = JSON.parse(cached) as { date: string; items: DigestItem[] }
    if (parsed.date === todayKey() && parsed.items.length > 0) return parsed
  }

  const res = await fetch(
    'https://hn.algolia.com/api/v1/search_by_date?query=AI&tags=story&hitsPerPage=8',
  )
  if (!res.ok) throw new Error(`HN API ${res.status}`)
  const data = await res.json()
  const items: DigestItem[] = (data.hits ?? [])
    .filter((h: any) => h.title)
    .slice(0, 6)
    .map((h: any) => ({
      title: h.title,
      url: h.url ?? `https://news.ycombinator.com/item?id=${h.objectID}`,
      points: h.points ?? 0,
      comments: h.num_comments ?? 0,
      author: h.author ?? '',
      createdAt: h.created_at ?? '',
    }))

  const payload = { date: todayKey(), items }
  localStorage.setItem(CACHE_KEY, JSON.stringify(payload))
  return payload
}
