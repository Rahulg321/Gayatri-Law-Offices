/** Canonical public origin used in sitemaps, robots.txt, OpenAPI, and JSON-LD. */
export const SITE_CANONICAL_ORIGIN = 'https://gayatrilegalsolutions.com'

export const SITE_NAME = 'Gayatri Legal Solutions'
export const SITE_NAME_SHORT = 'Gayatri Legal'
export const SITE_ALTERNATE_NAMES = [
  'Gayatri Legal',
  'gayatrilegalsolutions',
  'Gayatri Legal Solutions LPO',
] as const

export const SITE_DESCRIPTION =
  'Gayatri Legal Solutions provides cost-effective, high-quality legal process outsourcing (LPO) from India for law firms and legal departments worldwide.'

export const SITE_EMAIL = 'info@gayatrilawoffices.com'
export const SITE_PHONE = '+91 09876 54321'
export const SITE_SAME_AS = [
  'https://www.linkedin.com/company/gayatri-legal-solutions/',
] as const

export const SITE_ADDRESS = {
  '@type': 'PostalAddress' as const,
  streetAddress: 'Ludhiana',
  addressLocality: 'Ludhiana',
  addressRegion: 'Punjab',
  postalCode: '141001',
  addressCountry: 'IN',
}

export const SITE_OG_IMAGE_PATH = '/og-image.svg'
export const SITE_OG_IMAGE_URL = `${SITE_CANONICAL_ORIGIN}${SITE_OG_IMAGE_PATH}`

export function originFromRequest(request: Request): string {
  try {
    return new URL(request.url).origin
  } catch {
    return SITE_CANONICAL_ORIGIN
  }
}

export function absoluteUrl(pathname: string, origin: string = SITE_CANONICAL_ORIGIN): string {
  if (pathname.startsWith('http://') || pathname.startsWith('https://')) return pathname
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`
  return `${origin.replace(/\/+$/, '')}${path}`
}
