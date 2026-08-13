import { createServerFn } from '@tanstack/react-start'
import { requireAdminMiddleware } from '#/features/auth/server/middleware'
import {
  getPortfolioProjectBySlug,
  listAllPortfolioProjects,
} from '#/features/projects/server/projects-service'
import { slugSchema } from '#/lib/cms-schemas'

export const adminListProjects = createServerFn({ method: 'GET' })
  .middleware([requireAdminMiddleware])
  .handler(async () => {
    return listAllPortfolioProjects()
  })

export const adminGetProject = createServerFn({ method: 'GET' })
  .middleware([requireAdminMiddleware])
  .inputValidator((slug: string) => slugSchema.parse(slug))
  .handler(async ({ data: slug }) => {
    return getPortfolioProjectBySlug(slug)
  })
