# Arcana Mirror

Arcana Mirror 是一个以“象征性反思”而不是“宿命式预言”为核心的塔罗 Web 应用。它把抽牌做成一段缓慢、克制、有仪式感的交互，把解读做成温和、可阅读、可回看的心理支持型内容。

这个项目当前已经覆盖 MVP 的核心体验，并且在抽卡阶段加入了摄像头手势增强模式：

- 首页、单张牌、三张牌、结果页、卡牌库、关于页
- 中英文双语切换
- 手势抽卡弹层：摄像头识别手部，支持移动卷轴与捏合点击
- 触控 / 鼠标 fallback：摄像头不可用时自动回退到原有卷轴流程
- 前后端分离的 REST API
- PostgreSQL + Prisma 持久化阅读结果

## 当前体验

- 首页负责建立产品气质，并引导进入单张牌或三张牌阅读。
- 抽卡页先让用户输入问题，再点击“开始仪式”进入抽卡流程。
- 默认会打开一个仪式抽卡弹层：
  - 桌面端以居中 modal 呈现
  - 移动端以更贴近全屏 sheet 的方式呈现
- 手势模式下，食指指尖用于移动悬浮指针，拇指和食指捏合用于“点击”。
- 单张牌流程中，捏合一次选牌，牌面翻开后再捏合一次进入完整阅读。
- 三张牌流程中，捏合一次只选出一张牌；三张都翻开之后，才允许再次捏合进入完整阅读。
- 如果摄像头不支持、权限被拒、初始化失败或长时间丢手，流程会自动回退到原有的拖拽 / 滚轮 / 点击卷轴，不阻断阅读。

## 产品原则

- 神秘，但不廉价
- 灵性，但不迷信
- 反思导向，而不是决定论
- 优雅、克制、可读
- 情绪上温和，不制造恐惧

解读文案应尽量使用这种表达方式：

- “这张牌提示……”
- “你可能正处于一个……的阶段”
- “这组牌邀请你去反思……”
- “一个有帮助的下一步也许是……”

避免使用绝对化、操控性或恐吓式语言。

## 主要页面

- `/`：首页
- `/draw/single`：单张牌阅读
- `/draw/three`：三张牌阵阅读
- `/reading/[id]`：阅读结果页
- `/cards`：卡牌库
- `/cards/[slug]`：卡牌详情页
- `/about`：关于与使用说明
- `/login`：登录页
- `/register`：注册页
- `/me`：当前用户页

账号相关页面目前是基础能力，核心产品体验仍然围绕匿名可用的塔罗阅读展开。

## 技术架构

- `apps/web`：Next.js 16 + React 19 + Tailwind CSS 4
- `apps/api`：NestJS + Prisma
- `PostgreSQL`：主数据库
- `@mediapipe/tasks-vision`：手势识别
- `motion`：过渡、翻牌和卷轴动效

前端负责：

- 页面与仪式交互
- 手势抽卡弹层与 fallback 流程
- 卡牌库与结果页渲染
- 国际化文案切换

后端负责：

- 卡牌目录与本地化数据
- 单张牌 / 三张牌阅读生成
- 阅读持久化
- 鉴权基础能力

## 仓库结构

```text
.
├── apps/
│   ├── api/   # NestJS API
│   └── web/   # Next.js Web App
├── docker-compose.yml
├── README.md
├── SPEC.md
└── AGENTS.md
```

和抽卡流程直接相关的核心文件：

- `apps/web/src/features/reading/draw-flow.tsx`
- `apps/web/src/features/reading/ritual-gesture-modal.tsx`
- `apps/web/src/features/reading/ritual-scroll-stage.tsx`
- `apps/web/src/features/reading/hand-gesture.worker.ts`
- `apps/web/src/lib/tarot-api.ts`
- `apps/api/src/readings/readings.controller.ts`
- `apps/api/src/readings/readings.service.ts`

## 本地开发

### 环境要求

- Node.js `22.x`
- pnpm `10.x`
- Docker

### 安装依赖

```bash
pnpm install
```

### 启动数据库

```bash
docker compose up -d
```

默认 PostgreSQL 配置：

- host: `localhost`
- port: `5432`
- database: `myapp`
- user: `postgres`
- password: `postgres`

### 配置环境变量

前端：

复制 `apps/web/.env.example` 为 `apps/web/.env.local`

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

后端：

复制 `apps/api/.env.example` 为 `apps/api/.env`

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/myapp?schema=public
CORS_ORIGIN=http://localhost:3000
JWT_ACCESS_SECRET=replace-with-a-long-random-secret
```

### 执行数据库迁移

```bash
pnpm prisma:migrate:deploy:api
```

### 启动前后端

```bash
pnpm dev:web
pnpm dev:api
```

默认地址：

- Web: `http://localhost:3000`
- API: `http://localhost:3001`
- API Docs: `http://localhost:3001/docs`

## 常用命令

```bash
pnpm dev:web
pnpm dev:api

pnpm build:web
pnpm build:api

pnpm start:web
pnpm start:api

pnpm prisma:generate:api
pnpm prisma:migrate:deploy:api

pnpm --filter web lint
pnpm --filter api test -- --runInBand src/readings/readings.service.spec.ts
```

## 当前接口概览

- `GET /cards`：获取卡牌列表
- `GET /cards/:slug`：获取单张卡牌详情
- `POST /readings/single`：创建单张牌阅读
- `POST /readings/three`：创建三张牌阅读
- `GET /readings/:id`：获取阅读结果
- `POST /auth/register`：注册
- `POST /auth/login`：登录
- `GET /auth/me`：获取当前用户

阅读接口支持 `locale` 查询参数，并支持可选的 `selectedCardIds` 请求字段。当前手势抽卡和 fallback 卷轴都会把前端实际选中的牌传给后端，确保“看到哪张、翻开的就是哪张”。

## 文档

- [SPEC.md](./SPEC.md)：当前产品与交互基线说明
- [AGENTS.md](./AGENTS.md)：协作约束、产品方向与实现边界
