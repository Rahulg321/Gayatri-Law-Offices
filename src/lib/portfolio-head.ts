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
