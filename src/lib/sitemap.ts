import { SITE_CANONICAL_ORIGIN } from '#/lib/site'
import { services } from '#/lib/data'

export type SitemapUrl = {
  loc: string
  lastmod?: string
}

export const STATIC_SITEMAP_PATHS = [
  '/',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/faq',
  '/team',
  '/why-us',
  '/testimonials',
  '/timeline',
  '/services',
  '/projects',
  '/blogs',
  '/llms.txt',
  '/openapi.json',
] as const

export function formatSitemapLastmod(value: Date | string | number): string {
  const d = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(d.getTime())) return new Date().toISOString().slice(0, 10)
  return d.toISOString().slice(0, 10)
}

export function buildSitemapXml(
  urls: SitemapUrl[],
  origin: string = SITE_CANONICAL_ORIGIN,
): string {
  const body = urls
    .map((u) => {
      const loc = u.loc.startsWith('http') ? u.loc : `${origin.replace(/\/+$/, '')}${u.loc}`
      const lastmod = u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''
      return `  <url>\n    <loc>${escapeXml(loc)}</loc>${lastmod}\n  </url>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

export function staticSitemapUrls(today: string = formatSitemapLastmod(new Date())): SitemapUrl[] {
  const staticUrls = STATIC_SITEMAP_PATHS.map((path) => ({ loc: path, lastmod: today }))
  const serviceUrls = services.map((s) => ({ loc: `/services/${s.slug}`, lastmod: today }))
  return [...staticUrls, ...serviceUrls]
}
