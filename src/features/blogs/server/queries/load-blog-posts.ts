import { createServerFn } from '@tanstack/react-start'
import {
  ensureBlogPostsSeeded,
  getPublishedBlogPostBySlug,
  listPublishedBlogPosts,
} from '#/features/blogs/server/blogs-service'

/** POST so Workers Cache cannot store these (GET 200s with no Cache-Control are cached for 2h). */
export const loadBlogPosts = createServerFn({ method: 'POST' }).handler(async () => {
  await ensureBlogPostsSeeded()
  return listPublishedBlogPosts()
})

export const loadBlogPost = createServerFn({ method: 'POST' })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    await ensureBlogPostsSeeded()
    const post = await getPublishedBlogPostBySlug(slug)
    if (!post) return null
    const related = (await listPublishedBlogPosts())
      .filter((p) => p.slug !== post.slug)
      .slice(0, 2)
    return { post, related }
  })
