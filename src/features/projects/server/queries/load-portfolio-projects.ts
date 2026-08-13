import { createServerFn } from '@tanstack/react-start'
import {
  ensurePortfolioProjectsSeeded,
  getPublishedPortfolioProjectBySlug,
  listFeaturedPublishedPortfolioProjects,
  listPublishedPortfolioProjects,
} from '#/features/projects/server/projects-service'

/** POST so Workers Cache cannot store these (GET 200s with no Cache-Control are cached for 2h). */
export const loadPortfolioProjects = createServerFn({ method: 'POST' }).handler(async () => {
  await ensurePortfolioProjectsSeeded()
  return listPublishedPortfolioProjects()
})

export const loadFeaturedPortfolioProjects = createServerFn({ method: 'POST' }).handler(async () => {
  await ensurePortfolioProjectsSeeded()
  return listFeaturedPublishedPortfolioProjects()
})

export const loadPortfolioProject = createServerFn({ method: 'POST' })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    await ensurePortfolioProjectsSeeded()
    const project = await getPublishedPortfolioProjectBySlug(slug)
    if (!project) return null
    const related = (await listPublishedPortfolioProjects())
      .filter((p) => p.slug !== project.slug)
      .slice(0, 2)
    return { project, related }
  })
