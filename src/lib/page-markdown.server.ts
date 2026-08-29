import { getPublishedBlogPostBySlug } from '#/features/blogs/server/blogs-service'
import { getPublishedPracticeAreaBySlug } from '#/features/practice-areas/server/practice-areas-service'
import { getPublishedPortfolioProjectBySlug } from '#/features/projects/server/projects-service'
import { markdownForStaticPath } from '#/lib/page-markdown'

export async function resolvePageMarkdown(pathname: string): Promise<string | null> {
  const path = pathname.replace(/\/+$/, '') || '/'
  const staticMd = markdownForStaticPath(path)
  if (staticMd) return staticMd

  const serviceMatch = path.match(/^\/services\/([^/]+)$/)
  if (serviceMatch?.[1]) {
    const area = await getPublishedPracticeAreaBySlug(serviceMatch[1])
    if (!area) return null
    const benefits = area.benefits.map((b) => `- ${b}`).join('\n')
    return `# ${area.title}\n\n${area.description}\n\n## Benefits\n\n${benefits}\n`
  }

  const blogMatch = path.match(/^\/blogs\/([^/]+)$/)
  if (blogMatch?.[1]) {
    const post = await getPublishedBlogPostBySlug(blogMatch[1])
    if (!post) return null
    return `# ${post.title}\n\n${post.excerpt}\n\n${post.bodyMarkdown}\n`
  }

  const projectMatch = path.match(/^\/projects\/([^/]+)$/)
  if (projectMatch?.[1]) {
    const project = await getPublishedPortfolioProjectBySlug(projectMatch[1])
    if (!project) return null
    return `# ${project.title}\n\n${project.summary || project.excerpt}\n\n${project.bodyMarkdown}\n`
  }

  return null
}
