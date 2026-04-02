# Zeabur Deployment Guide

This repository is a `pnpm workspace` monorepo with two runtime services:

- `apps/web`: Next.js frontend
- `apps/api`: NestJS backend

Deploy them as two separate Zeabur services in the same project, plus one PostgreSQL service.

## Why the root upload shows a blank page

Zeabur supports monorepos, but by default it may pick the first Node.js app in the workspace to deploy.
In this repository that often means the backend gets deployed instead of the frontend.

If your domain is pointing to the API service, opening `/` will not show the website homepage.

Quick checks:

- `https://your-api-domain/health`
- `https://your-api-domain/docs`

If one of those works, your API is up and your domain is likely bound to the wrong service.

## Recommended project structure on Zeabur

Create one Zeabur project with three services:

1. `web`
2. `api`
3. `postgres`

The `web` and `api` services should both point at this same Git repository and build from the repository root.
This repository now includes Zeabur-specific configuration files:

- `zbpack.json`
- `zbpack.api.json`
- `zbpack.web.json`

If your existing frontend service is still named `web-1-cap`, this repository also includes:

- `zbpack.web-1-cap.json`

For the cleanest setup, rename the frontend service to `web`.

## Service 1: web

Recommended setup:

- Root Directory: repository root
- Do not set a subdirectory root for the web service
- Let `zbpack.web.json` or `zbpack.web-1-cap.json` control the commands

Expected commands:

- Install Command: auto-detected `pnpm install`
- Build Command: `pnpm run build:web`
- Start Command: `pnpm run start:web`

Required environment variables:

- `NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.zeabur.app`

## Service 2: api

Recommended setup:

- Root Directory: repository root
- Do not set a subdirectory root for the api service
- Let `zbpack.api.json` control the commands

Expected commands:

- Install Command: auto-detected `pnpm install`
- Build Command: `pnpm run build:api`
- Start Command: `pnpm run start:api`

Required environment variables:

- `DATABASE_URL=<your postgres connection string>`
- `CORS_ORIGIN=https://your-web-domain.zeabur.app`
- `JWT_ACCESS_SECRET=<a long random secret>`

Optional but recommended:

- `NODE_ENV=production`

## Service 3: postgres

Use Zeabur PostgreSQL if you want the lowest setup cost.

Then copy the connection string into the API service as `DATABASE_URL`.

## Database migration

After the API service is created and `DATABASE_URL` is ready, run this command once in Zeabur's command panel for the API service:

```bash
pnpm --filter api exec prisma migrate deploy
```

If you ever change the Prisma schema later, redeploy and run the same command again.

The repository already forces Prisma Client generation before API builds:

- root install script: `postinstall -> pnpm prisma:generate:api`
- api install script: `apps/api/package.json -> postinstall`
- root build script: `pnpm build:api`
- app prebuild script: `apps/api/package.json -> prebuild`

The repository also includes Zeabur-specific safeguards:

- `zbpack.json -> app_dir: "/"` to force root-level build context
- `zbpack.json -> cache_dependencies: false` to avoid dependency cache reordering issues during Prisma generation

So if Zeabur rebuilds the service from a clean environment, it will still generate the Prisma client before TypeScript compilation.

## Web build stability

The frontend production build uses `next build --webpack` instead of the default Turbopack build.

This is intentional for deployment stability. Next.js 16 uses Turbopack by default, but Webpack remains the safer production choice when the hosting environment has process or sandbox restrictions during CSS and asset compilation.

## Domain binding

Bind domains like this:

- frontend domain -> `web` service
- backend domain -> `api` service

Do not bind your homepage domain to the API service.

## Production checklist

1. The `web` service opens the homepage correctly.
2. The `api` service responds on `/health`.
3. The `api` service exposes `/docs`.
4. `NEXT_PUBLIC_API_BASE_URL` points to the API domain.
5. `CORS_ORIGIN` points to the web domain.
6. Prisma migration has been executed.

## Useful commands from the repo root

These commands are available from the root `package.json`:

```bash
pnpm start:web
pnpm start:api
pnpm prisma:generate:api
pnpm prisma:migrate:deploy:api
```

## Source references

- Root scripts: `package.json`
- Workspace packages: `pnpm-workspace.yaml`
- Frontend env usage: `apps/web/src/lib/tarot-api.ts`
- Backend CORS and port config: `apps/api/src/main.ts`
- Prisma database config: `apps/api/prisma/schema.prisma`
