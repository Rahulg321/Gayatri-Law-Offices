import { createServerFn } from '@tanstack/react-start'
import { eq, sql } from 'drizzle-orm'
import type { z } from 'zod'
import { getDb } from '#/db/index'
import { blogPosts, portfolioProjects, practiceAreas } from '#/db/schema'
import { requireAdminSession } from '#/lib/admin-auth'
import { stringifyJson, stringifyJsonArray } from '#/lib/cms'
import {
  blogPostSchema,
  cmsBlogUploadSchema,
  cmsPortfolioUploadSchema,
  portfolioProjectSchema,
  practiceAreaSchema,
  slugSchema,
} from '#/lib/cms-schemas'
import { uploadCmsFileBuffer } from '#/lib/storage'
import {
  getBlogPostBySlug,
  getPortfolioProjectBySlug,
  getPracticeAreaBySlug,
  listAllBlogPosts,
  listAllPortfolioProjects,
  listAllPracticeAreas,
} from '#/lib/cms-queries.server'
import { seedCmsFromStaticData } from '#/lib/seed.server'

type PracticeAreaInput = z.infer<typeof practiceAreaSchema>
type BlogPostInput = z.infer<typeof blogPostSchema>
type ProjectInput = z.infer<typeof portfolioProjectSchema>

const CMS_IMAGE_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
])

const CMS_UPLOAD_MAX_BYTES = 10 * 1024 * 1024
const CMS_PORTFOLIO_UPLOAD_MAX_BYTES = 50 * 1024 * 1024

const CMS_PORTFOLIO_DOC_MIME = new Set([
  'application/pdf',
  'video/mp4',
  'video/webm',
])

function normalizeSeo<T extends { metaTitle?: string | null; metaDescription?: string | null; ogImageUrl?: string | null }>(
  data: T,
) {
  return {
    ...data,
    metaTitle: data.metaTitle?.trim() || null,
    metaDescription: data.metaDescription?.trim() || null,
    ogImageUrl: data.ogImageUrl?.trim() || null,
  }
}

function normalizePortfolioProject(data: ProjectInput): ProjectInput {
  const seo = normalizeSeo(data)
  const gallery = [...data.gallery]
    .map((g, i) => ({
      url: g.url.trim(),
      alt: g.alt.trim(),
      caption: g.caption?.trim() ? g.caption.trim() : null,
      sortOrder: typeof g.sortOrder === 'number' ? g.sortOrder : i,
    }))
    .filter((g) => g.url.length > 0)
    .map((g, i) => ({ ...g, sortOrder: i }))
  const videos = data.videos
    .map((v) => ({
      kind: v.kind,
      url: v.url.trim(),
      title: v.title?.trim() ? v.title.trim() : null,
    }))
    .filter((v) => v.url.length > 0)
  const links = data.links
    .map((l) => ({
      title: l.title.trim(),
      url: l.url.trim(),
      icon: l.icon?.trim() ? l.icon.trim() : null,
    }))
    .filter((l) => l.title.length > 0 && l.url.length > 0)
  const attachments = data.attachments
    .map((a) => ({
      fileUrl: a.fileUrl.trim(),
      filename: a.filename.trim(),
      fileType: a.fileType?.trim() ? a.fileType.trim() : null,
      sizeBytes: a.sizeBytes ?? null,
    }))
    .filter((a) => a.fileUrl.length > 0 && a.filename.length > 0)
  const testimonials = data.testimonials
    .map((t) => ({
      quote: t.quote.trim(),
      clientName: t.clientName.trim(),
      clientPhotoUrl: t.clientPhotoUrl?.trim() ? t.clientPhotoUrl.trim() : null,
    }))
    .filter((t) => t.quote.length > 0 && t.clientName.length > 0)

  return {
    ...data,
    ...seo,
    featuredImageUrl: data.featuredImageUrl?.trim() || null,
    startDate: data.startDate?.trim() ? data.startDate.trim() : null,
    endDate: data.endDate?.trim() ? data.endDate.trim() : null,
    clientName: data.clientName?.trim() ? data.clientName.trim() : null,
    clientUrl: data.clientUrl?.trim() ? data.clientUrl.trim() : null,
    teamSize: data.teamSize?.trim() ? data.teamSize.trim() : null,
    budgetRange: data.budgetRange?.trim() ? data.budgetRange.trim() : null,
    canonicalUrl: data.canonicalUrl?.trim() ? data.canonicalUrl.trim() : null,
    tags: data.tags.map((t) => t.trim()).filter(Boolean),
    skills: data.skills.map((s) => s.trim()).filter(Boolean),
    metrics: data.metrics.map((m) => m.trim()).filter(Boolean),
    gallery,
    videos,
    links,
    attachments,
    testimonials,
  }
}

function normalizeBlogPost(data: BlogPostInput) {
  return {
    ...data,
    ...normalizeSeo(data),
    categoryParent: data.categoryParent?.trim() || null,
    seriesSlug: data.seriesSlug?.trim() || null,
    seriesTitle: data.seriesTitle?.trim() || null,
    authorName: data.authorName?.trim() || null,
    authorImageUrl: data.authorImageUrl?.trim() || null,
    authorBio: data.authorBio?.trim() || null,
    featuredImageUrl: data.featuredImageUrl?.trim() || null,
    canonicalUrl: data.canonicalUrl?.trim() || null,
    publishedAt: data.publishedAt.trim(),
    tags: data.tags.map((t) => t.trim()).filter(Boolean),
  }
}

export const adminSeedCms = createServerFn({ method: 'POST' }).handler(async () => {
  await requireAdminSession()
  return seedCmsFromStaticData()
})

export const adminListPracticeAreas = createServerFn({ method: 'GET' }).handler(async () => {
  await requireAdminSession()
  return listAllPracticeAreas()
})

export const adminGetPracticeArea = createServerFn({ method: 'GET' })
  .inputValidator((slug: string) => slugSchema.parse(slug))
  .handler(async ({ data: slug }) => {
    await requireAdminSession()
    return getPracticeAreaBySlug(slug)
  })

export const adminSavePracticeArea = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => practiceAreaSchema.parse(input))
  .handler(async ({ data }) => {
    await requireAdminSession()
    const payload = normalizeSeo(data as PracticeAreaInput)
    const db = getDb()
    const existing = await getPracticeAreaBySlug(payload.slug)
    const values = {
      slug: payload.slug,
      title: payload.title,
      short: payload.short,
      description: payload.description,
      icon: payload.icon,
      benefits: stringifyJsonArray(payload.benefits),
      published: payload.published,
      sortOrder: payload.sortOrder,
      metaTitle: payload.metaTitle,
      metaDescription: payload.metaDescription,
      ogImageUrl: payload.ogImageUrl,
      updatedAt: sql`(unixepoch())`,
    }
    if (existing) {
      await db.update(practiceAreas).set(values).where(eq(practiceAreas.slug, payload.slug))
    } else {
      await db.insert(practiceAreas).values(values)
    }
    return { ok: true }
  })

export const adminDeletePracticeArea = createServerFn({ method: 'POST' })
  .inputValidator((slug: string) => slugSchema.parse(slug))
  .handler(async ({ data: slug }) => {
    await requireAdminSession()
    await getDb().delete(practiceAreas).where(eq(practiceAreas.slug, slug))
    return { ok: true }
  })

export const adminListBlogPosts = createServerFn({ method: 'GET' }).handler(async () => {
  await requireAdminSession()
  return listAllBlogPosts()
})

export const adminGetBlogPost = createServerFn({ method: 'GET' })
  .inputValidator((slug: string) => slugSchema.parse(slug))
  .handler(async ({ data: slug }) => {
    await requireAdminSession()
    return getBlogPostBySlug(slug)
  })

export const adminSaveBlogPost = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => blogPostSchema.parse(input))
  .handler(async ({ data }) => {
    await requireAdminSession()
    const payload = normalizeBlogPost(data as BlogPostInput)
    const db = getDb()
    const existing = await getBlogPostBySlug(payload.slug)
    const values = {
      slug: payload.slug,
      title: payload.title,
      excerpt: payload.excerpt,
      category: payload.category,
      categoryParent: payload.categoryParent,
      publishedAt: payload.publishedAt,
      readTime: payload.readTime,
      bodyMarkdown: payload.bodyMarkdown,
      status: payload.status,
      tags: stringifyJsonArray(payload.tags),
      seriesSlug: payload.seriesSlug,
      seriesTitle: payload.seriesTitle,
      authorName: payload.authorName,
      authorImageUrl: payload.authorImageUrl,
      authorBio: payload.authorBio,
      featuredImageUrl: payload.featuredImageUrl,
      canonicalUrl: payload.canonicalUrl,
      twitterCard: payload.twitterCard,
      metaTitle: payload.metaTitle,
      metaDescription: payload.metaDescription,
      ogImageUrl: payload.ogImageUrl,
      updatedAt: sql`(unixepoch())`,
    }
    if (existing) {
      await db.update(blogPosts).set(values).where(eq(blogPosts.slug, payload.slug))
    } else {
      await db.insert(blogPosts).values(values)
    }
    return { ok: true }
  })

export const adminUploadCmsBlogAsset = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => cmsBlogUploadSchema.parse(input))
  .handler(async ({ data }) => {
    await requireAdminSession()
    if (!CMS_IMAGE_MIME.has(data.mimeType)) {
      throw new Error('Only JPEG, PNG, WebP, and GIF images are allowed.')
    }
    const buffer = Buffer.from(data.dataBase64, 'base64')
    if (buffer.byteLength > CMS_UPLOAD_MAX_BYTES) {
      throw new Error('Image must be 10 MB or smaller.')
    }
    const segment = data.postSlug.trim() || 'draft'
    const url = await uploadCmsFileBuffer(
      buffer,
      'blog',
      segment,
      data.fileName,
      data.mimeType,
    )
    if (!url) {
      throw new Error('Upload failed. Check R2 binding and R2_PUBLIC_BASE_URL.')
    }
    return { url }
  })

export const adminUploadCmsPortfolioAsset = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => cmsPortfolioUploadSchema.parse(input))
  .handler(async ({ data }) => {
    await requireAdminSession()
    const isImage = CMS_IMAGE_MIME.has(data.mimeType)
    const isDoc = CMS_PORTFOLIO_DOC_MIME.has(data.mimeType)
    if (!isImage && !isDoc) {
      throw new Error('Allowed types: JPEG, PNG, WebP, GIF, PDF, MP4, WebM.')
    }
    const buffer = Buffer.from(data.dataBase64, 'base64')
    const maxBytes = isImage ? CMS_UPLOAD_MAX_BYTES : CMS_PORTFOLIO_UPLOAD_MAX_BYTES
    if (buffer.byteLength > maxBytes) {
      throw new Error(
        isImage
          ? 'Image must be 10 MB or smaller.'
          : 'File must be 50 MB or smaller.',
      )
    }
    const segment = data.projectSlug.trim() || 'draft'
    const url = await uploadCmsFileBuffer(
      buffer,
      'portfolio',
      segment,
      data.fileName,
      data.mimeType,
    )
    if (!url) {
      throw new Error('Upload failed. Check R2 binding and R2_PUBLIC_BASE_URL.')
    }
    return { url }
  })

export const adminDeleteBlogPost = createServerFn({ method: 'POST' })
  .inputValidator((slug: string) => slugSchema.parse(slug))
  .handler(async ({ data: slug }) => {
    await requireAdminSession()
    await getDb().delete(blogPosts).where(eq(blogPosts.slug, slug))
    return { ok: true }
  })

export const adminListProjects = createServerFn({ method: 'GET' }).handler(async () => {
  await requireAdminSession()
  return listAllPortfolioProjects()
})

export const adminGetProject = createServerFn({ method: 'GET' })
  .inputValidator((slug: string) => slugSchema.parse(slug))
  .handler(async ({ data: slug }) => {
    await requireAdminSession()
    return getPortfolioProjectBySlug(slug)
  })

export const adminSaveProject = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => portfolioProjectSchema.parse(input))
  .handler(async ({ data }) => {
    await requireAdminSession()
    const payload = normalizePortfolioProject(data as ProjectInput)
    const db = getDb()
    const existing = await getPortfolioProjectBySlug(payload.slug)
    const values = {
      slug: payload.slug,
      title: payload.title,
      category: payload.category,
      excerpt: payload.excerpt,
      year: payload.year,
      duration: payload.duration,
      role: payload.role,
      summary: payload.summary,
      bodyMarkdown: payload.bodyMarkdown,
      featuredImageUrl: payload.featuredImageUrl,
      startDate: payload.startDate,
      endDate: payload.endDate,
      ongoing: payload.ongoing,
      projectStatus: payload.projectStatus,
      projectType: payload.projectType,
      featured: payload.featured,
      clientName: payload.clientName,
      clientUrl: payload.clientUrl,
      challengesMarkdown: payload.challengesMarkdown,
      teamSize: payload.teamSize,
      budgetRange: payload.budgetRange,
      skills: stringifyJsonArray(payload.skills),
      metrics: stringifyJsonArray(payload.metrics),
      galleryJson: stringifyJson(payload.gallery),
      videosJson: stringifyJson(payload.videos),
      linksJson: stringifyJson(payload.links),
      attachmentsJson: stringifyJson(payload.attachments),
      testimonialsJson: stringifyJson(payload.testimonials),
      tags: stringifyJsonArray(payload.tags),
      scope: stringifyJsonArray(payload.scope),
      deliverables: stringifyJsonArray(payload.deliverables),
      outcomes: stringifyJsonArray(payload.outcomes),
      tools: stringifyJsonArray(payload.tools),
      published: payload.published,
      sortOrder: payload.sortOrder,
      canonicalUrl: payload.canonicalUrl,
      twitterCard: payload.twitterCard,
      metaTitle: payload.metaTitle,
      metaDescription: payload.metaDescription,
      ogImageUrl: payload.ogImageUrl,
      updatedAt: sql`(unixepoch())`,
    }
    if (existing) {
      await db.update(portfolioProjects).set(values).where(eq(portfolioProjects.slug, payload.slug))
    } else {
      await db.insert(portfolioProjects).values(values)
    }
    return { ok: true }
  })

export const adminDeleteProject = createServerFn({ method: 'POST' })
  .inputValidator((slug: string) => slugSchema.parse(slug))
  .handler(async ({ data: slug }) => {
    await requireAdminSession()
    await getDb().delete(portfolioProjects).where(eq(portfolioProjects.slug, slug))
    return { ok: true }
  })
