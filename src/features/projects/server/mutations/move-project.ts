import { createServerFn } from '@tanstack/react-start'
import { requireAdminMiddleware } from '#/features/auth/server/middleware'
import { moveProject } from '#/features/projects/server/projects-service'
import { moveDirectionSchema } from '#/lib/cms-schemas'
import { purgePublicCmsWorkersCache } from '#/lib/cms-workers-cache.server'

export const adminMoveProject = createServerFn({ method: 'POST' })
  .middleware([requireAdminMiddleware])
  .inputValidator((input: unknown) => moveDirectionSchema.parse(input))
  .handler(async ({ data }) => {
    const result = await moveProject(data.slug, data.direction)
    await purgePublicCmsWorkersCache()
    return result
  })
