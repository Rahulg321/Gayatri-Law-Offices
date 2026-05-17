import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const todos = sqliteTable('todos', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
})

// Better Auth tables
export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('email_verified', { mode: 'boolean' }).notNull().default(false),
  image: text('image'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
})

export const session = sqliteTable('session', {
  id: text('id').primaryKey(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  token: text('token').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = sqliteTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: integer('access_token_expires_at', { mode: 'timestamp' }),
  refreshTokenExpiresAt: integer('refresh_token_expires_at', { mode: 'timestamp' }),
  scope: text('scope'),
  password: text('password'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
})

export const verification = sqliteTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
})

// CMS content tables
export const practiceAreas = sqliteTable('practice_areas', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  short: text('short').notNull(),
  description: text('description').notNull(),
  icon: text('icon').notNull().default('📄'),
  benefits: text('benefits').notNull().default('[]'),
  published: integer('published', { mode: 'boolean' }).notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  metaTitle: text('meta_title'),
  metaDescription: text('meta_description'),
  ogImageUrl: text('og_image_url'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
})

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

export const portfolioProjectStatuses = [
  'completed',
  'in_progress',
  'maintenance',
  'archived',
] as const

export type PortfolioProjectStatus = (typeof portfolioProjectStatuses)[number]

export const portfolioProjectTypes = [
  'freelance',
  'personal',
  'agency',
  'open_source',
] as const

export type PortfolioProjectType = (typeof portfolioProjectTypes)[number]

export const portfolioProjects = sqliteTable('portfolio_projects', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  category: text('category').notNull(),
  excerpt: text('excerpt').notNull(),
  year: text('year').notNull(),
  duration: text('duration').notNull(),
  role: text('role').notNull(),
  summary: text('summary').notNull(),
  bodyMarkdown: text('body_markdown').notNull().default(''),
  featuredImageUrl: text('featured_image_url'),
  startDate: text('start_date'),
  endDate: text('end_date'),
  ongoing: integer('ongoing', { mode: 'boolean' }).notNull().default(false),
  projectStatus: text('project_status').notNull().default('completed'),
  projectType: text('project_type').notNull().default('freelance'),
  featured: integer('featured', { mode: 'boolean' }).notNull().default(false),
  clientName: text('client_name'),
  clientUrl: text('client_url'),
  skills: text('skills').notNull().default('[]'),
  metrics: text('metrics').notNull().default('[]'),
  galleryJson: text('gallery_json').notNull().default('[]'),
  videosJson: text('videos_json').notNull().default('[]'),
  linksJson: text('links_json').notNull().default('[]'),
  attachmentsJson: text('attachments_json').notNull().default('[]'),
  testimonialsJson: text('testimonials_json').notNull().default('[]'),
  challengesMarkdown: text('challenges_markdown').notNull().default(''),
  teamSize: text('team_size'),
  budgetRange: text('budget_range'),
  tags: text('tags').notNull().default('[]'),
  scope: text('scope').notNull().default('[]'),
  deliverables: text('deliverables').notNull().default('[]'),
  outcomes: text('outcomes').notNull().default('[]'),
  tools: text('tools').notNull().default('[]'),
  published: integer('published', { mode: 'boolean' }).notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  canonicalUrl: text('canonical_url'),
  twitterCard: text('twitter_card').notNull().default('summary_large_image'),
  metaTitle: text('meta_title'),
  metaDescription: text('meta_description'),
  ogImageUrl: text('og_image_url'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
})

export const authSchema = {
  user,
  session,
  account,
  verification,
}
