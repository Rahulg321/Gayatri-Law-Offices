import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const blogPostStatuses = [
  'draft',
  'published',
  'scheduled',
  'private',
  'archived',
] as const

export type BlogPostStatus = (typeof blogPostStatuses)[number]

export const blogPosts = sqliteTable('blog_posts', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  excerpt: text('excerpt').notNull(),
  category: text('category').notNull(),
  categoryParent: text('category_parent'),
  publishedAt: text('published_at').notNull(),
  readTime: text('read_time').notNull().default('5 min read'),
  bodyMarkdown: text('body_markdown').notNull().default(''),
  status: text('status').notNull().default('published'),
  tags: text('tags').notNull().default('[]'),
  seriesSlug: text('series_slug'),
  seriesTitle: text('series_title'),
  authorName: text('author_name'),
  authorImageUrl: text('author_image_url'),
  authorBio: text('author_bio'),
  featuredImageUrl: text('featured_image_url'),
  canonicalUrl: text('canonical_url'),
  twitterCard: text('twitter_card').notNull().default('summary_large_image'),
  metaTitle: text('meta_title'),
  metaDescription: text('meta_description'),
  ogImageUrl: text('og_image_url'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
})
