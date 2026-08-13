import { createServerFn } from '@tanstack/react-start'
import { requireAdminMiddleware } from '#/features/auth/server/middleware'
import { deletePracticeArea } from '#/features/practice-areas/server/practice-areas-service'
import { slugSchema } from '#/lib/cms-schemas'
import { purgePublicCmsWorkersCache } from '#/lib/cms-workers-cache.server'

export const adminDeletePracticeArea = createServerFn({ method: 'POST' })
  .middleware([requireAdminMiddleware])
  .inputValidator((slug: string) => slugSchema.parse(slug))
  .handler(async ({ data: slug }) => {
    await deletePracticeArea(slug)
    await purgePublicCmsWorkersCache()
    return { ok: true }
  })
