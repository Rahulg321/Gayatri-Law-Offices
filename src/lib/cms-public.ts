import { createServerFn } from '@tanstack/react-start'
import {
  ensureCmsSeeded,
  getPublishedBlogPostBySlug,
  getPublishedPortfolioProjectBySlug,
  getPublishedPracticeAreaBySlug,
  listPublishedBlogPosts,
  listPublishedPortfolioProjects,
  listPublishedPracticeAreas,
} from '#/lib/cms-queries.server'

export const loadPracticeAreas = createServerFn({ method: 'GET' }).handler(async () => {
  await ensureCmsSeeded()
  return listPublishedPracticeAreas()
})

export const loadPracticeArea = createServerFn({ method: 'GET' })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    await ensureCmsSeeded()
    return getPublishedPracticeAreaBySlug(slug)
  })

export const loadBlogPosts = createServerFn({ method: 'GET' }).handler(async () => {
  await ensureCmsSeeded()
  return listPublishedBlogPosts()
})

export const loadBlogPost = createServerFn({ method: 'GET' })
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

export const loadPortfolioProjects = createServerFn({ method: 'GET' }).handler(async () => {
  await ensureCmsSeeded()
  return listPublishedPortfolioProjects()
})

export const loadPortfolioProject = createServerFn({ method: 'GET' })
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
