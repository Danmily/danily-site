# dangjq-site

党佳琪的个人主页。React + Vite + Tailwind，几个 tab：终端开场（主页）、作品集、OS 桌面、灵感便签、每日打卡 + AI 快讯。

便签墙和每日打卡走 `api/` 下的 Vercel Serverless Functions，数据存在 `@vercel/kv`。

## 结构

```
.
├── src/
│   ├── components/     # TerminalHero / Portfolio / OSDesktop / IdeaNotes / DailyLog / AIDigest ...
│   ├── lib/             # 数据读写逻辑（dailyLog / ideaNotes / aiDigest）
│   ├── App.tsx
│   └── main.tsx
├── api/                 # /api/entries、/api/notes 的 serverless functions（@vercel/kv）
├── public/
│   └── demos/
│       └── qa-study/    # 电商/生服/广告问答库（静态 demo，随构建原样拷贝）
└── vite.config.ts
```

## 本地开发

```bash
npm install
npm run dev       # 前端开发服务器（api/ 路由本地不可用，需要 vercel dev）
npm run build     # tsc -b && vite build，产物在 dist/
```

## 新增作品集卡片

在 `src/components/Portfolio.tsx` 的 `PROJECTS` 数组里加一项即可；有 `href` 的卡片可点击跳转，没有 `href` 的渲染成纯展示卡片。

## 新增 demo

静态 demo 放 `public/demos/<项目名>/`，构建时会被原样拷贝到 `dist/demos/<项目名>/`，Vercel 部署后即可通过 `/demos/<项目名>/` 访问；同时记得在 `Portfolio.tsx` 里加一张卡片链接过去。
