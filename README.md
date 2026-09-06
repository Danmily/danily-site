# danily-site

Danmily 的个人主页，静态站点，部署在 Vercel。

## 结构

```
.
├── index.html              # 主页：About + Demo 项目入口
└── demos/
    └── qa-study/
        └── index.html      # 电商/生服/广告 新人问答库（学习自测工具）
```

## 本地预览

```bash
python3 -m http.server 8080
```

然后打开 http://localhost:8080

## 新增 demo

在 `demos/<项目名>/` 下放入静态页面，再到根目录 `index.html` 的「Demo 项目」区块里加一张卡片链接过去即可。
