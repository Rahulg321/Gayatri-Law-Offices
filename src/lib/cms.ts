import type {
  BlogPostStatus,
  PortfolioProjectStatus,
  PortfolioProjectType,
} from '#/db/schema'
import type { blogPosts, portfolioProjects, practiceAreas } from '#/db/schema'
import {
  portfolioAttachmentSchema,
  portfolioGalleryItemSchema,
  portfolioLinkSchema,
  portfolioProjectStatusSchema,
  portfolioProjectTypeSchema,
  portfolioTestimonialSchema,
  portfolioVideoSchema,
} from '#/lib/cms-schemas'
import type { z } from 'zod'

export type PracticeAreaRow = typeof practiceAreas.$inferSelect
export type BlogPostRow = typeof blogPosts.$inferSelect
export type PortfolioProjectRow = typeof portfolioProjects.$inferSelect

export type { BlogPostStatus, PortfolioProjectStatus, PortfolioProjectType }

export type PortfolioGalleryItem = z.infer<typeof portfolioGalleryItemSchema>
export type PortfolioVideo = z.infer<typeof portfolioVideoSchema>
export type PortfolioLinkItem = z.infer<typeof portfolioLinkSchema>
export type PortfolioAttachment = z.infer<typeof portfolioAttachmentSchema>
export type PortfolioTestimonial = z.infer<typeof portfolioTestimonialSchema>

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

export function stringifyJson(value: unknown): string {
  return JSON.stringify(value)
}

function parseJsonArrayItems<T>(raw: string, itemSchema: z.ZodType<T>): T[] {
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    const out: T[] = []
    for (const item of parsed) {
      const r = itemSchema.safeParse(item)
      if (r.success) out.push(r.data)
    }
    return out
  } catch {
    return []
  }
}

function parsePortfolioStatus(value: string): PortfolioProjectStatus {
  const r = portfolioProjectStatusSchema.safeParse(value)
  return r.success ? r.data : 'completed'
}

function parsePortfolioType(value: string): PortfolioProjectType {
  const r = portfolioProjectTypeSchema.safeParse(value)
  return r.success ? r.data : 'freelance'
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

export type BlogPostAuthor = {
  name: string | null
  imageUrl: string | null
  bio: string | null
}

export type BlogPostSeries = {
  slug: string | null
  title: string | null
}

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  category: string
  categoryParent: string | null
  date: string
  readTime: string
  bodyMarkdown: string
  status: BlogPostStatus
  tags: string[]
  series: BlogPostSeries
  author: BlogPostAuthor
  featuredImageUrl: string | null
  canonicalUrl: string | null
  twitterCard: string
  metaTitle: string | null
  metaDescription: string | null
  ogImageUrl: string | null
  createdAt: Date
  updatedAt: Date
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
  bodyMarkdown: string
  featuredImageUrl: string | null
  startDate: string | null
  endDate: string | null
  ongoing: boolean
  projectStatus: PortfolioProjectStatus
  projectType: PortfolioProjectType
  featured: boolean
  clientName: string | null
  clientUrl: string | null
  challengesMarkdown: string
  teamSize: string | null
  budgetRange: string | null
  skills: string[]
  metrics: string[]
  gallery: PortfolioGalleryItem[]
  videos: PortfolioVideo[]
  links: PortfolioLinkItem[]
  attachments: PortfolioAttachment[]
  testimonials: PortfolioTestimonial[]
  tags: string[]
  scope: string[]
  deliverables: string[]
  outcomes: string[]
  tools: string[]
  published: boolean
  sortOrder: number
  canonicalUrl: string | null
  twitterCard: string
  metaTitle: string | null
  metaDescription: string | null
  ogImageUrl: string | null
}

const DEFAULT_AUTHOR_NAME = 'Gayatri Law Offices'

export function categoryBreadcrumb(category: string, categoryParent: string | null): string {
  if (categoryParent?.trim()) {
    return `${categoryParent.trim()} > ${category}`
  }
  return category
}

export function socialImageUrl(post: Pick<BlogPost, 'featuredImageUrl' | 'ogImageUrl'>): string | null {
  return post.featuredImageUrl?.trim() || post.ogImageUrl?.trim() || null
}

export function portfolioSocialImage(
  project: Pick<PortfolioProject, 'featuredImageUrl' | 'ogImageUrl'>,
): string | null {
  return project.featuredImageUrl?.trim() || project.ogImageUrl?.trim() || null
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
    categoryParent: row.categoryParent,
    date: row.publishedAt,
    readTime: row.readTime,
    bodyMarkdown: row.bodyMarkdown,
    status: row.status as BlogPostStatus,
    tags: parseJsonArray(row.tags),
    series: {
      slug: row.seriesSlug,
      title: row.seriesTitle,
    },
    author: {
      name: row.authorName,
      imageUrl: row.authorImageUrl,
      bio: row.authorBio,
    },
    featuredImageUrl: row.featuredImageUrl,
    canonicalUrl: row.canonicalUrl,
    twitterCard: row.twitterCard,
    metaTitle: row.metaTitle,
    metaDescription: row.metaDescription,
    ogImageUrl: row.ogImageUrl,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}

export function displayAuthorName(author: BlogPostAuthor): string {
  return author.name?.trim() || DEFAULT_AUTHOR_NAME
}

export function mapPortfolioProject(row: PortfolioProjectRow): PortfolioProject {
  const gallery = parseJsonArrayItems(row.galleryJson, portfolioGalleryItemSchema)
    .filter((g) => g.url.trim())
    .sort((a, b) => {
      const ao = typeof a.sortOrder === 'number' ? a.sortOrder : 0
      const bo = typeof b.sortOrder === 'number' ? b.sortOrder : 0
      return ao - bo || a.url.localeCompare(b.url)
    })
  return {
    slug: row.slug,
    title: row.title,
    category: row.category,
    excerpt: row.excerpt,
    year: row.year,
    duration: row.duration,
    role: row.role,
    summary: row.summary,
    bodyMarkdown: row.bodyMarkdown,
    featuredImageUrl: row.featuredImageUrl,
    startDate: row.startDate,
    endDate: row.endDate,
    ongoing: row.ongoing,
    projectStatus: parsePortfolioStatus(row.projectStatus),
    projectType: parsePortfolioType(row.projectType),
    featured: row.featured,
    clientName: row.clientName,
    clientUrl: row.clientUrl,
    challengesMarkdown: row.challengesMarkdown,
    teamSize: row.teamSize,
    budgetRange: row.budgetRange,
    skills: parseJsonArray(row.skills),
    metrics: parseJsonArray(row.metrics),
    gallery,
    videos: parseJsonArrayItems(row.videosJson, portfolioVideoSchema).filter((v) => v.url.trim()),
    links: parseJsonArrayItems(row.linksJson, portfolioLinkSchema).filter(
      (l) => l.title.trim() && l.url.trim(),
    ),
    attachments: parseJsonArrayItems(row.attachmentsJson, portfolioAttachmentSchema).filter(
      (a) => a.fileUrl.trim() && a.filename.trim(),
    ),
    testimonials: parseJsonArrayItems(row.testimonialsJson, portfolioTestimonialSchema).filter(
      (t) => t.quote.trim() && t.clientName.trim(),
    ),
    tags: parseJsonArray(row.tags),
    scope: parseJsonArray(row.scope),
    deliverables: parseJsonArray(row.deliverables),
    outcomes: parseJsonArray(row.outcomes),
    tools: parseJsonArray(row.tools),
    published: row.published,
    sortOrder: row.sortOrder,
    canonicalUrl: row.canonicalUrl,
    twitterCard: row.twitterCard,
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
