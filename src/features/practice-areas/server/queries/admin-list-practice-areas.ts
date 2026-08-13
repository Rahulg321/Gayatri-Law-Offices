import { createServerFn } from '@tanstack/react-start'
import { requireAdminMiddleware } from '#/features/auth/server/middleware'
import {
  getPracticeAreaBySlug,
  listAllPracticeAreas,
} from '#/features/practice-areas/server/practice-areas-service'
import { slugSchema } from '#/lib/cms-schemas'

export const adminListPracticeAreas = createServerFn({ method: 'GET' })
  .middleware([requireAdminMiddleware])
  .handler(async () => {
    return listAllPracticeAreas()
  })

export const adminGetPracticeArea = createServerFn({ method: 'GET' })
  .middleware([requireAdminMiddleware])
  .inputValidator((slug: string) => slugSchema.parse(slug))
  .handler(async ({ data: slug }) => {
    return getPracticeAreaBySlug(slug)
  })
