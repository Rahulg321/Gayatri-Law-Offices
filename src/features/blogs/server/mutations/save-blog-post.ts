import { createServerFn } from '@tanstack/react-start'
import { requireAdminMiddleware } from '#/features/auth/server/middleware'
import { saveBlogPost } from '#/features/blogs/server/blogs-service'
import { blogPostSchema } from '#/features/blogs/schemas'
import { purgePublicCmsWorkersCache } from '#/lib/cms-workers-cache.server'

export const adminSaveBlogPost = createServerFn({ method: 'POST' })
  .middleware([requireAdminMiddleware])
  .inputValidator((input: unknown) => blogPostSchema.parse(input))
  .handler(async ({ data }) => {
    const result = await saveBlogPost(data)
    await purgePublicCmsWorkersCache()
    return result
  })
