import { readList, writeList, newId, sendJson } from './_store.js'

const KEY = 'dangjq:entries'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const entries = await readList(KEY)
    return sendJson(res, 200, entries)
  }

  if (req.method === 'POST') {
    const body = req.body ?? {}
    if (!body.title || !body.date || !body.type) {
      return sendJson(res, 400, { error: 'title, date, type are required' })
    }
    const entries = await readList(KEY)
    const entry = {
      id: newId(),
      date: body.date,
      title: body.title,
      type: body.type,
      link: body.link || undefined,
      words: body.words ? Number(body.words) : undefined,
      createdAt: Date.now(),
    }
    entries.push(entry)
    await writeList(KEY, entries)
    return sendJson(res, 200, entry)
  }

  if (req.method === 'DELETE') {
    const id = req.query.id
    if (!id) return sendJson(res, 400, { error: 'id is required' })
    const entries = await readList(KEY)
    const next = entries.filter((e) => e.id !== id)
    await writeList(KEY, next)
    return sendJson(res, 200, { ok: true })
  }

  if (req.method === 'PUT') {
    const list = Array.isArray(req.body) ? req.body : []
    await writeList(KEY, list)
    return sendJson(res, 200, list)
  }

  res.setHeader('allow', 'GET, POST, DELETE, PUT')
  return sendJson(res, 405, { error: 'method not allowed' })
}
