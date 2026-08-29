import { and, asc, count, desc, eq, sql } from 'drizzle-orm'
import { z } from 'zod'
import { portfolioProjects } from '#/db/schema'
import { getDb } from '#/lib/db'
import {
  computeReordered,
  mapPortfolioProject,
  normalizeSeo,
  stringifyJson,
  stringifyJsonArray,
  type PortfolioProject,
} from '#/lib/cms'
import { portfolioProjectSchema } from '#/features/projects/schemas'
import { portfolioProjects as staticProjects } from '#/lib/data'

type ProjectInput = z.infer<typeof portfolioProjectSchema>

function normalizePortfolioProject(data: ProjectInput): ProjectInput {
  const seo = normalizeSeo(data)
  const gallery = [...data.gallery]
    .map((g, i) => ({
      url: g.url.trim(),
      alt: g.alt.trim(),
      caption: g.caption?.trim() ? g.caption.trim() : undefined,
      sortOrder: typeof g.sortOrder === 'number' ? g.sortOrder : i,
    }))
    .filter((g) => g.url.length > 0)
    .map((g, i) => ({ ...g, sortOrder: i }))
  const videos = data.videos
    .map((v) => ({
      kind: v.kind,
      url: v.url.trim(),
      title: v.title?.trim() ? v.title.trim() : undefined,
    }))
    .filter((v) => v.url.length > 0)
  const links = data.links
    .map((l) => ({
      title: l.title.trim(),
      url: l.url.trim(),
      icon: l.icon?.trim() ? l.icon.trim() : undefined,
    }))
    .filter((l) => l.title.length > 0 && l.url.length > 0)
  const attachments = data.attachments
    .map((a) => ({
      fileUrl: a.fileUrl.trim(),
      filename: a.filename.trim(),
      fileType: a.fileType?.trim() ? a.fileType.trim() : undefined,
      sizeBytes: a.sizeBytes ?? null,
    }))
    .filter((a) => a.fileUrl.length > 0 && a.filename.length > 0)
  const testimonials = data.testimonials
    .map((t) => ({
      quote: t.quote.trim(),
      clientName: t.clientName?.trim() || undefined,
      clientDesignation: t.clientDesignation?.trim() || undefined,
      clientPhotoUrl: t.clientPhotoUrl?.trim() || undefined,
    }))
    .filter((t) => t.quote.length > 0)

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

export async function listPublishedPortfolioProjects(): Promise<PortfolioProject[]> {
  const rows = await getDb()
    .select()
    .from(portfolioProjects)
    .where(eq(portfolioProjects.published, true))
    .orderBy(
      asc(portfolioProjects.sortOrder),
      desc(portfolioProjects.featured),
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
export async function listAllPortfolioProjects() {
  const rows = await getDb()
    .select()
    .from(portfolioProjects)
    .orderBy(asc(portfolioProjects.sortOrder), asc(portfolioProjects.title))
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

export async function saveProject(input: ProjectInput): Promise<{ ok: boolean }> {
  const payload = normalizePortfolioProject(input)
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
}

export async function deleteProject(slug: string): Promise<void> {
  await getDb().delete(portfolioProjects).where(eq(portfolioProjects.slug, slug))
}

export async function moveProject(
  slug: string,
  direction: 'up' | 'down',
): Promise<{ ok: boolean }> {
  const list = await listAllPortfolioProjects()
  const reordered = computeReordered(list, slug, direction)
  if (!reordered) return { ok: false }
  const db = getDb()
  for (const [i, item] of reordered.entries()) {
    if (item.sortOrder !== i) {
      await db
        .update(portfolioProjects)
        .set({ sortOrder: i, updatedAt: sql`(unixepoch())` })
        .where(eq(portfolioProjects.slug, item.slug))
    }
  }
  return { ok: true }
}

export async function seedPortfolioProjectsIfEmpty(): Promise<void> {
  const db = getDb()
  const [projectCount] = await db.select({ value: count() }).from(portfolioProjects)
  if (projectCount.value === 0) {
    await db.insert(portfolioProjects).values(
      staticProjects.map((project, i) => ({
        slug: project.slug,
        title: project.title,
        category: project.category,
        excerpt: project.excerpt,
        year: project.year,
        duration: project.duration,
        role: project.role,
        summary: project.summary,
        bodyMarkdown: '',
        ongoing: false,
        projectStatus: 'completed',
        projectType: 'agency',
        featured: false,
        skills: stringifyJsonArray([]),
        metrics: stringifyJsonArray([]),
        galleryJson: stringifyJson([]),
        videosJson: stringifyJson([]),
        linksJson: stringifyJson([]),
        attachmentsJson: stringifyJson([]),
        testimonialsJson: stringifyJson([]),
        challengesMarkdown: '',
        tags: stringifyJsonArray([]),
        scope: stringifyJsonArray([...project.scope]),
        deliverables: stringifyJsonArray([...project.deliverables]),
        outcomes: stringifyJsonArray([...project.outcomes]),
        tools: stringifyJsonArray([...project.tools]),
        published: true,
        sortOrder: i,
        twitterCard: 'summary_large_image',
        metaTitle: `${project.title} — Projects | Gayatri Legal Solutions`,
        metaDescription: project.excerpt,
      })),
    )
  }
}

let seedPromise: Promise<void> | null = null

export async function ensurePortfolioProjectsSeeded() {
  if (!seedPromise) {
    seedPromise = seedPortfolioProjectsIfEmpty()
  }
  await seedPromise
}
