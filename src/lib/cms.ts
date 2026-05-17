import type { blogPosts, portfolioProjects, practiceAreas } from '#/db/schema'

export type PracticeAreaRow = typeof practiceAreas.$inferSelect
export type BlogPostRow = typeof blogPosts.$inferSelect
export type PortfolioProjectRow = typeof portfolioProjects.$inferSelect

export function parseJsonArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value) as unknown
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : []
  } catch {
    return []
  }
}

export function stringifyJsonArray(values: string[]): string {
  return JSON.stringify(values)
}

export type PracticeArea = {
  slug: string
  title: string
  short: string
  description: string
  icon: string
  benefits: string[]
  published: boolean
  sortOrder: number
  metaTitle: string | null
  metaDescription: string | null
  ogImageUrl: string | null
}

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  readTime: string
  bodyMarkdown: string
  published: boolean
  metaTitle: string | null
  metaDescription: string | null
  ogImageUrl: string | null
}

export type PortfolioProject = {
  slug: string
  title: string
  category: string
  excerpt: string
  year: string
  duration: string
  role: string
  summary: string
  scope: string[]
  deliverables: string[]
  outcomes: string[]
  tools: string[]
  published: boolean
  sortOrder: number
  metaTitle: string | null
  metaDescription: string | null
  ogImageUrl: string | null
}

export function mapPracticeArea(row: PracticeAreaRow): PracticeArea {
  return {
    slug: row.slug,
    title: row.title,
    short: row.short,
    description: row.description,
    icon: row.icon,
    benefits: parseJsonArray(row.benefits),
    published: row.published,
    sortOrder: row.sortOrder,
    metaTitle: row.metaTitle,
    metaDescription: row.metaDescription,
    ogImageUrl: row.ogImageUrl,
  }
}

export function mapBlogPost(row: BlogPostRow): BlogPost {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    date: row.publishedAt,
    readTime: row.readTime,
    bodyMarkdown: row.bodyMarkdown,
    published: row.published,
    metaTitle: row.metaTitle,
    metaDescription: row.metaDescription,
    ogImageUrl: row.ogImageUrl,
  }
}

export function mapPortfolioProject(row: PortfolioProjectRow): PortfolioProject {
  return {
    slug: row.slug,
    title: row.title,
    category: row.category,
    excerpt: row.excerpt,
    year: row.year,
    duration: row.duration,
    role: row.role,
    summary: row.summary,
    scope: parseJsonArray(row.scope),
    deliverables: parseJsonArray(row.deliverables),
    outcomes: parseJsonArray(row.outcomes),
    tools: parseJsonArray(row.tools),
    published: row.published,
    sortOrder: row.sortOrder,
    metaTitle: row.metaTitle,
    metaDescription: row.metaDescription,
    ogImageUrl: row.ogImageUrl,
  }
}

export function seoTitle(title: string, metaTitle: string | null | undefined) {
  return metaTitle?.trim() || title
}

export function seoDescription(
  fallback: string,
  metaDescription: string | null | undefined,
) {
  return metaDescription?.trim() || fallback
}
