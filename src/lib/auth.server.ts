import { betterAuth } from 'better-auth'
import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { eq } from 'drizzle-orm'
import { getDb } from '#/db/index'
import { authSchema, user as userTable } from '#/db/schema'
import { getAdminEmails, isAdminEmail } from '#/lib/admin'

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(getDb(), {
    provider: 'sqlite',
    schema: authSchema,
  }),
  emailAndPassword: {
    enabled: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          if (!isAdminEmail(user.email)) {
            throw new Error('Access denied: this email is not authorized for admin access.')
          }
          return { data: user }
        },
      },
    },
    session: {
      create: {
        before: async (session) => {
          const rows = await getDb()
            .select({ email: userTable.email })
            .from(userTable)
            .where(eq(userTable.id, session.userId))
            .limit(1)
          if (!isAdminEmail(rows[0]?.email)) {
            throw new Error('Access denied: this email is not authorized for admin access.')
          }
          return { data: session }
        },
      },
    },
  },
  plugins: [tanstackStartCookies()],
})

export { getAdminEmails }
