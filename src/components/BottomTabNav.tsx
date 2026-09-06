export type TabId = 'home' | 'portfolio' | 'os' | 'ideas' | 'log'

const TABS: { id: TabId; label: string; emoji: string }[] = [
  { id: 'home', label: '主页', emoji: '🏠' },
  { id: 'portfolio', label: '作品集', emoji: '🎨' },
  { id: 'os', label: 'OS', emoji: '🖥️' },
  { id: 'ideas', label: '便签', emoji: '💡' },
  { id: 'log', label: '打卡', emoji: '🔥' },
]

export default function BottomTabNav({
  active,
  onChange,
}: {
  active: TabId
  onChange: (id: TabId) => void
}) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-30 flex justify-center px-4 sm:bottom-6">
      <nav className="pointer-events-auto flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-line bg-white/90 p-1.5 shadow-[0_12px_36px_rgba(26,26,46,0.18)] backdrop-blur-md">
        {TABS.map((t, i) => (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
              active === t.id
                ? 'scale-105 bg-blue text-white shadow-[0_4px_14px_rgba(43,127,216,0.4)]'
                : 'text-ink-soft hover:bg-paper-2 hover:scale-105'
            }`}
          >
            <span className="font-mono text-[10px] opacity-60">
              0{i + 1}
            </span>
            <span>{t.emoji}</span>
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
