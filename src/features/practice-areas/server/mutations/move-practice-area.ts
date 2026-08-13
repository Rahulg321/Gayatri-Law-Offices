import { createServerFn } from '@tanstack/react-start'
import { requireAdminMiddleware } from '#/features/auth/server/middleware'
import { movePracticeArea } from '#/features/practice-areas/server/practice-areas-service'
import { moveDirectionSchema } from '#/lib/cms-schemas'
import { purgePublicCmsWorkersCache } from '#/lib/cms-workers-cache.server'

export const adminMovePracticeArea = createServerFn({ method: 'POST' })
  .middleware([requireAdminMiddleware])
  .inputValidator((input: unknown) => moveDirectionSchema.parse(input))
  .handler(async ({ data }) => {
    const result = await movePracticeArea(data.slug, data.direction)
    await purgePublicCmsWorkersCache()
    return result
  })
