import { APIError, betterAuth } from 'better-auth'
import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { eq } from 'drizzle-orm'
import { getDb } from '#/lib/db'
import { authSchema, user as userTable } from '#/db/schema'
import { getAdminEmails, isAdminEmail } from '#/lib/admin'

const ADMIN_ACCESS_DENIED =
  'Access denied: this email is not authorized for admin access.'

function assertAdminEmail(email: string | null | undefined) {
  if (!isAdminEmail(email)) {
    throw new APIError('FORBIDDEN', { message: ADMIN_ACCESS_DENIED })
  }
}

/** Hosts that may serve this Worker (OAuth redirect_uri + CSRF origin checks). */
const AUTH_ALLOWED_HOSTS = [
  'gayatrilegalsolutions.com',
  'www.gayatrilegalsolutions.com',
  'gayatrilawoffices.in',
  'www.gayatrilawoffices.in',
  'gayatri-law-offices.pages.dev',
  'localhost:3000',
  '127.0.0.1:3000',
]

export const auth = betterAuth({
  // Resolve base URL from the request host so Google OAuth + cookies stay on the
  // same domain (gayatrilegalsolutions.com vs gayatrilawoffices.in).
  baseURL: {
    allowedHosts: AUTH_ALLOWED_HOSTS,
    fallback: process.env.BETTER_AUTH_URL || 'https://gayatrilegalsolutions.com',
  },
  secret: process.env.BETTER_AUTH_SECRET,
  onAPIError: {
    errorURL: '/admin/login',
  },
  database: drizzleAdapter(getDb(), {
    provider: 'sqlite',
    schema: authSchema,
  }),
  emailAndPassword: {
    enabled: false,
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ['google'],
    },
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
          assertAdminEmail(user.email)
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
          assertAdminEmail(rows[0]?.email)
          return { data: session }
        },
      },
    },
  },
  plugins: [tanstackStartCookies()],
})

export { getAdminEmails }
