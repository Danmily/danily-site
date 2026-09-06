import { useEffect, useState } from 'react'
import { getAIDigest, type DigestItem } from '../lib/aiDigest'

export default function AIDigest() {
  const [items, setItems] = useState<DigestItem[] | null>(null)
  const [error, setError] = useState(false)
  const [date, setDate] = useState('')

  useEffect(() => {
    getAIDigest()
      .then((d) => {
        setItems(d.items)
        setDate(d.date)
      })
      .catch(() => setError(true))
  }, [])

  return (
    <div className="mx-auto max-w-3xl px-6 pb-10 pt-16">
      <div className="mb-8 text-center">
        <p className="font-mono text-xs text-blue-deep">$ curl ai-news --today</p>
        <h2 className="font-hand mt-1 text-5xl text-blue-deep">AI 快讯 📡</h2>
        <p className="mt-2 text-sm text-ink-soft">
          {date ? `${date} 更新，每天首次打开页面自动拉取一次` : '正在拉取今天的 AI 热帖…'}
        </p>
      </div>

      <div className="rounded-2xl border border-line bg-white p-2 shadow-[0_2px_10px_rgba(26,26,46,0.05)] sm:p-3">
        {error && (
          <p className="p-6 text-center text-sm text-ink-soft">
            没拉到数据（可能是网络问题），刷新页面再试试。
          </p>
        )}
        {!error && !items && (
          <p className="p-6 text-center text-sm text-ink-soft">加载中…</p>
        )}
        {items?.length === 0 && (
          <p className="p-6 text-center text-sm text-ink-soft">今天还没有新的相关热帖。</p>
        )}
        {items?.map((it, i) => (
          <a
            key={i}
            href={it.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-start justify-between gap-4 rounded-xl px-4 py-3 transition-colors hover:bg-paper-2"
          >
            <div className="min-w-0">
              <p className="truncate text-sm text-ink">{it.title}</p>
              <p className="mt-0.5 font-mono text-[11px] text-ink-soft">
                {it.author} · {it.createdAt.slice(0, 10)}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-blue-bg px-2 py-1 font-mono text-[11px] text-blue-deep">
              ▲ {it.points}
            </span>
          </a>
        ))}
      </div>
      <p className="mt-3 text-center text-xs text-ink-soft">
        数据源：Hacker News（AI 相关话题），免密钥公开 API。真要做行业报告级别的日报，需要接更专业的信源。
      </p>
    </div>
  )
}
