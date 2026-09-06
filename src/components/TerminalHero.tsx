import { useEffect, useState } from 'react'

type Line = { prompt: string; output?: string[] }

const SCRIPT: Line[] = [
  { prompt: 'whoami' },
  { prompt: 'cat about.md' },
  { prompt: 'echo "今天的产出，明天看得见"' },
]

const OUTPUTS: Record<string, string[]> = {
  whoami: ['党佳琪 / Dang Jiaqi'],
  'cat about.md': [
    '在 AI 时代边做边学的产品人',
    'vibe coding 是主要武器，日常用 Agent 搭档干活',
    '正在把「做了什么」这件事本身做成一个产品',
  ],
  'echo "今天的产出，明天看得见"': ['> 今天的产出，明天看得见'],
}

function useTyped(text: string, active: boolean, speed = 32) {
  const [out, setOut] = useState('')
  useEffect(() => {
    if (!active) return
    setOut('')
    let i = 0
    const id = setInterval(() => {
      i += 1
      setOut(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [text, active])
  return out
}

function TypedLine({
  line,
  active,
  onDone,
}: {
  line: Line
  active: boolean
  onDone: () => void
}) {
  const typed = useTyped(line.prompt, active)
  const done = typed === line.prompt
  const [showOutput, setShowOutput] = useState(false)

  useEffect(() => {
    if (!done) return
    const t = setTimeout(() => {
      setShowOutput(true)
      onDone()
    }, 220)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done])

  return (
    <div className="mb-3">
      <div className="flex items-baseline gap-2">
        <span className="text-amber">$</span>
        <span className="text-white">{typed}</span>
        {active && !done && <span className="caret" />}
      </div>
      {showOutput &&
        OUTPUTS[line.prompt]?.map((o, i) => (
          <div
            key={i}
            className="fade-up pl-4 text-white/75"
            style={{ animationDelay: `${i * 90}ms` }}
          >
            {o}
          </div>
        ))}
    </div>
  )
}

export default function TerminalHero() {
  const [step, setStep] = useState(0)

  return (
    <div className="pb-28 pt-16 sm:pt-20">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-line bg-white/70 px-3 py-1 font-mono text-xs text-ink-soft">
          <span className="h-1.5 w-1.5 rounded-full bg-mint" /> 正在营业 🌱
        </p>
        <h1 className="font-hand text-6xl leading-none text-blue-deep sm:text-7xl">
          嗨，我是党佳琪
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[15px] text-ink-soft">
          作品集、每天在做的事，和一份会自己长出来的周报。
        </p>
      </div>

      {/* MacBook mockup */}
      <div className="float-soft mx-auto mt-10 w-full max-w-2xl px-6">
        <div className="rounded-t-[14px] bg-[#2a2a30] px-3 pt-3 shadow-[0_30px_60px_-15px_rgba(26,26,46,0.35)]">
          <div className="mx-auto mb-2 h-3.5 w-32 rounded-b-[10px] bg-[#2a2a30]" />
          <div className="overflow-hidden rounded-[4px] bg-blue">
            <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-3 font-mono text-[11px] text-white/60">
                dang@universe ~ zsh
              </span>
            </div>
            <div className="min-h-[210px] p-5 font-mono text-[13px] leading-[1.7] sm:p-6">
              {SCRIPT.slice(0, step + 1).map((line, i) => (
                <TypedLine
                  key={line.prompt}
                  line={line}
                  active={i === step}
                  onDone={() => setStep((s) => Math.max(s, i + 1))}
                />
              ))}
            </div>
          </div>
        </div>
        {/* keyboard deck */}
        <div className="relative h-3 rounded-b-sm bg-[#dcdce0]">
          <div className="absolute left-1/2 top-0 h-1.5 w-20 -translate-x-1/2 rounded-b-md bg-[#c7c7cd]" />
        </div>
        <div className="mx-auto h-2 w-[110%] max-w-none -translate-x-[5%] rounded-b-2xl bg-[#c7c7cd]" />
      </div>
    </div>
  )
}
