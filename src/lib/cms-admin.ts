import { createServerFn } from '@tanstack/react-start'
import { eq, sql } from 'drizzle-orm'
import type { z } from 'zod'
import { getDb } from '#/db/index'
import { blogPosts, portfolioProjects, practiceAreas } from '#/db/schema'
import { requireAdminSession } from '#/lib/admin-auth'
import { stringifyJsonArray } from '#/lib/cms'
import {
  blogPostSchema,
  portfolioProjectSchema,
  practiceAreaSchema,
  slugSchema,
} from '#/lib/cms-schemas'
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
    const payload = normalizeSeo(data as BlogPostInput)
    const db = getDb()
    const existing = await getBlogPostBySlug(payload.slug)
    const values = {
      slug: payload.slug,
      title: payload.title,
      excerpt: payload.excerpt,
      category: payload.category,
      publishedAt: payload.publishedAt,
      readTime: payload.readTime,
      bodyMarkdown: payload.bodyMarkdown,
      published: payload.published,
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
    const payload = normalizeSeo(data as ProjectInput)
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
      scope: stringifyJsonArray(payload.scope),
      deliverables: stringifyJsonArray(payload.deliverables),
      outcomes: stringifyJsonArray(payload.outcomes),
      tools: stringifyJsonArray(payload.tools),
      published: payload.published,
      sortOrder: payload.sortOrder,
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
