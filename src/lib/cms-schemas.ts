import { z } from 'zod'

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

export const blogPostSchema = z
  .object({
    slug: slugSchema,
    title: z.string().min(1).max(200),
    excerpt: z.string().min(1).max(1000),
    category: z.string().min(1).max(100),
    publishedAt: z.string().min(1).max(30),
    readTime: z.string().min(1).max(50),
    bodyMarkdown: z.string(),
    published: z.boolean(),
  })
  .merge(seoSchema)

export const portfolioProjectSchema = z
  .object({
    slug: slugSchema,
    title: z.string().min(1).max(200),
    category: z.string().min(1).max(100),
    excerpt: z.string().min(1).max(1000),
    year: z.string().min(1).max(10),
    duration: z.string().min(1).max(100),
    role: z.string().min(1).max(200),
    summary: z.string().min(1),
    scope: z.array(z.string().min(1)),
    deliverables: z.array(z.string().min(1)),
    outcomes: z.array(z.string().min(1)),
    tools: z.array(z.string().min(1)),
    published: z.boolean(),
    sortOrder: z.number().int().min(0),
  })
  .merge(seoSchema)

/** Admin UI shape: SEO strings (often empty); list fields may include blank rows until save. */
const adminSeoFormFields = {
  metaTitle: z.string().max(200),
  metaDescription: z.string().max(500),
  ogImageUrl: z.string().max(2000),
} as const

export const adminBlogFormSchema = z.object({
  slug: slugSchema,
  title: z.string().min(1).max(200),
  excerpt: z.string().min(1).max(1000),
  category: z.string().min(1).max(100),
  publishedAt: z.string().min(1).max(30),
  readTime: z.string().min(1).max(50),
  bodyMarkdown: z.string(),
  published: z.boolean(),
  ...adminSeoFormFields,
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
    ...adminSeoFormFields,
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
    excerpt: z.string().min(1).max(1000),
    year: z.string().min(1).max(10),
    duration: z.string().min(1).max(100),
    role: z.string().min(1).max(200),
    summary: z.string().min(1),
    scope: z.array(z.string()),
    deliverables: z.array(z.string()),
    outcomes: z.array(z.string()),
    tools: z.array(z.string()),
    published: z.boolean(),
    sortOrder: z.number().int().min(0),
    ...adminSeoFormFields,
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

export const contactInquiryFormSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters.'),
  email: z.string().trim().email('Enter a valid email address.'),
  phone: z.string(),
  firm: z.string(),
  service: z.string().min(1, 'Select a service.'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters.'),
})
