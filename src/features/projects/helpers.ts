import {
  portfolioSocialImage,
  seoDescription,
  seoTitle,
  type PortfolioProject,
} from '#/lib/cms'

export function portfolioProjectHeadMeta(project: PortfolioProject, siteOrigin?: string) {
  const title = seoTitle(project.title, project.metaTitle)
  const description = seoDescription(project.excerpt, project.metaDescription)
  const image = portfolioSocialImage(project)
  const canonical =
    project.canonicalUrl?.trim() ||
    (siteOrigin ? `${siteOrigin.replace(/\/+$/, '')}/projects/${project.slug}` : undefined)

  const meta = [
    { title: `${title} — Gayatri Law Offices` },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'article' },
    ...(image ? [{ property: 'og:image', content: image }] : []),
    { name: 'twitter:card', content: project.twitterCard },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    ...(image ? [{ name: 'twitter:image', content: image }] : []),
  ]

  const links = canonical ? [{ rel: 'canonical', href: canonical }] : []

  const datePublished = project.startDate?.trim() || `${project.year}-01-01`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description,
    image: image ? [image] : undefined,
    datePublished,
    about: project.category,
    ...(project.clientName ? { mentions: [{ '@type': 'Organization', name: project.clientName }] } : {}),
    ...(canonical ? { url: canonical } : {}),
  }

  return {
    meta,
    links,
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify(jsonLd),
      },
    ],
  }
}

/** Derive sanctioned embed iframe src for YouTube / Vimeo URLs only (no arbitrary HTML embeds). */
export function youtubeEmbedSrc(videoUrl: string): string | null {
  try {
    const url = new URL(videoUrl.trim())
    const host = url.hostname.replace(/^www\./, '')
    if (host === 'youtu.be') {
      const id = url.pathname.replace(/^\//, '').split('/')[0]
      return id && /^[\w-]{6,64}$/.test(id) ? `https://www.youtube.com/embed/${id}` : null
    }
    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
      let id = url.searchParams.get('v') ?? ''
      if (!id && url.pathname.startsWith('/embed/')) {
        id = url.pathname.replace(/^\/embed\//, '').split('/')[0] ?? ''
      }
      if (!id && url.pathname.startsWith('/shorts/')) {
        id = url.pathname.replace(/^\/shorts\//, '').split('/')[0] ?? ''
      }
      return id && /^[\w-]{6,64}$/.test(id) ? `https://www.youtube.com/embed/${id}` : null
    }
  } catch {
    return null
  }
  return null
}

export function vimeoEmbedSrc(videoUrl: string): string | null {
  try {
    const url = new URL(videoUrl.trim())
    const host = url.hostname.replace(/^www\./, '')
    if (host !== 'vimeo.com' && host !== 'player.vimeo.com') return null
    const parts = url.pathname.split('/').filter(Boolean)
    const id =
      host === 'player.vimeo.com' ? parts[0] : parts[0] === 'video' ? parts[1] : parts[0]
    if (!id || !/^\d+$/.test(id)) return null
    return `https://player.vimeo.com/video/${id}`
  } catch {
    return null
  }
}

export function formatProjectStatusLabel(raw: string) {
  return raw
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}
