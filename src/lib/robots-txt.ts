import { AI_CRAWLER_USER_AGENTS } from '#/lib/ai-crawlers'
import { SITE_CANONICAL_ORIGIN } from '#/lib/site'

export function buildRobotsTxt(origin: string = SITE_CANONICAL_ORIGIN): string {
  const allowBlocks = AI_CRAWLER_USER_AGENTS.map(
    (ua) => `User-agent: ${ua}\nAllow: /\n`,
  ).join('\n')

  return `# Gayatri Law Offices — agent crawl policy
# Content Signals (https://contentsignals.org/): search, AI input, and training are allowed.

User-agent: *
Content-Signal: search=yes, ai-input=yes, ai-train=yes, use=full
Allow: /

${allowBlocks}
Disallow: /admin
Disallow: /api/auth/

Sitemap: ${origin}/sitemap.xml
`
}
