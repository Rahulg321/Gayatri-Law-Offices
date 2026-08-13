import { createServerFn } from '@tanstack/react-start'
import { requireAdminMiddleware } from '#/features/auth/server/middleware'
import { saveProject } from '#/features/projects/server/projects-service'
import { portfolioProjectSchema } from '#/features/projects/schemas'
import { purgePublicCmsWorkersCache } from '#/lib/cms-workers-cache.server'

export const adminSaveProject = createServerFn({ method: 'POST' })
  .middleware([requireAdminMiddleware])
  .inputValidator((input: unknown) => portfolioProjectSchema.parse(input))
  .handler(async ({ data }) => {
    const result = await saveProject(data)
    await purgePublicCmsWorkersCache()
    return result
  })
