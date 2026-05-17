import { z } from 'zod'
import {
  blogPostStatuses,
  portfolioProjectStatuses,
  portfolioProjectTypes,
} from '#/db/schema'

export const slugSchema = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase letters, numbers, and hyphens')

const seoSchema = z.object({
  metaTitle: z.string().max(200).optional().nullable(),
  metaDescription: z.string().max(500).optional().nullable(),
  ogImageUrl: z.string().max(2000).optional().nullable(),
})

export const blogPostStatusSchema = z.enum(blogPostStatuses)

export const twitterCardSchema = z.enum(['summary_large_image', 'summary'])

const blogCoreSchema = z.object({
  slug: slugSchema,
  title: z.string().min(1).max(200),
  excerpt: z.string().min(1).max(1000),
  category: z.string().min(1).max(100),
  categoryParent: z.string().max(100).optional().nullable(),
  publishedAt: z.string().min(1).max(40),
  readTime: z.string().min(1).max(50),
  bodyMarkdown: z.string(),
  status: blogPostStatusSchema,
  tags: z.array(z.string().min(1)),
  seriesSlug: z.string().max(120).optional().nullable(),
  seriesTitle: z.string().max(200).optional().nullable(),
  authorName: z.string().max(200).optional().nullable(),
  authorImageUrl: z.string().max(2000).optional().nullable(),
  authorBio: z.string().max(2000).optional().nullable(),
  featuredImageUrl: z.string().max(2000).optional().nullable(),
  canonicalUrl: z.string().max(2000).optional().nullable(),
  twitterCard: twitterCardSchema,
})

export const practiceAreaSchema = z
  .object({
    slug: slugSchema,
    title: z.string().min(1).max(200),
    short: z.string().min(1).max(500),
    description: z.string().min(1),
    icon: z.string().max(20).default('📄'),
    benefits: z.array(z.string().min(1)),
    published: z.boolean(),
    sortOrder: z.number().int().min(0),
  })
  .merge(seoSchema)

export const blogPostSchema = blogCoreSchema.merge(seoSchema).superRefine((data, ctx) => {
  if (data.status === 'scheduled' && !data.publishedAt.trim()) {
    ctx.addIssue({
      code: 'custom',
      message: 'Scheduled posts need a publish date.',
      path: ['publishedAt'],
    })
  }
})

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
  clientPhotoUrl: z.string().max(2000).optional(),
})

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
    summary: z.string().min(1),
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
    twitterCard: twitterCardSchema,
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

/** Admin UI shape: SEO strings (often empty); list fields may include blank rows until save. */
const adminSeoFormFields = {
  metaTitle: z.string().max(200),
  metaDescription: z.string().max(500),
  ogImageUrl: z.string().max(2000),
  canonicalUrl: z.string().max(2000),
  twitterCard: twitterCardSchema,
} as const

export const adminBlogFormSchema = z
  .object({
    slug: slugSchema,
    title: z.string().min(1).max(200),
    excerpt: z.string().min(1).max(1000),
    category: z.string().min(1).max(100),
    categoryParent: z.string().max(100),
    publishedAt: z.string().min(1).max(40),
    readTime: z.string().min(1).max(50),
    bodyMarkdown: z.string(),
    status: blogPostStatusSchema,
    tags: z.array(z.string()),
    seriesSlug: z.string().max(120),
    seriesTitle: z.string().max(200),
    authorName: z.string().max(200),
    authorImageUrl: z.string().max(2000),
    authorBio: z.string().max(2000),
    featuredImageUrl: z.string().max(2000),
    ...adminSeoFormFields,
  })
  .superRefine((data, ctx) => {
    if (data.status === 'scheduled' && !data.publishedAt.trim()) {
      ctx.addIssue({
        code: 'custom',
        message: 'Scheduled posts need a publish date.',
        path: ['publishedAt'],
      })
    }
  })

export const adminPracticeAreaFormSchema = z
  .object({
    slug: slugSchema,
    title: z.string().min(1).max(200),
    short: z.string().min(1).max(500),
    description: z.string().min(1),
    icon: z.string().max(20),
    benefits: z.array(z.string()),
    published: z.boolean(),
    sortOrder: z.number().int().min(0),
    metaTitle: z.string().max(200),
    metaDescription: z.string().max(500),
    ogImageUrl: z.string().max(2000),
  })
  .superRefine((data, ctx) => {
    const filtered = data.benefits.map((s) => s.trim()).filter(Boolean)
    if (filtered.length === 0) {
      ctx.addIssue({
        code: 'custom',
        message: 'Add at least one benefit.',
        path: ['benefits'],
      })
    }
  })

export const adminPortfolioProjectFormSchema = z
  .object({
    slug: slugSchema,
    title: z.string().min(1).max(200),
    category: z.string().min(1).max(100),
    excerpt: z.string().min(1).max(1200),
    year: z.string().min(1).max(10),
    duration: z.string().min(1).max(100),
    role: z.string().min(1).max(200),
    summary: z.string().min(1),
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
    metaTitle: z.string().max(200),
    metaDescription: z.string().max(500),
    ogImageUrl: z.string().max(2000),
    canonicalUrl: z.string().max(2000),
    twitterCard: twitterCardSchema,
  })
  .superRefine((data, ctx) => {
    const check = (key: 'scope' | 'deliverables' | 'outcomes' | 'tools', message: string) => {
      const filtered = data[key].map((s) => s.trim()).filter(Boolean)
      if (filtered.length === 0) {
        ctx.addIssue({
          code: 'custom',
          message,
          path: [key],
        })
      }
    }
    check('scope', 'Add at least one scope item.')
    check('deliverables', 'Add at least one deliverable.')
    check('outcomes', 'Add at least one outcome.')
    check('tools', 'Add at least one tool.')
  })

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

export const contactInquiryFormSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters.'),
  email: z.string().trim().email('Enter a valid email address.'),
  phone: z.string(),
  firm: z.string(),
  service: z.string().min(1, 'Select a service.'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters.'),
})
