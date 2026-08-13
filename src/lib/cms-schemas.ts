import { z } from 'zod'
import {
  portfolioProjectStatuses,
  portfolioProjectTypes,
} from '#/db/schema'

export const slugSchema = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase letters, numbers, and hyphens')

export const seoSchema = z.object({
  metaTitle: z.string().max(200).optional().nullable(),
  metaDescription: z.string().max(500).optional().nullable(),
  ogImageUrl: z.string().max(2000).optional().nullable(),
})

export const twitterCardSchema = z.enum(['summary_large_image', 'summary'])

export const portfolioProjectStatusSchema = z.enum(portfolioProjectStatuses)

export const portfolioProjectTypeSchema = z.enum(portfolioProjectTypes)

export const portfolioGalleryItemSchema = z.object({
  url: z.string().max(2000),
  alt: z.string().max(300),
  caption: z.string().max(500).optional(),
  sortOrder: z.number().int().min(0).optional(),
})

export const portfolioVideoSchema = z.object({
  kind: z.enum(['youtube', 'vimeo', 'file']),
  url: z.string().max(2000),
  title: z.string().max(200).optional(),
})

export const portfolioLinkSchema = z.object({
  title: z.string().max(200),
  url: z.string().max(2000),
  icon: z.string().max(100).optional(),
})

export const portfolioAttachmentSchema = z.object({
  fileUrl: z.string().max(2000),
  filename: z.string().max(255),
  fileType: z.string().max(120).optional(),
  sizeBytes: z.number().int().min(0).optional().nullable(),
})

export const portfolioTestimonialSchema = z.object({
  quote: z.string().max(5000),
  clientName: z.string().max(200),
  clientPhotoUrl: z.string().max(2000).optional().nullable(),
})

/** Admin UI shape: SEO strings (often empty); list fields may include blank rows until save. */
export const adminSeoFormFields = {
  metaTitle: z.string().max(200),
  metaDescription: z.string().max(500),
  ogImageUrl: z.string().max(2000),
  canonicalUrl: z.string().max(2000),
  twitterCard: twitterCardSchema,
} as const

export const cmsBlogUploadSchema = z.object({
  postSlug: z.string().max(120),
  fileName: z.string().min(1).max(255),
  mimeType: z.string().min(1).max(100),
  dataBase64: z.string().min(1),
})

export const cmsPortfolioUploadSchema = z.object({
  projectSlug: z.string().max(120),
  fileName: z.string().min(1).max(255),
  mimeType: z.string().min(1).max(100),
  dataBase64: z.string().min(1),
})

export const moveDirectionSchema = z.object({
  slug: slugSchema,
  direction: z.enum(['up', 'down']),
})
