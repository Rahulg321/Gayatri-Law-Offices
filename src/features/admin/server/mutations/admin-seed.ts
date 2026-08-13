import { createServerFn } from '@tanstack/react-start'
import { requireAdminMiddleware } from '#/features/auth/server/middleware'
import { seedBlogPostsIfEmpty } from '#/features/blogs/server/blogs-service'
import { seedPortfolioProjectsIfEmpty } from '#/features/projects/server/projects-service'
import { seedPracticeAreasIfEmpty } from '#/features/practice-areas/server/practice-areas-service'
import { purgePublicCmsWorkersCache } from '#/lib/cms-workers-cache.server'

export const adminSeedCms = createServerFn({ method: 'POST' })
  .middleware([requireAdminMiddleware])
  .handler(async () => {
    await seedPracticeAreasIfEmpty()
    await seedBlogPostsIfEmpty()
    await seedPortfolioProjectsIfEmpty()
    await purgePublicCmsWorkersCache()
    return { seeded: true }
  })
