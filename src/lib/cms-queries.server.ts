import { and, asc, count, desc, eq, inArray, sql } from 'drizzle-orm'
import { getDb } from '#/db/index'
import { blogPosts, portfolioProjects, practiceAreas } from '#/db/schema'
import {
  mapBlogPost,
  mapPortfolioProject,
  mapPracticeArea,
  type BlogPost,
  type PortfolioProject,
  type PracticeArea,
} from '#/lib/cms'
import { seedCmsFromStaticData } from '#/lib/seed.server'

let seedPromise: Promise<void> | null = null

export async function ensureCmsSeeded() {
  if (!seedPromise) {
    seedPromise = (async () => {
      const db = getDb()
      const [row] = await db.select({ value: count() }).from(practiceAreas)
      if (row.value === 0) await seedCmsFromStaticData()
    })()
  }
  await seedPromise
}

/** Posts visible on the public site (published/scheduled and not future-dated). */
export function blogPostIsPubliclyVisible() {
  return and(
    inArray(blogPosts.status, ['published', 'scheduled']),
    sql`date(${blogPosts.publishedAt}) <= date('now')`,
  )
}

export async function listPublishedPracticeAreas(): Promise<PracticeArea[]> {
  const rows = await getDb()
    .select()
    .from(practiceAreas)
    .where(eq(practiceAreas.published, true))
    .orderBy(asc(practiceAreas.sortOrder), asc(practiceAreas.title))
  return rows.map(mapPracticeArea)
}

export async function getPublishedPracticeAreaBySlug(
  slug: string,
): Promise<PracticeArea | null> {
  const rows = await getDb()
    .select()
    .from(practiceAreas)
    .where(eq(practiceAreas.slug, slug))
    .limit(1)
  const row = rows[0]
  if (!row || !row.published) return null
  return mapPracticeArea(row)
}

export async function listPublishedBlogPosts(): Promise<BlogPost[]> {
  const rows = await getDb()
    .select()
    .from(blogPosts)
    .where(blogPostIsPubliclyVisible())
    .orderBy(desc(blogPosts.publishedAt))
  return rows.map(mapBlogPost)
}

export async function getPublishedBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const rows = await getDb()
    .select()
    .from(blogPosts)
    .where(and(eq(blogPosts.slug, slug), blogPostIsPubliclyVisible()))
    .limit(1)
  const row = rows[0]
  if (!row) return null
  return mapBlogPost(row)
}

export async function listPublishedPortfolioProjects(): Promise<PortfolioProject[]> {
  const rows = await getDb()
    .select()
    .from(portfolioProjects)
    .where(eq(portfolioProjects.published, true))
    .orderBy(
      desc(portfolioProjects.featured),
      asc(portfolioProjects.sortOrder),
      desc(portfolioProjects.year),
    )
  return rows.map(mapPortfolioProject)
}

export async function listFeaturedPublishedPortfolioProjects(
  limit = 6,
): Promise<PortfolioProject[]> {
  const rows = await getDb()
    .select()
    .from(portfolioProjects)
    .where(and(eq(portfolioProjects.published, true), eq(portfolioProjects.featured, true)))
    .orderBy(asc(portfolioProjects.sortOrder), desc(portfolioProjects.year))
    .limit(limit)
  return rows.map(mapPortfolioProject)
}

export async function getPublishedPortfolioProjectBySlug(
  slug: string,
): Promise<PortfolioProject | null> {
  const rows = await getDb()
    .select()
    .from(portfolioProjects)
    .where(eq(portfolioProjects.slug, slug))
    .limit(1)
  const row = rows[0]
  if (!row || !row.published) return null
  return mapPortfolioProject(row)
}

// Admin list (includes unpublished)
export async function listAllPracticeAreas() {
  const rows = await getDb()
    .select()
    .from(practiceAreas)
    .orderBy(asc(practiceAreas.sortOrder), asc(practiceAreas.title))
  return rows.map(mapPracticeArea)
}

export async function getPracticeAreaBySlug(slug: string) {
  const rows = await getDb()
    .select()
    .from(practiceAreas)
    .where(eq(practiceAreas.slug, slug))
    .limit(1)
  return rows[0] ? mapPracticeArea(rows[0]) : null
}

export async function listAllBlogPosts() {
  const rows = await getDb().select().from(blogPosts).orderBy(desc(blogPosts.publishedAt))
  return rows.map(mapBlogPost)
}

export async function getBlogPostBySlug(slug: string) {
  const rows = await getDb().select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1)
  return rows[0] ? mapBlogPost(rows[0]) : null
}

export async function listAllPortfolioProjects() {
  const rows = await getDb()
    .select()
    .from(portfolioProjects)
    .orderBy(
      desc(portfolioProjects.featured),
      asc(portfolioProjects.sortOrder),
      desc(portfolioProjects.year),
    )
  return rows.map(mapPortfolioProject)
}

export async function getPortfolioProjectBySlug(slug: string) {
  const rows = await getDb()
    .select()
    .from(portfolioProjects)
    .where(eq(portfolioProjects.slug, slug))
    .limit(1)
  return rows[0] ? mapPortfolioProject(rows[0]) : null
}
