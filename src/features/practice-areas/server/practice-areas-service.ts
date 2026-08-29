import { asc, count, eq, sql } from 'drizzle-orm'
import { z } from 'zod'
import { practiceAreas } from '#/db/schema'
import { getDb } from '#/lib/db'
import {
  computeReordered,
  mapPracticeArea,
  normalizeSeo,
  stringifyJsonArray,
  type PracticeArea,
} from '#/lib/cms'
import { practiceAreaSchema } from '#/features/practice-areas/schemas'
import { services } from '#/lib/data'

type PracticeAreaInput = z.infer<typeof practiceAreaSchema>

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

export async function savePracticeArea(input: PracticeAreaInput): Promise<{ ok: boolean }> {
  const payload = normalizeSeo(input)
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
}

export async function deletePracticeArea(slug: string): Promise<void> {
  await getDb().delete(practiceAreas).where(eq(practiceAreas.slug, slug))
}

export async function movePracticeArea(
  slug: string,
  direction: 'up' | 'down',
): Promise<{ ok: boolean }> {
  const list = await listAllPracticeAreas()
  const reordered = computeReordered(list, slug, direction)
  if (!reordered) return { ok: false }
  const db = getDb()
  for (const [i, item] of reordered.entries()) {
    if (item.sortOrder !== i) {
      await db
        .update(practiceAreas)
        .set({ sortOrder: i, updatedAt: sql`(unixepoch())` })
        .where(eq(practiceAreas.slug, item.slug))
    }
  }
  return { ok: true }
}

export async function seedPracticeAreasIfEmpty(): Promise<void> {
  const db = getDb()
  const [paCount] = await db.select({ value: count() }).from(practiceAreas)
  if (paCount.value === 0) {
    await db.insert(practiceAreas).values(
      services.map((svc, i) => ({
        slug: svc.slug,
        title: svc.title,
        short: svc.short,
        description: svc.description,
        icon: svc.icon,
        benefits: stringifyJsonArray([...svc.benefits]),
        published: true,
        sortOrder: i,
        metaTitle: `${svc.title} — LPO Services | Gayatri Legal Solutions`,
        metaDescription: svc.short,
      })),
    )
  }
}

let seedPromise: Promise<void> | null = null

export async function ensurePracticeAreasSeeded() {
  if (!seedPromise) {
    seedPromise = seedPracticeAreasIfEmpty()
  }
  await seedPromise
}
