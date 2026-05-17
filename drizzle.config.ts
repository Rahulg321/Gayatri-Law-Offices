import { readFileSync } from 'node:fs'
import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

config({ path: ['.env.local', '.env'] })

const DEFAULT_DATABASE_ID = 'f72eac8b-bb8c-4657-920a-87ee3fd100e4'

function readWranglerDatabaseId(): string {
  try {
    const wrangler = readFileSync('wrangler.jsonc', 'utf8')
    const match = wrangler.match(/"database_id"\s*:\s*"([^"]+)"/)
    return match?.[1] ?? DEFAULT_DATABASE_ID
  } catch {
    return DEFAULT_DATABASE_ID
  }
}

function useRemoteD1(): boolean {
  return process.env.DRIZZLE_STUDIO_TARGET !== 'local'
}

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim()
const databaseId = process.env.D1_DATABASE_ID?.trim() || readWranglerDatabaseId()
const token = (
  process.env.DRIZZLE_CLOUDFLARE_API_TOKEN ?? process.env.CLOUDFLARE_API_TOKEN
)?.trim()
const remote = useRemoteD1()

if (remote) {
  if (!token) {
    console.error(`
Drizzle Studio is configured for remote D1 (same database as dev/production).

Missing DRIZZLE_CLOUDFLARE_API_TOKEN in .env.local

1. Create a token: https://dash.cloudflare.com/profile/api-tokens
   (custom token with Account → D1 → Read is enough for Studio)
2. Add to .env.local (use DRIZZLE_* so bun run dev is not affected):

   DRIZZLE_CLOUDFLARE_API_TOKEN=your_token_here
   CLOUDFLARE_ACCOUNT_ID=your_account_id

   Account ID: Cloudflare dashboard → Workers & Pages → right sidebar,
   or run: bunx wrangler whoami

   Database ID (optional): ${databaseId}  (from wrangler.jsonc)

To browse local Miniflare SQLite instead (often empty when using remote: true):
   bun run db:studio:local
`)
    process.exit(1)
  }
  if (!accountId) {
    console.error(
      'Missing CLOUDFLARE_ACCOUNT_ID in .env.local. Run `bunx wrangler whoami` and copy the Account ID.',
    )
    process.exit(1)
  }

  console.log(`Drizzle Studio → remote D1 (${databaseId})`)
  console.log(`Account: ${accountId}`)
}

export default defineConfig(
  remote && accountId && token
    ? {
      out: './drizzle',
      schema: './src/db/schema.ts',
      dialect: 'sqlite',
      driver: 'd1-http',
      dbCredentials: {
        accountId,
        databaseId,
        token,
      },
    }
    : {
      out: './drizzle',
      schema: './src/db/schema.ts',
      dialect: 'sqlite',
      dbCredentials: {
        url:
          process.env.DATABASE_URL ??
          'file:.wrangler/state/v3/d1/miniflare-D1DatabaseObject/local.sqlite',
      },
    },
)
