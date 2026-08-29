/** Canonical public origin used in sitemaps, robots.txt, OpenAPI, and JSON-LD. */
export const SITE_CANONICAL_ORIGIN = 'https://gayatrilegalsolutions.com'

export const SITE_NAME = 'Gayatri Law Offices'

export function originFromRequest(request: Request): string {
  try {
    return new URL(request.url).origin
  } catch {
    return SITE_CANONICAL_ORIGIN
  }
}
