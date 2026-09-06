export type NoteColor = 'yellow' | 'blue' | 'pink' | 'mint'

export interface IdeaNote {
  id: string
  text: string
  color: NoteColor
  tag?: string
  createdAt: number
}

export const COLOR_STYLE: Record<NoteColor, string> = {
  yellow: 'bg-[#fff3c4] border-[#f0d878]',
  blue: 'bg-[#dbe9ff] border-[#a9c6f5]',
  pink: 'bg-[#ffe1ec] border-[#f5b8cf]',
  mint: 'bg-[#d9f5e6] border-[#a7e0c1]',
}

export async function loadNotes(): Promise<IdeaNote[]> {
  const res = await fetch('/api/notes')
  if (!res.ok) throw new Error(`GET /api/notes ${res.status}`)
  return res.json()
}

export async function addNote(note: Omit<IdeaNote, 'id' | 'createdAt'>): Promise<IdeaNote> {
  const res = await fetch('/api/notes', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(note),
  })
  if (!res.ok) throw new Error(`POST /api/notes ${res.status}`)
  return res.json()
}

export async function deleteNote(id: string): Promise<void> {
  const res = await fetch(`/api/notes?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`DELETE /api/notes ${res.status}`)
}
