/** Canonical public origin used in sitemaps, robots.txt, OpenAPI, and JSON-LD. */
export const SITE_CANONICAL_ORIGIN = 'https://gayatrilegalsolutions.com'

export const SITE_NAME = 'Gayatri Legal Solutions'
export const SITE_NAME_SHORT = 'Gayatri Legal'

export function originFromRequest(request: Request): string {
  try {
    return new URL(request.url).origin
  } catch {
    return SITE_CANONICAL_ORIGIN
  }
}
