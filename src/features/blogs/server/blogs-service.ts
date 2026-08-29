import { and, count, desc, eq, inArray, sql } from 'drizzle-orm'
import { z } from 'zod'
import { blogPosts } from '#/db/schema'
import { getDb } from '#/lib/db'
import { mapBlogPost, normalizeSeo, stringifyJsonArray, type BlogPost } from '#/lib/cms'
import { blogPostSchema } from '#/features/blogs/schemas'
import { blogPosts as staticBlogs } from '#/lib/data'

const DEFAULT_BLOG_MARKDOWN = `Legal process outsourcing continues to evolve rapidly. As law firms face increasing pressure to deliver more value at lower costs, the role of LPO providers has never been more critical.

## Key Trends Shaping the Industry

The LPO landscape is being reshaped by several powerful forces. AI and machine learning tools are augmenting human review capabilities, enabling faster and more accurate document analysis.

## Practical Takeaways

- Start with a clearly defined scope and pilot project
- Prioritize providers with demonstrated expertise in your practice area
- Insist on ISO-certified security practices from day one
- Build regular feedback loops into your engagement
`

type BlogPostInput = z.infer<typeof blogPostSchema>

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

/** Posts visible on the public site (published/scheduled and not future-dated). */
export function blogPostIsPubliclyVisible() {
  return and(
    inArray(blogPosts.status, ['published', 'scheduled']),
    sql`date(${blogPosts.publishedAt}) <= date('now')`,
  )
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

// Admin list (includes unpublished)
export async function listAllBlogPosts() {
  const rows = await getDb().select().from(blogPosts).orderBy(desc(blogPosts.publishedAt))
  return rows.map(mapBlogPost)
}

export async function getBlogPostBySlug(slug: string) {
  const rows = await getDb().select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1)
  return rows[0] ? mapBlogPost(rows[0]) : null
}

export async function saveBlogPost(input: BlogPostInput): Promise<{ ok: boolean }> {
  const payload = normalizeBlogPost(input)
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
}

export async function deleteBlogPost(slug: string): Promise<void> {
  await getDb().delete(blogPosts).where(eq(blogPosts.slug, slug))
}

export async function seedBlogPostsIfEmpty(): Promise<void> {
  const db = getDb()
  const [blogCount] = await db.select({ value: count() }).from(blogPosts)
  if (blogCount.value === 0) {
    await db.insert(blogPosts).values(
      staticBlogs.map((post) => ({
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        category: post.category,
        publishedAt: post.date,
        readTime: post.readTime,
        bodyMarkdown: DEFAULT_BLOG_MARKDOWN,
        status: 'published' as const,
        tags: '[]',
        twitterCard: 'summary_large_image',
        metaTitle: `${post.title} — Gayatri Legal Solutions`,
        metaDescription: post.excerpt,
      })),
    )
  }
}

let seedPromise: Promise<void> | null = null

export async function ensureBlogPostsSeeded() {
  if (!seedPromise) {
    seedPromise = seedBlogPostsIfEmpty()
  }
  await seedPromise
}
