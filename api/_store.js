import { kv } from '@vercel/kv'

export async function readList(key) {
  const value = await kv.get(key)
  return Array.isArray(value) ? value : []
}
export async function writeList(key, list) {
  await kv.set(key, list)
}
export function newId() {
  return crypto.randomUUID()
}
export function sendJson(res, status, body) {
  res.status(status).setHeader('content-type', 'application/json')
  res.send(JSON.stringify(body))
}
