import { createServerFn } from '@tanstack/react-start'
import { requireAdminMiddleware } from '#/features/auth/server/middleware'
import { savePracticeArea } from '#/features/practice-areas/server/practice-areas-service'
import { practiceAreaSchema } from '#/features/practice-areas/schemas'
import { purgePublicCmsWorkersCache } from '#/lib/cms-workers-cache.server'

export const adminSavePracticeArea = createServerFn({ method: 'POST' })
  .middleware([requireAdminMiddleware])
  .inputValidator((input: unknown) => practiceAreaSchema.parse(input))
  .handler(async ({ data }) => {
    const result = await savePracticeArea(data)
    await purgePublicCmsWorkersCache()
    return result
  })
