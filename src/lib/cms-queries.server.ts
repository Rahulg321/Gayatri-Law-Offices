import { asc, count, desc, eq } from 'drizzle-orm'
import { getDb } from '#/db/index'
import { blogPosts, portfolioProjects, practiceAreas } from '#/db/schema'
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
import {
  mapBlogPost,
  mapPortfolioProject,
  mapPracticeArea,
  type BlogPost,
  type PortfolioProject,
  type PracticeArea,
} from '#/lib/cms'

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
    .where(eq(blogPosts.published, true))
    .orderBy(desc(blogPosts.publishedAt))
  return rows.map(mapBlogPost)
}

export async function getPublishedBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const rows = await getDb().select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1)
  const row = rows[0]
  if (!row || !row.published) return null
  return mapBlogPost(row)
}

export async function listPublishedPortfolioProjects(): Promise<PortfolioProject[]> {
  const rows = await getDb()
    .select()
    .from(portfolioProjects)
    .where(eq(portfolioProjects.published, true))
    .orderBy(desc(portfolioProjects.year), asc(portfolioProjects.sortOrder))
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
    .orderBy(desc(portfolioProjects.year), asc(portfolioProjects.sortOrder))
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
