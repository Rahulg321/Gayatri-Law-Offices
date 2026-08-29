import { describe, expect, it } from 'vitest'
import { buildSitemapXml, staticSitemapUrls } from '#/lib/sitemap'

describe('sitemap.xml', () => {
  it('lists indexable URLs with lastmod under the sitemap protocol', () => {
    const urls = staticSitemapUrls('2026-08-29')
    const xml = buildSitemapXml(urls, 'https://gayatrilegalsolutions.com')
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true)
    expect(xml).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')
    expect(xml).toContain('<loc>https://gayatrilegalsolutions.com/</loc>')
    expect(xml).toContain('<loc>https://gayatrilegalsolutions.com/about</loc>')
    expect(xml).toContain('<loc>https://gayatrilegalsolutions.com/contact</loc>')
    expect(xml).toContain('<loc>https://gayatrilegalsolutions.com/privacy</loc>')
    expect(xml).toContain('<lastmod>2026-08-29</lastmod>')
    expect(xml.length).toBeLessThan(50 * 1024 * 1024)
  })
})
