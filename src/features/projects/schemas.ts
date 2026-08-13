import { z } from 'zod'
import {
  adminSeoFormFields,
  portfolioAttachmentSchema,
  portfolioGalleryItemSchema,
  portfolioLinkSchema,
  portfolioProjectStatusSchema,
  portfolioProjectTypeSchema,
  portfolioTestimonialSchema,
  portfolioVideoSchema,
  seoSchema,
  slugSchema,
} from '#/lib/cms-schemas'

const portfolioJsonFieldsSchema = z.object({
  skills: z.array(z.string()),
  metrics: z.array(z.string()),
  gallery: z.array(portfolioGalleryItemSchema),
  videos: z.array(portfolioVideoSchema),
  links: z.array(portfolioLinkSchema),
  attachments: z.array(portfolioAttachmentSchema),
  testimonials: z.array(portfolioTestimonialSchema),
})

export const portfolioProjectSchema = z
  .object({
    slug: slugSchema,
    title: z.string().min(1).max(200),
    category: z.string().min(1).max(100),
    excerpt: z.string().min(1).max(1200),
    year: z.string().min(1).max(10),
    duration: z.string().min(1).max(100),
    role: z.string().min(1).max(200),
    summary: z.string(),
    bodyMarkdown: z.string(),
    featuredImageUrl: z.string().max(2000).optional().nullable(),
    startDate: z.string().max(40).optional().nullable(),
    endDate: z.string().max(40).optional().nullable(),
    ongoing: z.boolean(),
    projectStatus: portfolioProjectStatusSchema,
    projectType: portfolioProjectTypeSchema,
    featured: z.boolean(),
    clientName: z.string().max(200).optional().nullable(),
    clientUrl: z.string().max(2000).optional().nullable(),
    challengesMarkdown: z.string(),
    teamSize: z.string().max(120).optional().nullable(),
    budgetRange: z.string().max(120).optional().nullable(),
    canonicalUrl: z.string().max(2000).optional().nullable(),
    twitterCard: z.enum(['summary_large_image', 'summary']),
    tags: z.array(z.string()),
    scope: z.array(z.string().min(1)),
    deliverables: z.array(z.string().min(1)),
    outcomes: z.array(z.string().min(1)),
    tools: z.array(z.string().min(1)),
    published: z.boolean(),
    sortOrder: z.number().int().min(0),
  })
  .merge(portfolioJsonFieldsSchema)
  .merge(seoSchema)

export const adminPortfolioProjectFormSchema = z
  .object({
    slug: slugSchema,
    title: z.string().min(1).max(200),
    category: z.string().min(1).max(100),
    excerpt: z.string().min(1).max(1200),
    year: z.string().min(1).max(10),
    duration: z.string().min(1).max(100),
    role: z.string().min(1).max(200),
    summary: z.string(),
    bodyMarkdown: z.string(),
    featuredImageUrl: z.string().max(2000),
    startDate: z.string().max(40),
    endDate: z.string().max(40),
    ongoing: z.boolean(),
    projectStatus: portfolioProjectStatusSchema,
    projectType: portfolioProjectTypeSchema,
    featured: z.boolean(),
    clientName: z.string().max(200),
    clientUrl: z.string().max(2000),
    challengesMarkdown: z.string(),
    teamSize: z.string().max(120),
    budgetRange: z.string().max(120),
    skills: z.array(z.string()),
    metrics: z.array(z.string()),
    gallery: z.array(portfolioGalleryItemSchema),
    videos: z.array(portfolioVideoSchema),
    links: z.array(portfolioLinkSchema),
    attachments: z.array(portfolioAttachmentSchema),
    testimonials: z.array(portfolioTestimonialSchema),
    tags: z.array(z.string()),
    scope: z.array(z.string()),
    deliverables: z.array(z.string()),
    outcomes: z.array(z.string()),
    tools: z.array(z.string()),
    published: z.boolean(),
    sortOrder: z.number().int().min(0),
    ...adminSeoFormFields,
  })
  .superRefine((data, ctx) => {
    data.testimonials.forEach((t, i) => {
      const hasAny = Boolean(t.quote.trim() || t.clientName.trim() || t.clientPhotoUrl?.trim())
      if (!hasAny) return
      if (!t.quote.trim()) {
        ctx.addIssue({
          code: 'custom',
          message: 'Testimonial quote is required.',
          path: ['testimonials', i, 'quote'],
        })
      }
      if (!t.clientName.trim()) {
        ctx.addIssue({
          code: 'custom',
          message: 'Testimonial client name is required.',
          path: ['testimonials', i, 'clientName'],
        })
      }
    })
  })
