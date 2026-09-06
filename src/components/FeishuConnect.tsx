import { useState } from 'react'

export default function FeishuConnect() {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-2xl border border-line bg-paper-2 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs text-ink-soft">飞书云文档</p>
          <p className="mt-1 text-sm text-ink">
            未连接 · 记录里的飞书链接目前需要手动粘贴
          </p>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="shrink-0 rounded-full border border-line bg-white px-3 py-1.5 text-xs text-ink-soft hover:border-blue/40 hover:text-blue-deep"
        >
          {open ? '收起' : '连接飞书文档'}
        </button>
      </div>
      {open && (
        <div className="mt-4 space-y-2 border-t border-line pt-4 text-sm text-ink-soft">
          <p>
            要做到"新建文档自动同步到这里"，需要先在
            <a
              className="mx-1 text-blue-deep underline underline-offset-2"
              href="https://open.feishu.cn"
              target="_blank"
              rel="noreferrer"
            >
              飞书开放平台
            </a>
            创建一个自建应用，拿到 App ID / App Secret，并授权云文档读取权限。
          </p>
          <p>这一步涉及注册应用和账号授权，需要你自己在飞书后台完成——我可以帮你写对接代码，但不能替你注册应用或授权。</p>
          <p className="text-xs text-coral">
            拿到凭证后告诉我，我来接入云文档列表 API 和 webhook，实现新建文档自动打卡。
          </p>
        </div>
      )}
    </div>
  )
}
