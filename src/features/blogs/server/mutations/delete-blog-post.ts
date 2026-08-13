import { createServerFn } from '@tanstack/react-start'
import { requireAdminMiddleware } from '#/features/auth/server/middleware'
import { deleteBlogPost } from '#/features/blogs/server/blogs-service'
import { slugSchema } from '#/lib/cms-schemas'
import { purgePublicCmsWorkersCache } from '#/lib/cms-workers-cache.server'

export const adminDeleteBlogPost = createServerFn({ method: 'POST' })
  .middleware([requireAdminMiddleware])
  .inputValidator((slug: string) => slugSchema.parse(slug))
  .handler(async ({ data: slug }) => {
    await deleteBlogPost(slug)
    await purgePublicCmsWorkersCache()
    return { ok: true }
  })
