import {
  categoryBreadcrumb,
  displayAuthorName,
  seoDescription,
  seoTitle,
  socialImageUrl,
  type BlogPost,
} from '#/lib/cms'

export function blogPostHeadMeta(post: BlogPost, siteOrigin?: string) {
  const title = seoTitle(post.title, post.metaTitle)
  const description = seoDescription(post.excerpt, post.metaDescription)
  const image = socialImageUrl(post)
  const canonical =
    post.canonicalUrl?.trim() ||
    (siteOrigin ? `${siteOrigin.replace(/\/+$/, '')}/blogs/${post.slug}` : undefined)

  const meta = [
    { title: `${title} — Gayatri Law Offices` },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'article' },
    ...(image ? [{ property: 'og:image', content: image }] : []),
    { name: 'twitter:card', content: post.twitterCard },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    ...(image ? [{ name: 'twitter:image', content: image }] : []),
  ]

  const links = canonical ? [{ rel: 'canonical', href: canonical }] : []

  const authorName = displayAuthorName(post.author)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description,
    image: image ? [image] : undefined,
    datePublished: post.date,
    dateModified: post.updatedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: authorName,
      ...(post.author.imageUrl ? { image: post.author.imageUrl } : {}),
    },
    articleSection: categoryBreadcrumb(post.category, post.categoryParent),
    keywords: post.tags.length ? post.tags.join(', ') : undefined,
    mainEntityOfPage: canonical
      ? { '@type': 'WebPage', '@id': canonical }
      : undefined,
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
