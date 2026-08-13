import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

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
