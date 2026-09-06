export type EntryType = 'doc' | 'code' | 'design' | 'meeting' | 'review'

export interface Entry {
  id: string
  date: string // YYYY-MM-DD
  title: string
  type: EntryType
  link?: string
  words?: number
  note?: string
  createdAt: number
}

export const TYPE_META: Record<EntryType, { label: string; dot: string }> = {
  doc: { label: '文档', dot: 'bg-blue' },
  code: { label: '代码', dot: 'bg-amber' },
  design: { label: '设计', dot: 'bg-coral' },
  meeting: { label: '会议', dot: 'bg-mint' },
  review: { label: '复盘', dot: 'bg-ink-soft' },
}

export function fmtDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export function todayStr(): string {
  return fmtDate(new Date())
}

export async function loadEntries(): Promise<Entry[]> {
  const res = await fetch('/api/entries')
  if (!res.ok) throw new Error(`GET /api/entries ${res.status}`)
  const entries = (await res.json()) as Entry[]
  if (entries.length === 0) return putEntries(buildSeed())
  return entries
}

async function putEntries(entries: Entry[]): Promise<Entry[]> {
  const res = await fetch('/api/entries', {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(entries),
  })
  if (!res.ok) throw new Error(`PUT /api/entries ${res.status}`)
  return res.json()
}

export async function addEntry(entry: Omit<Entry, 'id' | 'createdAt'>): Promise<Entry> {
  const res = await fetch('/api/entries', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(entry),
  })
  if (!res.ok) throw new Error(`POST /api/entries ${res.status}`)
  return res.json()
}

export async function deleteEntry(id: string): Promise<void> {
  const res = await fetch(`/api/entries?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`DELETE /api/entries ${res.status}`)
}

export async function resetToBlank(): Promise<Entry[]> {
  return putEntries([])
}

export async function resetToSeed(): Promise<Entry[]> {
  return putEntries(buildSeed())
}

const SEED_TITLES: { offset: number; title: string; type: EntryType; words?: number }[] = [
  { offset: 0, title: '本周产出打卡功能 - 交互稿', type: 'design', words: 800 },
  { offset: 1, title: '花语集：多路召回排序方案评审', type: 'meeting' },
  { offset: 1, title: '花语集 Planner→Composer→Verifier 设计文档', type: 'doc', words: 2400 },
  { offset: 3, title: '八字算算 prompt 结构优化', type: 'code' },
  { offset: 4, title: '本周复盘：评测集覆盖率不足', type: 'review', words: 600 },
  { offset: 6, title: '花语集埋点方案 v1', type: 'doc', words: 1500 },
  { offset: 8, title: '花友集市：点赞/评论功能联调', type: 'code' },
  { offset: 9, title: '八字算算用户反馈整理', type: 'doc', words: 900 },
  { offset: 11, title: '花语集离线评测脚本', type: 'code' },
  { offset: 12, title: '与朋友讨论作品集页面结构', type: 'meeting' },
  { offset: 14, title: 'Studio 材质效果调研笔记', type: 'doc', words: 1100 },
  { offset: 16, title: '花语集 Badcase 归集方案', type: 'doc', words: 1700 },
  { offset: 18, title: '本周复盘：多 Agent 编排的坑', type: 'review', words: 750 },
  { offset: 21, title: '八字算算注册登录系统', type: 'code' },
  { offset: 23, title: '花友集市分享链接设计', type: 'design' },
  { offset: 25, title: '花语集 RAG 检索链路联调', type: 'code' },
  { offset: 28, title: '容器材质 7 种效果实现', type: 'code' },
  { offset: 30, title: '每周简报模板 v1', type: 'doc', words: 500 },
  { offset: 33, title: '花语集评测 baseline 记录', type: 'doc', words: 1300 },
  { offset: 36, title: '茎干数量上限调整 + toast 提示', type: 'code' },
  { offset: 40, title: '本周复盘：日志监控缺口', type: 'review', words: 650 },
  { offset: 45, title: '花束祝福语生成 - 文案打磨', type: 'design' },
  { offset: 52, title: '嵌入模型选型笔记（bge-m3）', type: 'doc', words: 1200 },
  { offset: 60, title: '项目立项：AI 检索作品集规划', type: 'meeting' },
]

function buildSeed(): Entry[] {
  const now = new Date()
  return SEED_TITLES.map((s) => {
    const d = new Date(now)
    d.setDate(d.getDate() - s.offset)
    return {
      id: crypto.randomUUID(),
      date: fmtDate(d),
      title: s.title,
      type: s.type,
      words: s.words,
      createdAt: d.getTime(),
    }
  })
}

export interface DayCell {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

export function buildHeatmapGrid(entries: Entry[], weeks = 14): DayCell[][] {
  const counts = new Map<string, number>()
  for (const e of entries) counts.set(e.date, (counts.get(e.date) ?? 0) + 1)

  const today = new Date()
  const days: DayCell[] = []
  const totalDays = weeks * 7
  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const date = fmtDate(d)
    const count = counts.get(date) ?? 0
    const level = (count === 0 ? 0 : count === 1 ? 1 : count === 2 ? 2 : count <= 4 ? 3 : 4) as DayCell['level']
    days.push({ date, count, level })
  }

  // pad to full weeks starting Sunday
  const firstDow = new Date(days[0].date).getUTCDay()
  const padded: DayCell[] = [
    ...Array.from({ length: firstDow }, () => ({ date: '', count: 0, level: 0 as const })),
    ...days,
  ]

  const grid: DayCell[][] = []
  for (let i = 0; i < padded.length; i += 7) {
    grid.push(padded.slice(i, i + 7))
  }
  return grid
}

export function last7DaysRange(): [string, string] {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 6)
  return [fmtDate(start), fmtDate(end)]
}

export function buildWeeklyReport(entries: Entry[]): string {
  const [start, end] = last7DaysRange()
  const inRange = entries
    .filter((e) => e.date >= start && e.date <= end)
    .sort((a, b) => a.date.localeCompare(b.date))

  const byType = new Map<EntryType, number>()
  let totalWords = 0
  for (const e of inRange) {
    byType.set(e.type, (byType.get(e.type) ?? 0) + 1)
    totalWords += e.words ?? 0
  }

  const byDate = new Map<string, Entry[]>()
  for (const e of inRange) {
    if (!byDate.has(e.date)) byDate.set(e.date, [])
    byDate.get(e.date)!.push(e)
  }

  const lines: string[] = []
  lines.push(`# 周报 ${start} ~ ${end}`)
  lines.push('')
  lines.push('## 总览')
  lines.push(`- 记录条目：${inRange.length} 条，覆盖 ${byDate.size} 天`)
  if (totalWords > 0) lines.push(`- 文字产出：约 ${totalWords} 字`)
  const typeSummary = Array.from(byType.entries())
    .map(([t, c]) => `${TYPE_META[t].label} ${c}`)
    .join(' / ')
  if (typeSummary) lines.push(`- 类型分布：${typeSummary}`)
  lines.push('')

  lines.push('## 每日明细')
  const sortedDates = Array.from(byDate.keys()).sort()
  if (sortedDates.length === 0) {
    lines.push('（最近 7 天暂无记录）')
  }
  for (const date of sortedDates) {
    lines.push(`**${date}**`)
    for (const e of byDate.get(date)!) {
      const meta = TYPE_META[e.type].label
      const words = e.words ? `，约${e.words}字` : ''
      const link = e.link ? ` [飞书文档](${e.link})` : ''
      lines.push(`- [${meta}] ${e.title}${words}${link}`)
    }
    lines.push('')
  }

  const highlights = [...inRange].sort((a, b) => (b.words ?? 0) - (a.words ?? 0)).slice(0, 3)
  if (highlights.length > 0) {
    lines.push('## 本周亮点')
    for (const h of highlights) {
      lines.push(`- ${h.title}${h.words ? `（约${h.words}字）` : ''}`)
    }
  }

  return lines.join('\n')
}
