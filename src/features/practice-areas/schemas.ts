import { z } from 'zod'
import { seoSchema, slugSchema } from '#/lib/cms-schemas'

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
