import { useEffect, useMemo, useState } from 'react'
import {
  type Entry,
  TYPE_META,
  addEntry,
  buildWeeklyReport,
  deleteEntry,
  loadEntries,
  resetToBlank,
  resetToSeed,
} from '../lib/dailyLog'
import Heatmap from './Heatmap'
import EntryModal from './EntryModal'
import FeishuConnect from './FeishuConnect'

export default function DailyLog() {
  const [entries, setEntries] = useState<Entry[] | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [report, setReport] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    loadEntries()
      .then(setEntries)
      .catch(() => setLoadError(true))
  }, [])

  const dayEntries = useMemo(
    () => (selected ? (entries ?? []).filter((e) => e.date === selected) : []),
    [entries, selected],
  )

  const totalEntries = entries?.length ?? 0
  const activeDays = useMemo(
    () => new Set((entries ?? []).map((e) => e.date)).size,
    [entries],
  )

  return (
    <div className="mx-auto max-w-3xl px-6 pt-10 sm:pt-14">
      <div className="mb-8 text-center">
        <p className="font-mono text-xs text-blue-deep">$ git log --author=党佳琪</p>
        <h2 className="font-hand mt-1 text-5xl text-blue-deep">每日打卡 🔥</h2>
        <p className="mt-2 text-sm text-ink-soft">
          {totalEntries} 条记录 · {activeDays} 个活跃日
        </p>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-end gap-2">
        <button
          onClick={() => {
            if (confirm('清空所有记录并重置为示例数据？')) resetToSeed().then(setEntries)
          }}
          className="rounded-full border border-line bg-white px-3 py-1.5 text-xs text-ink-soft hover:border-blue/40 hover:text-blue-deep"
        >
          重置示例
        </button>
        <button
          onClick={() => {
            if (confirm('清空所有记录，从空白开始？')) resetToBlank().then(setEntries)
          }}
          className="rounded-full border border-line bg-white px-3 py-1.5 text-xs text-ink-soft hover:border-blue/40 hover:text-blue-deep"
        >
          清空
        </button>
        <button
          onClick={() => setModalOpen(true)}
          className="rounded-full bg-blue px-4 py-1.5 text-xs font-medium text-white shadow-[0_4px_14px_rgba(43,127,216,0.35)] hover:bg-blue-deep"
        >
          + 记录
        </button>
      </div>

      {loadError && (
        <p className="mb-4 text-center text-sm text-coral">
          打卡数据加载失败，网络有点问题，刷新试试。
        </p>
      )}

      <div className="rounded-2xl border border-line bg-white p-6 shadow-[0_2px_10px_rgba(26,26,46,0.05)]">
        {entries ? (
          <Heatmap entries={entries} selected={selected} onSelect={setSelected} />
        ) : (
          <p className="py-8 text-center text-sm text-ink-soft">加载中…</p>
        )}
      </div>

      {selected && (
        <div className="fade-up mt-4 rounded-2xl border border-line bg-paper-2 p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-mono text-sm text-ink">{selected}</p>
            <button
              onClick={() => setSelected(null)}
              className="text-xs text-ink-soft hover:text-ink"
            >
              收起
            </button>
          </div>
          {dayEntries.length === 0 ? (
            <p className="text-sm text-ink-soft">这天还没有记录。</p>
          ) : (
            <ul className="space-y-2">
              {dayEntries.map((e) => (
                <li
                  key={e.id}
                  className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2 shadow-[0_1px_4px_rgba(26,26,46,0.05)]"
                >
                  <div className="flex items-center gap-2 text-sm">
                    <span className={`h-2 w-2 rounded-full ${TYPE_META[e.type].dot}`} />
                    <span className="text-ink">{e.title}</span>
                    <span className="font-mono text-xs text-ink-soft">
                      {TYPE_META[e.type].label}
                      {e.words ? ` · ${e.words}字` : ''}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setEntries((prev) => (prev ?? []).filter((x) => x.id !== e.id))
                      deleteEntry(e.id).catch(() => loadEntries().then(setEntries))
                    }}
                    className="text-xs text-ink-soft hover:text-coral"
                  >
                    删除
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="mt-10 grid gap-5 sm:grid-cols-[1.2fr_1fr]">
        <div className="rounded-2xl border border-line bg-white p-6 shadow-[0_2px_10px_rgba(26,26,46,0.05)]">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium text-ink">周报生成</p>
            <button
              onClick={() => setReport(buildWeeklyReport(entries ?? []))}
              className="rounded-full border border-blue/30 bg-blue-bg px-3 py-1.5 text-xs text-blue-deep hover:bg-blue/15"
            >
              生成本周简报
            </button>
          </div>
          {report ? (
            <div className="fade-up">
              <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-xl bg-paper-2 p-4 font-mono text-xs leading-relaxed text-ink-soft">
                {report}
              </pre>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(report)
                  setCopied(true)
                  setTimeout(() => setCopied(false), 1500)
                }}
                className="mt-3 text-xs text-blue-deep hover:underline"
              >
                {copied ? '已复制 ✓' : '复制 Markdown'}
              </button>
            </div>
          ) : (
            <p className="text-sm text-ink-soft">
              汇总最近 7 天的记录，自动生成结构化周报。真正接入飞书后，这一步会由技能在你新建文档时自动触发。
            </p>
          )}
        </div>

        <FeishuConnect />
      </div>

      {modalOpen && (
        <EntryModal
          defaultDate={selected ?? undefined}
          onClose={() => setModalOpen(false)}
          onSave={async (entry) => {
            const created = await addEntry(entry)
            setEntries((prev) => [...(prev ?? []), created])
            setModalOpen(false)
          }}
        />
      )}
    </div>
  )
}
