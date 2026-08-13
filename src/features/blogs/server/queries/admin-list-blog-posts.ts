import { createServerFn } from '@tanstack/react-start'
import { requireAdminMiddleware } from '#/features/auth/server/middleware'
import {
  getBlogPostBySlug,
  listAllBlogPosts,
} from '#/features/blogs/server/blogs-service'
import { slugSchema } from '#/lib/cms-schemas'

export const adminListBlogPosts = createServerFn({ method: 'GET' })
  .middleware([requireAdminMiddleware])
  .handler(async () => {
    return listAllBlogPosts()
  })

export const adminGetBlogPost = createServerFn({ method: 'GET' })
  .middleware([requireAdminMiddleware])
  .inputValidator((slug: string) => slugSchema.parse(slug))
  .handler(async ({ data: slug }) => {
    return getBlogPostBySlug(slug)
  })
