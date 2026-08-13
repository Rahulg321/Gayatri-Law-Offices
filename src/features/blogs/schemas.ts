import { z } from 'zod'
import { blogPostStatuses } from '#/db/schema'
import {
  adminSeoFormFields,
  seoSchema,
  slugSchema,
  twitterCardSchema,
} from '#/lib/cms-schemas'

export const blogPostStatusSchema = z.enum(blogPostStatuses)

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

export const blogPostSchema = blogCoreSchema.merge(seoSchema).superRefine((data, ctx) => {
  if (data.status === 'scheduled' && !data.publishedAt.trim()) {
    ctx.addIssue({
      code: 'custom',
      message: 'Scheduled posts need a publish date.',
      path: ['publishedAt'],
    })
  }
})

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
