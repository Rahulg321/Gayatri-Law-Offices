import { createServerFn } from '@tanstack/react-start'
import {
  ensureCmsSeeded,
  getPublishedBlogPostBySlug,
  getPublishedPortfolioProjectBySlug,
  getPublishedPracticeAreaBySlug,
  listFeaturedPublishedPortfolioProjects,
  listPublishedBlogPosts,
  listPublishedPortfolioProjects,
  listPublishedPracticeAreas,
} from '#/lib/cms-queries.server'

/** POST so Workers Cache cannot store these (GET 200s with no Cache-Control are cached for 2h). */
export const loadPracticeAreas = createServerFn({ method: 'POST' }).handler(async () => {
  await ensureCmsSeeded()
  return listPublishedPracticeAreas()
})

export const loadPracticeArea = createServerFn({ method: 'POST' })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    await ensureCmsSeeded()
    return getPublishedPracticeAreaBySlug(slug)
  })

export const loadBlogPosts = createServerFn({ method: 'POST' }).handler(async () => {
  await ensureCmsSeeded()
  return listPublishedBlogPosts()
})

export const loadBlogPost = createServerFn({ method: 'POST' })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    await ensureCmsSeeded()
    const post = await getPublishedBlogPostBySlug(slug)
    if (!post) return null
    const related = (await listPublishedBlogPosts())
      .filter((p) => p.slug !== post.slug)
      .slice(0, 2)
    return { post, related }
  })

export const loadPortfolioProjects = createServerFn({ method: 'POST' }).handler(async () => {
  await ensureCmsSeeded()
  return listPublishedPortfolioProjects()
})

export const loadFeaturedPortfolioProjects = createServerFn({ method: 'POST' }).handler(async () => {
  await ensureCmsSeeded()
  return listFeaturedPublishedPortfolioProjects()
})

export const loadPortfolioProject = createServerFn({ method: 'POST' })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    await ensureCmsSeeded()
    const project = await getPublishedPortfolioProjectBySlug(slug)
    if (!project) return null
    const related = (await listPublishedPortfolioProjects())
      .filter((p) => p.slug !== project.slug)
      .slice(0, 2)
    return { project, related }
  })
