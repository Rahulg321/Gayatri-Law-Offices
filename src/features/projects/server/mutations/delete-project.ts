import { createServerFn } from '@tanstack/react-start'
import { requireAdminMiddleware } from '#/features/auth/server/middleware'
import { deleteProject } from '#/features/projects/server/projects-service'
import { slugSchema } from '#/lib/cms-schemas'
import { purgePublicCmsWorkersCache } from '#/lib/cms-workers-cache.server'

export const adminDeleteProject = createServerFn({ method: 'POST' })
  .middleware([requireAdminMiddleware])
  .inputValidator((slug: string) => slugSchema.parse(slug))
  .handler(async ({ data: slug }) => {
    await deleteProject(slug)
    await purgePublicCmsWorkersCache()
    return { ok: true }
  })
