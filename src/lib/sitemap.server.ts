import { listPublishedBlogPosts } from '#/features/blogs/server/blogs-service'
import { listPublishedPracticeAreas } from '#/features/practice-areas/server/practice-areas-service'
import { listPublishedPortfolioProjects } from '#/features/projects/server/projects-service'
import { methodNotAllowedResponse } from '#/lib/http-problem'
import {
  buildSitemapXml,
  formatSitemapLastmod,
  staticSitemapUrls,
  type SitemapUrl,
} from '#/lib/sitemap'
import { originFromRequest } from '#/lib/site'

export async function handleSitemap(request: Request): Promise<Response> {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return methodNotAllowedResponse(request, 'GET, HEAD')
  }

  const origin = originFromRequest(request)
  const today = formatSitemapLastmod(new Date())
  const urls: SitemapUrl[] = staticSitemapUrls(today)

  try {
    const [posts, projects, areas] = await Promise.all([
      listPublishedBlogPosts(),
      listPublishedPortfolioProjects(),
      listPublishedPracticeAreas(),
    ])
    for (const post of posts) {
      urls.push({
        loc: `/blogs/${post.slug}`,
        lastmod: formatSitemapLastmod(post.updatedAt),
      })
    }
    for (const project of projects) {
      urls.push({ loc: `/projects/${project.slug}`, lastmod: today })
    }
    const seenServices = new Set(urls.map((u) => u.loc))
    for (const area of areas) {
      const loc = `/services/${area.slug}`
      if (seenServices.has(loc)) continue
      urls.push({ loc, lastmod: today })
    }
  } catch {
    // Static service catalog already included.
  }

  const deduped = dedupeUrls(urls)
  return new Response(buildSitemapXml(deduped, origin), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  })
}

function dedupeUrls(urls: SitemapUrl[]): SitemapUrl[] {
  const seen = new Set<string>()
  const out: SitemapUrl[] = []
  for (const url of urls) {
    if (seen.has(url.loc)) continue
    seen.add(url.loc)
    out.push(url)
  }
  return out
}
