# Arcana Mirror

Arcana Mirror 是一个带有仪式感流程的塔罗 Web 应用，目标不是做“宿命式算命站”，而是提供更平静、象征化、可反思的抽牌与解读体验。

当前项目是一个 `pnpm workspace` monorepo，包含：

- `apps/web`: Next.js 前端
- `apps/api`: NestJS 后端
- `PostgreSQL + Prisma`: 数据存储与 ORM

## 项目特性

- 单张牌阅读
- 三张牌阵阅读（过去 / 现在 / 未来）
- 抽牌到读牌的仪式化流程
- 卡牌库与卡牌详情页
- 中英文切换
- 阅读内容按“初见 -> 展开 -> 深读”分层呈现
- API 启动时自动补齐内置塔罗牌目录

## 技术栈

- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS
- Backend: NestJS 11, TypeScript
- Database: PostgreSQL
- ORM: Prisma
- Package manager: pnpm

## 目录结构

```text
.
├── apps
│   ├── api            # NestJS backend
│   └── web            # Next.js frontend
├── docker-compose.yml # 本地 PostgreSQL
├── SPEC.md            # 产品规格草案
├── DEPLOY_ZEABUR.md   # Zeabur 部署说明
└── package.json       # monorepo 根脚本
```

## 本地开发

### 1. 环境要求

- Node.js `22.x`
- pnpm `10.x`
- Docker（如果你想用仓库自带的 PostgreSQL）

### 2. 安装依赖

```bash
pnpm install
```

根目录会在安装后自动执行 Prisma Client 生成。

### 3. 启动数据库

```bash
docker compose up -d
```

默认会启动一个本地 PostgreSQL：

- host: `localhost`
- port: `5432`
- database: `myapp`
- user: `postgres`
- password: `postgres`

### 4. 配置环境变量

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

### 5. 执行数据库迁移

```bash
pnpm prisma:migrate:deploy:api
```

第一次启动 API 后，内置塔罗牌目录会自动写入数据库，不需要额外 seed 命令。

### 6. 启动前后端

启动前端：

```bash
pnpm dev:web
```

启动后端：

```bash
pnpm dev:api
```

默认地址：

- Web: `http://localhost:3000`
- API: `http://localhost:3001`
- API Docs: `http://localhost:3001/docs`（仅非生产环境）

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
```

也可以直接在子应用目录运行各自的 `lint` / `build` / `test`。

## 当前 MVP 范围

- 首页
- 单张牌抽牌页
- 三张牌阵页
- 阅读结果页
- 卡牌库
- 关于页

已经有基础登录 / 注册相关代码，但当前产品重点仍然是抽牌与阅读体验。

## 产品方向

这个项目的核心方向是：

- mysterious, but not cheap
- spiritual, but not superstitious
- reflective, not deterministic
- elegant, not overloaded
- emotionally warm, not frightening

更完整的产品约束与协作规范可以参考：

- [SPEC.md](./SPEC.md)
- [AGENTS.md](./AGENTS.md)

## 部署

推荐将仓库作为 monorepo 部署到 Zeabur：

- 一个 `web` 服务
- 一个 `api` 服务
- 一个 `postgres` 服务

详细步骤见：

- [DEPLOY_ZEABUR.md](./DEPLOY_ZEABUR.md)

## 备注

- 前端生产构建使用 `next build --webpack`
- API 使用 Prisma 管理 `User`、`TarotCard`、`Reading`
- 阅读内容由后端统一生成，前端负责分层展示与沉浸式流程编排
