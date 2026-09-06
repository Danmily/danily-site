import { useState } from 'react'
import { type Entry, type EntryType, TYPE_META, todayStr } from '../lib/dailyLog'

export default function EntryModal({
  defaultDate,
  onSave,
  onClose,
}: {
  defaultDate?: string
  onSave: (entry: Omit<Entry, 'id' | 'createdAt'>) => Promise<void>
  onClose: () => void
}) {
  const [date, setDate] = useState(defaultDate ?? todayStr())
  const [title, setTitle] = useState('')
  const [type, setType] = useState<EntryType>('doc')
  const [link, setLink] = useState('')
  const [words, setWords] = useState('')
  const [saving, setSaving] = useState(false)

  const canSave = title.trim().length > 0

  async function submit() {
    if (!canSave || saving) return
    setSaving(true)
    try {
      await onSave({
        date,
        title: title.trim(),
        type,
        link: link.trim() || undefined,
        words: words ? Number(words) : undefined,
      })
    } catch {
      alert('没存上，网络好像有点问题，再试一次？')
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-line bg-white p-6 shadow-[0_24px_60px_rgba(26,26,46,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-hand mb-4 text-3xl text-blue-deep">记录一条产出</h3>

        <label className="mb-3 block text-xs text-ink-soft">
          标题
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="今天做了什么"
            className="mt-1 w-full rounded-lg border border-line bg-paper-2 px-3 py-2 text-sm text-ink outline-none focus:border-blue/50"
          />
        </label>

        <div className="mb-3 grid grid-cols-2 gap-3">
          <label className="block text-xs text-ink-soft">
            日期
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full rounded-lg border border-line bg-paper-2 px-3 py-2 text-sm text-ink outline-none focus:border-blue/50"
            />
          </label>
          <label className="block text-xs text-ink-soft">
            类型
            <select
              value={type}
              onChange={(e) => setType(e.target.value as EntryType)}
              className="mt-1 w-full rounded-lg border border-line bg-paper-2 px-3 py-2 text-sm text-ink outline-none focus:border-blue/50"
            >
              {Object.entries(TYPE_META).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="mb-3 block text-xs text-ink-soft">
          飞书文档链接（选填）
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://xxx.feishu.cn/docx/..."
            className="mt-1 w-full rounded-lg border border-line bg-paper-2 px-3 py-2 text-sm text-ink outline-none focus:border-blue/50"
          />
        </label>

        <label className="mb-5 block text-xs text-ink-soft">
          字数（选填）
          <input
            type="number"
            value={words}
            onChange={(e) => setWords(e.target.value)}
            placeholder="1200"
            className="mt-1 w-full rounded-lg border border-line bg-paper-2 px-3 py-2 text-sm text-ink outline-none focus:border-blue/50"
          />
        </label>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-full px-4 py-2 text-sm text-ink-soft hover:text-ink"
          >
            取消
          </button>
          <button
            disabled={!canSave || saving}
            onClick={submit}
            className="rounded-full bg-blue px-4 py-2 text-sm font-medium text-white shadow-[0_4px_14px_rgba(43,127,216,0.35)] disabled:opacity-40 disabled:shadow-none"
          >
            {saving ? '保存中…' : '保存'}
          </button>
        </div>
      </div>
    </div>
  )
}
