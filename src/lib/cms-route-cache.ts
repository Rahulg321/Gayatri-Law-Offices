import type { AnyRouter } from '@tanstack/react-router'
import { createIsomorphicFn } from '@tanstack/react-start'
import { setResponseHeaders } from '@tanstack/react-start/server'

/** Router loader cache: treat CMS data as fresh for this long (ms). */
export const PUBLIC_CMS_STALE_MS = 60_000

/** Router loader cache: keep unused CMS loader data for this long (ms). */
export const PUBLIC_CMS_GC_MS = 30 * 60_000

/** CDN / shared cache TTL for public CMS HTML (seconds). */
export const PUBLIC_CMS_S_MAXAGE_SEC = 120

/** Serve stale HTML while revalidating at the edge (seconds). */
export const PUBLIC_CMS_SWR_SEC = 300

const PUBLIC_CMS_ROUTE_IDS = new Set([
  '/blogs/',
  '/blogs/$slug',
  '/services/',
  '/services/$slug',
  '/projects/',
  '/projects/$slug',
])

export function publicCmsCacheHeaders(): Record<string, string> {
  return {
    'Cache-Control': `public, s-maxage=${PUBLIC_CMS_S_MAXAGE_SEC}, stale-while-revalidate=${PUBLIC_CMS_SWR_SEC}`,
  }
}

export const applyPublicCmsCacheHeaders = createIsomorphicFn()
  .client(() => {})
  .server(() => {
    setResponseHeaders(publicCmsCacheHeaders())
  })

export const applyAdminNoStoreHeaders = createIsomorphicFn()
  .client(() => {})
  .server(() => {
    setResponseHeaders({ 'Cache-Control': 'private, no-store' })
  })

function shouldInvalidateCmsRoute(routeId: string): boolean {
  if (routeId.startsWith('/admin')) return true
  return PUBLIC_CMS_ROUTE_IDS.has(routeId)
}

export function invalidateCmsRoutes(router: AnyRouter): Promise<void> {
  return router.invalidate({
    filter: (match) => shouldInvalidateCmsRoute(match.routeId),
  })
}
