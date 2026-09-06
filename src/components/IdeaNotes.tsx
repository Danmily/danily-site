import { useEffect, useState } from 'react'
import {
  type IdeaNote,
  type NoteColor,
  COLOR_STYLE,
  addNote,
  deleteNote,
  loadNotes,
} from '../lib/ideaNotes'

const ROTATIONS = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2', 'rotate-0']
const COLORS: NoteColor[] = ['yellow', 'blue', 'pink', 'mint']

export default function IdeaNotes() {
  const [notes, setNotes] = useState<IdeaNote[] | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [composing, setComposing] = useState(false)
  const [text, setText] = useState('')
  const [tag, setTag] = useState('')
  const [color, setColor] = useState<NoteColor>('yellow')
  const [justSaved, setJustSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadNotes()
      .then(setNotes)
      .catch(() => setLoadError(true))
  }, [])

  async function submit() {
    if (!text.trim() || saving) return
    setSaving(true)
    try {
      const note = await addNote({ text: text.trim(), tag: tag.trim() || undefined, color })
      setNotes((prev) => [...(prev ?? []), note])
      setText('')
      setTag('')
      setComposing(false)
      setJustSaved(true)
      setTimeout(() => setJustSaved(false), 1800)
    } catch {
      alert('没贴上，网络好像有点问题，再试一次？')
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: string) {
    setNotes((prev) => (prev ?? []).filter((n) => n.id !== id))
    try {
      await deleteNote(id)
    } catch {
      loadNotes().then(setNotes)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 pb-28 pt-10 sm:pt-14">
      <div className="mb-8 text-center">
        <p className="font-mono text-xs text-blue-deep">$ cat ideas/*.md</p>
        <h2 className="font-hand mt-1 text-5xl text-blue-deep">灵感便签 💡</h2>
        <p className="mt-2 text-sm text-ink-soft">随手记的产品想法、灵光一闪，不追求完整</p>
        {justSaved && (
          <p className="fade-up mt-2 inline-block rounded-full bg-mint/15 px-3 py-1 font-mono text-xs text-mint">
            贴上啦 ✓
          </p>
        )}
      </div>

      {loadError && (
        <p className="mb-6 text-center text-sm text-coral">
          便签加载失败，网络有点问题，刷新试试。
        </p>
      )}
      {!loadError && !notes && (
        <p className="mb-6 text-center text-sm text-ink-soft">加载中…</p>
      )}

      <div className="flex flex-wrap gap-5">
        {notes?.map((n, i) => (
          <div
            key={n.id}
            className={`group relative w-56 rounded-2xl border p-4 shadow-[0_6px_16px_rgba(26,26,46,0.12)] transition-transform hover:scale-105 hover:rotate-0 ${COLOR_STYLE[n.color]} ${ROTATIONS[i % ROTATIONS.length]}`}
          >
            <button
              onClick={() => remove(n.id)}
              className="absolute right-2 top-2 text-xs text-ink-soft/50 opacity-0 transition-opacity hover:text-coral group-hover:opacity-100"
            >
              ✕
            </button>
            {n.tag && (
              <p className="mb-2 font-mono text-[10px] font-medium text-ink-soft/70">
                #{n.tag}
              </p>
            )}
            <p className="text-sm leading-relaxed text-ink">{n.text}</p>
          </div>
        ))}

        {composing ? (
          <div className="w-56 rounded-2xl border border-line bg-white p-4 shadow-[0_6px_16px_rgba(26,26,46,0.12)]">
            <input
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="标签（选填）"
              className="mb-2 w-full rounded border border-line bg-paper-2 px-2 py-1 text-xs outline-none focus:border-blue/50"
            />
            <textarea
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault()
                  submit()
                }
              }}
              placeholder="想法……（⌘/Ctrl + Enter 快速贴上）"
              rows={3}
              className="mb-2 w-full resize-none rounded border border-line bg-paper-2 px-2 py-1.5 text-sm outline-none focus:border-blue/50"
            />
            <div className="mb-3 flex gap-1.5">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`h-5 w-5 rounded-full border-2 ${COLOR_STYLE[c]} ${color === c ? 'border-ink' : 'border-transparent'}`}
                />
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setComposing(false)}
                className="px-2 py-1.5 text-xs text-ink-soft hover:text-ink"
              >
                取消
              </button>
              <button
                onClick={submit}
                disabled={!text.trim() || saving}
                className="rounded-full bg-blue px-4 py-1.5 text-xs font-medium text-white shadow-[0_4px_14px_rgba(43,127,216,0.35)] disabled:opacity-40 disabled:shadow-none"
              >
                {saving ? '贴上中…' : '贴上'}
              </button>
            </div>
          </div>
        ) : (
          notes && (
            <button
              onClick={() => setComposing(true)}
              className="flex w-56 items-center justify-center rounded-2xl border-2 border-dashed border-line py-10 text-sm text-ink-soft transition-transform hover:scale-105 hover:border-blue/40 hover:text-blue-deep"
            >
              + 新想法
            </button>
          )
        )}
      </div>
    </div>
  )
}
