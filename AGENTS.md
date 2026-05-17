# Agent instructions — Gayatri Law Offices

Guidance for AI coding agents working in this repository.

## Package manager

**Always use Bun.** Never use `pnpm`, `npm`, or `yarn` for installs, scripts, or one-off CLIs in this project.

| Task | Command |
|------|---------|
| Install deps | `bun install` |
| Dev server | `bun run dev` |
| Build | `bun run build` |
| Tests | `bun run test` |
| Deploy | `bun run deploy` |
| One-off CLIs | `bunx <package>` (e.g. `bunx shadcn@latest add button`) |
| Wrangler | `bunx wrangler …` or scripts in `package.json` |

Lockfile: `bun.lock` only. Do not add `pnpm-lock.yaml` or `package-lock.json`.

## Stack

- **Framework**: TanStack Start (React 19) on Cloudflare Workers via `@cloudflare/vite-plugin`
- **Routing**: TanStack Router (file-based routes in `src/routes/`)
- **Styling**: Tailwind CSS v4 + shadcn/ui (`src/components/ui/`)
- **Auth**: Better Auth (`src/lib/auth.ts`, demo at `/demo/better-auth`)
- **Database**: Cloudflare D1 + Drizzle ORM
- **Object storage**: Cloudflare R2
- **Deploy**: Wrangler (`wrangler.jsonc`)

## Cloudflare bindings

Configured in `wrangler.jsonc`. Types in `worker-configuration.d.ts` (regenerate with `bun run cf-types` after binding changes).

| Binding | Type | Resource |
|---------|------|----------|
| `DB` | `D1Database` | `gayatri-law-offices-db` ( **`remote: true`** — local dev uses the same Cloudflare D1 as production, not a local SQLite copy ) |
| `ASSETS` | `R2Bucket` | `gayatri-law-offices-assets` |

Access bindings with `import { env } from 'cloudflare:workers'` — not `process.env` at module scope.

**Local dev + D1:** `DB` is configured with `remote: true` in `wrangler.jsonc`, so `bun run dev` talks to the **remote** database. Writes hit real data and billing applies. To use a local simulated D1 instead, remove `remote: true` or run with remote bindings disabled per [Wrangler docs](https://developers.cloudflare.com/workers/development-testing/#remote-bindings).

### SQL (D1 + Drizzle)

- Schema: `src/db/schema.ts`
- Client: `getDb()` from `src/db/index.ts` (uses `drizzle-orm/d1`)
- Migrations: SQL in `drizzle/`, applied via Wrangler

```ts
import { getDb } from '#/db/index'
const rows = await getDb().select().from(todos)
```

Use only inside server code (`createServerFn` handlers, route loaders that run on server).

### R2 / file storage

Reusable helpers in `src/lib/storage.ts`:

- **Binding path** (preferred): `getR2Bucket()` → `env.ASSETS` from `wrangler.jsonc`
- **Upload / delete**: `uploadFileBuffer()`, `deleteFile()`
- **Low-level**: `putAsset()`, `getAsset()`, `deleteAsset()`, `listAssets()`

Optional S3 API fallback (local scripts / no binding): set in `.env.local` or `.dev.vars`:

`R2_BUCKET_NAME`, `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_PUBLIC_BASE_URL`

## Database workflow

1. Edit `src/db/schema.ts`
2. `bun run db:generate` — generate SQL into `drizzle/`
3. `bun run db:migrate:remote` — apply migrations to **remote** D1 (this matches what you use in dev and production)
4. `bun run db:migrate:local` — optional; only for Miniflare’s **local** simulated D1 (when not using `remote: true`)

Optional remote Drizzle Kit (needs `.env.local`): `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`, `D1_DATABASE_ID`.

## Server vs client

TanStack Start is **isomorphic by default**. Loaders and components run on both server and client unless isolated.

- Server-only logic: `createServerFn()` from `@tanstack/react-start`
- Do not use `"use server"` / `"use client"` (Next.js patterns)
- Cloudflare `env` bindings: only in server functions or per-request server code

## Project layout

```
src/
  routes/          # File-based routes (demo/* can be deleted)
  db/              # Drizzle schema + getDb()
  lib/             # auth, storage (R2), utils
  components/      # UI + layout
drizzle/           # Generated SQL migrations
wrangler.jsonc     # Worker + D1 + R2 config
vite.config.ts     # cloudflare() + tanstackStart()
```

Path alias: `#/*` → `./src/*`

## UI components

Add shadcn components with:

```bash
bunx shadcn@latest add <component>
```

See `.cursorrules` for the same rule.

## Environment

- Local secrets: `.env.local` (gitignored)
- Worker env types: `worker-configuration.d.ts`
- Better Auth: `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET` in `.env.local`

## Conventions

- Match existing code style; minimal diffs; no drive-by refactors
- Keep imports at top of file
- Do not commit secrets (`.env`, credentials)
- Only create git commits when the user explicitly asks
- Prefer `bun run <script>` over inventing new invocations when a script exists in `package.json`

## Useful scripts

| Script | Purpose |
|--------|---------|
| `bun run dev` | Vite dev (port 3000) |
| `bun run deploy` | Build + `wrangler deploy` |
| `bun run db:generate` | Drizzle Kit generate |
| `bun run db:migrate:local` | D1 migrations (local simulation only) |
| `bun run db:migrate:remote` | D1 migrations (remote / production DB) |
| `bun run cf-types` | Regenerate Worker types |

## Skills

Cloudflare and frontend skills live under `.agents/skills/`. Prefer those references over stale training data for Workers, D1, R2, and Wrangler.
