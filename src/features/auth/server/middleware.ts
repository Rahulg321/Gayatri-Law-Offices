import { createMiddleware } from '@tanstack/react-start'
import { fetchAdminSession } from '#/features/auth/server/get-session-user'

/**
 * Attaches the current admin session (or null) to the server-fn context
 * without throwing. Use when a handler needs to branch on auth state.
 */
export const getSessionUserMiddleware = createMiddleware().server(async ({ next }) => {
  const session = await fetchAdminSession()
  return next({ context: { adminSession: session } })
})

/**
 * Requires an authenticated admin session. Throws for anonymous/non-admin
 * callers and provides the session as `adminSession` on the handler context.
 */
export const requireAdminMiddleware = createMiddleware()
  .middleware([getSessionUserMiddleware])
  .server(async ({ next, context }) => {
    if (!context.adminSession) {
      throw new Error('Unauthorized')
    }
    return next({ context: { adminSession: context.adminSession } })
  })
