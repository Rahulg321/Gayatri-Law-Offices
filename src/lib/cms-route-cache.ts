import type { AnyRouter } from '@tanstack/react-router'
import { createIsomorphicFn } from '@tanstack/react-start'
import { setResponseHeaders } from '@tanstack/react-start/server'

/** In-browser: treat CMS loader data as fresh for this long, then refetch on the next visit. */
export const PUBLIC_CMS_STALE_MS = 60_000

/** In-browser: keep unused CMS loader data in memory for this long (ms). */
export const PUBLIC_CMS_GC_MS = 30 * 60_000

/** Workers Cache: serve public CMS HTML from the edge for this long (seconds). */
export const PUBLIC_CMS_S_MAXAGE_SEC = 300

/** After TTL, keep serving cached HTML while Cloudflare refreshes it (seconds). */
export const PUBLIC_CMS_SWR_SEC = 3600

/** Cache-Tag on public HTML; purged when CMS content is saved/deleted. */
export const PUBLIC_CMS_CACHE_TAG = 'cms'

const PUBLIC_CMS_ROUTE_IDS = new Set([
  '/',
  '/blogs/',
  '/blogs/$slug',
  '/services/',
  '/services/$slug',
  '/projects/',
  '/projects/$slug',
])

export function publicCmsCacheHeaders(): Record<string, string> {
  return {
    // Browsers always revalidate. Cloudflare caches the HTML at the edge.
    'Cache-Control': 'public, max-age=0, must-revalidate',
    'Cloudflare-CDN-Cache-Control': `public, max-age=${PUBLIC_CMS_S_MAXAGE_SEC}, stale-while-revalidate=${PUBLIC_CMS_SWR_SEC}`,
    'Cache-Tag': PUBLIC_CMS_CACHE_TAG,
  }
}

/** setResponseHeaders is typed as a Headers instance; runtime accepts a record. */
function applyResponseHeaderRecord(headers: Record<string, string>) {
  setResponseHeaders(headers as never)
}

export const applyPublicCmsCacheHeaders = createIsomorphicFn()
  .client(() => { })
  .server(() => {
    applyResponseHeaderRecord(publicCmsCacheHeaders())
  })

export const applyAdminNoStoreHeaders = createIsomorphicFn()
  .client(() => { })
  .server(() => {
    applyResponseHeaderRecord({ 'Cache-Control': 'private, no-store' })
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
