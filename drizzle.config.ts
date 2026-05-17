import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

config({ path: ['.env.local', '.env'] })

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
const databaseId =
  process.env.D1_DATABASE_ID ?? 'f72eac8b-bb8c-4657-920a-87ee3fd100e4'
const token = process.env.CLOUDFLARE_API_TOKEN

export default defineConfig(
  accountId && token
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
          url: process.env.DATABASE_URL ?? 'file:.wrangler/state/v3/d1/local.sqlite',
        },
      },
)
