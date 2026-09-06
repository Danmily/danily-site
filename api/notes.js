import { readList, writeList, newId, sendJson } from './_store.js'

const KEY = 'dangjq:notes'
const APPLIED_KEY = 'dangjq:notes:applied-extras'

const SEED = [
  { text: '每日打卡能不能自动从飞书新建文档里抓标题，省得手动记', color: 'yellow', tag: '产品' },
  { text: '花语集的召回链路要不要加个用户反馈闭环，当 badcase 素材', color: 'blue', tag: '花语集' },
  { text: '八字算算可以加一个"流年运势"的付费深度解读', color: 'pink', tag: '八字算算' },
  { text: 'OS 桌面这个框架其实可以做成通用模板，卖给别的 vibe coder', color: 'mint', tag: '灵感' },
]

// 想再给所有人补一条便签，往这里加，用 key 防止重复插入。
const EXTRA_NOTES = [
  {
    key: 'collecting-behavior-2026-08',
    note: { text: '有关于收藏这个行为的一些思考', color: 'blue', tag: '灵感' },
  },
]

async function ensureSeeded() {
  let notes = await readList(KEY)
  if (notes.length === 0) {
    notes = SEED.map((n) => ({ ...n, id: newId(), createdAt: Date.now() }))
    await writeList(KEY, notes)
  }

  const applied = await readList(APPLIED_KEY)
  const pending = EXTRA_NOTES.filter((e) => !applied.includes(e.key))
  if (pending.length > 0) {
    notes = [...notes, ...pending.map((e) => ({ ...e.note, id: newId(), createdAt: Date.now() }))]
    await writeList(KEY, notes)
    await writeList(APPLIED_KEY, [...applied, ...pending.map((e) => e.key)])
  }

  return notes
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const notes = await ensureSeeded()
    return sendJson(res, 200, notes)
  }

  if (req.method === 'POST') {
    const body = req.body ?? {}
    if (!body.text || !body.color) {
      return sendJson(res, 400, { error: 'text and color are required' })
    }
    const notes = await readList(KEY)
    const note = {
      id: newId(),
      text: body.text,
      color: body.color,
      tag: body.tag || undefined,
      createdAt: Date.now(),
    }
    notes.push(note)
    await writeList(KEY, notes)
    return sendJson(res, 200, note)
  }

  if (req.method === 'DELETE') {
    const id = req.query.id
    if (!id) return sendJson(res, 400, { error: 'id is required' })
    const notes = await readList(KEY)
    const next = notes.filter((n) => n.id !== id)
    await writeList(KEY, next)
    return sendJson(res, 200, { ok: true })
  }

  res.setHeader('allow', 'GET, POST, DELETE')
  return sendJson(res, 405, { error: 'method not allowed' })
}
