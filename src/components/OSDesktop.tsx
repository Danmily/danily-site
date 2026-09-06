import Avatar3D from './Avatar3D'
import type { TabId } from './BottomTabNav'

type DesktopIcon = {
  id: string
  label: string
  kind: 'folder' | 'file'
  ext?: string
  href?: string
  tab?: TabId
  disabledNote?: string
}

const ICONS: DesktopIcon[] = [
  { id: 'bazi', label: '八字算算', kind: 'folder', href: 'https://bazi-suansuan.vercel.app/' },
  {
    id: 'huayu',
    label: '花语集',
    kind: 'folder',
    href: 'https://lite-search-project.vercel.app/',
    disabledNote: '体验版·后端调优中',
  },
  { id: 'portfolio', label: '全部作品', kind: 'file', ext: '.html', tab: 'portfolio' },
  { id: 'ideas', label: '灵感便签', kind: 'file', ext: '.md', tab: 'ideas' },
  { id: 'log', label: '每日打卡', kind: 'file', ext: '.html', tab: 'log' },
  { id: 'about', label: 'about', kind: 'file', ext: '.md', tab: 'home' },
]

function FolderIcon() {
  return (
    <div className="relative h-12 w-14 drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)]">
      <div className="absolute bottom-0 h-9 w-14 rounded-md bg-gradient-to-b from-[#ffd469] to-[#f5b93a]" />
      <div className="absolute bottom-[30px] left-0 h-3 w-7 rounded-t-md bg-[#ffd469]" />
    </div>
  )
}

function FileIcon({ ext }: { ext: string }) {
  return (
    <div className="relative h-12 w-10 drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)]">
      <div
        className="h-full w-full rounded-[3px] bg-white"
        style={{ clipPath: 'polygon(0 0, 70% 0, 100% 30%, 100% 100%, 0 100%)' }}
      />
      <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-blue px-1.5 py-0.5 font-mono text-[9px] font-medium text-white">
        {ext}
      </span>
    </div>
  )
}

function Icon({ icon, onNavigate }: { icon: DesktopIcon; onNavigate: (id: TabId) => void }) {
  const body = (
    <div className="flex w-20 flex-col items-center gap-1.5 rounded-xl p-2 text-center transition-transform hover:-translate-y-0.5 hover:bg-white/10">
      {icon.kind === 'folder' ? <FolderIcon /> : <FileIcon ext={icon.ext ?? '.md'} />}
      <span className="font-mono text-[11px] leading-tight text-white/90">{icon.label}</span>
      {icon.disabledNote && (
        <span className="font-mono text-[9px] leading-tight text-white/50">
          {icon.disabledNote}
        </span>
      )}
    </div>
  )

  if (icon.tab) {
    return (
      <button onClick={() => onNavigate(icon.tab!)} className="cursor-pointer">
        {body}
      </button>
    )
  }

  if (!icon.href) return body

  return (
    <a href={icon.href} target="_blank" rel="noreferrer">
      {body}
    </a>
  )
}

export default function OSDesktop({ onNavigate }: { onNavigate: (id: TabId) => void }) {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-28 pt-10 sm:pt-14">
      <div className="mb-6 text-center">
        <p className="font-mono text-xs text-blue-deep">$ cd /os && ls</p>
        <h2 className="font-hand mt-1 text-5xl text-blue-deep">我的 OS 🖥️</h2>
        <p className="mt-2 text-sm text-ink-soft">点图标逛逛，都是能点的</p>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-line shadow-[0_20px_50px_rgba(26,26,46,0.2)]">
        <div className="relative min-h-[420px] bg-gradient-to-br from-[#2b7fd8] to-[#1e5ba8] px-5 py-5 sm:px-8 sm:py-6">
          <div className="pointer-events-none absolute inset-0 opacity-70">
            {Array.from({ length: 26 }).map((_, i) => (
              <span
                key={i}
                className="absolute text-white/70"
                style={{
                  top: `${(i * 37) % 90}%`,
                  left: `${(i * 53) % 92}%`,
                  fontSize: i % 3 === 0 ? '14px' : '8px',
                }}
              >
                ✦
              </span>
            ))}
          </div>

          <div className="relative mb-8 flex items-center justify-between">
            <span className="font-hand text-2xl text-white">dang OS</span>
            <span className="font-mono text-xs text-white/60">敬请自定义 ✧</span>
          </div>

          <div className="relative flex flex-wrap justify-end gap-x-2 gap-y-4">
            {ICONS.map((icon) => (
              <Icon key={icon.id} icon={icon} onNavigate={onNavigate} />
            ))}
          </div>

          <div className="relative mt-10 flex justify-center sm:absolute sm:bottom-2 sm:left-6 sm:mt-0">
            <Avatar3D />
          </div>
        </div>
      </div>
      <p className="mx-auto mt-3 max-w-3xl text-center text-xs text-ink-soft">
        这是框架 demo：图标、文件夹样式都能换成你自己的项目和内容。
      </p>
    </div>
  )
}
