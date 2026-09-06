type Project = {
  id: string
  name: string
  tag: string
  desc: string
  stack: string[]
  href?: string
  status: 'live' | 'wip'
  icon: string
  iconBg: string
}

const PROJECTS: Project[] = [
  {
    id: 'bazi',
    name: '八字算算',
    tag: 'vibe coding · AI 命理',
    desc: '用 AI 解读生辰八字的互动应用，输入出生信息即可生成结构化的命理解读，一次周末 vibe coding 的产物。',
    stack: ['Next.js', 'LLM API'],
    href: 'https://bazi-suansuan.vercel.app/',
    status: 'live',
    icon: '☯️',
    iconBg: '#f0b429',
  },
  {
    id: 'huayu',
    name: '花语集',
    tag: 'vibe coding · AI 检索/Agent',
    desc: '花卉主题的检索与创作引擎：搭花束、生成文案，背后是一整套召回-排序-Agent 编排链路，用来练手真正的搜索工程能力。刚部署，后端还在调稳。',
    stack: ['FastAPI', 'React', 'Multi-Agent'],
    href: 'https://lite-search-project.vercel.app/',
    status: 'wip',
    icon: '🌸',
    iconBg: '#ff8a65',
  },
  {
    id: 'chongyu',
    name: '重遇',
    tag: 'vibe coding · 信息重遇',
    desc: '收藏了再也找不到，多半不是忘了存哪，而是压根不记得自己存过。所以它不做更好的搜索框——按你手上有多少时间给收藏打分，每天主动推回几条，并说清楚为什么是现在。',
    stack: ['Vanilla JS', 'localStorage', '重遇打分'],
    href: 'https://danmily.github.io/make-your-collection-userful/',
    status: 'live',
    icon: '🌊',
    iconBg: '#4a90a4',
  },
  {
    id: 'qa-study',
    name: '电商/生服/广告问答库',
    tag: 'vibe coding · 学习工具',
    desc: '247 道自测问答，覆盖交易域、数据域、生活服务、广告商业化与数据评估方法论，支持进度保存与闪卡自测。',
    stack: ['HTML', 'Vanilla JS', 'localStorage'],
    href: '/demos/qa-study/',
    status: 'live',
    icon: '📚',
    iconBg: '#3b6ef6',
  },
]

function ProjectCard({ p }: { p: Project }) {
  const Wrapper = p.href ? 'a' : 'div'
  return (
    <Wrapper
      {...(p.href
        ? { href: p.href, target: '_blank', rel: 'noreferrer' }
        : {})}
      className={`group flex flex-col rounded-[28px] border border-line bg-white p-6 shadow-[0_4px_16px_rgba(26,26,46,0.06)] transition-all ${
        p.href
          ? 'hover:-translate-y-1.5 hover:rotate-[-0.5deg] hover:shadow-[0_20px_44px_rgba(26,26,46,0.14)]'
          : ''
      }`}
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span
            className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl shadow-inner"
            style={{ background: p.iconBg }}
          >
            {p.icon}
          </span>
          <div>
            <h3 className="text-lg font-semibold text-ink">{p.name}</h3>
            <p className="font-mono text-[11px] text-blue-deep">{p.tag}</p>
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 font-mono text-[11px] ${
            p.status === 'live'
              ? 'bg-mint/15 text-mint'
              : 'bg-amber/15 text-amber'
          }`}
        >
          {p.status === 'live' ? '已上线 ✓' : '开发中'}
        </span>
      </div>
      <p className="flex-1 text-sm leading-relaxed text-ink-soft">{p.desc}</p>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {p.stack.map((s) => (
            <span
              key={s}
              className="rounded-full bg-paper-2 px-2.5 py-1 font-mono text-[11px] text-ink-soft"
            >
              {s}
            </span>
          ))}
        </div>
        {p.href && (
          <span className="font-mono text-xs text-blue-deep transition-transform group-hover:translate-x-0.5">
            访问 →
          </span>
        )}
      </div>
    </Wrapper>
  )
}

export default function Portfolio() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-28 pt-10 sm:pt-14">
      <div className="mb-10 text-center">
        <p className="font-mono text-xs text-blue-deep">$ ls projects/</p>
        <h2 className="font-hand mt-1 text-5xl text-blue-deep">作品集 🎨</h2>
        <p className="mt-2 text-sm text-ink-soft">全都是周末 vibe coding 搓出来的</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {PROJECTS.map((p) => (
          <ProjectCard key={p.id} p={p} />
        ))}
      </div>
    </div>
  )
}
