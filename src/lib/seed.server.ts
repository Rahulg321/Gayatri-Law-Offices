import { count } from 'drizzle-orm'
import { getDb } from '#/db/index'
import { blogPosts, portfolioProjects, practiceAreas } from '#/db/schema'
import { stringifyJson, stringifyJsonArray } from '#/lib/cms'
import { blogPosts as staticBlogs, portfolioProjects as staticProjects, services } from '#/lib/data'

const DEFAULT_BLOG_MARKDOWN = `Legal process outsourcing continues to evolve rapidly. As law firms face increasing pressure to deliver more value at lower costs, the role of LPO providers has never been more critical.

## Key Trends Shaping the Industry

The LPO landscape is being reshaped by several powerful forces. AI and machine learning tools are augmenting human review capabilities, enabling faster and more accurate document analysis.

## Practical Takeaways

- Start with a clearly defined scope and pilot project
- Prioritize providers with demonstrated expertise in your practice area
- Insist on ISO-certified security practices from day one
- Build regular feedback loops into your engagement
`

export async function seedCmsFromStaticData() {
  const db = getDb()

  const [paCount] = await db.select({ value: count() }).from(practiceAreas)
  if (paCount.value === 0) {
    await db.insert(practiceAreas).values(
      services.map((svc, i) => ({
        slug: svc.slug,
        title: svc.title,
        short: svc.short,
        description: svc.description,
        icon: svc.icon,
        benefits: stringifyJsonArray([...svc.benefits]),
        published: true,
        sortOrder: i,
        metaTitle: `${svc.title} — LPO Services | Gayatri Law Offices`,
        metaDescription: svc.short,
      })),
    )
  }

  const [blogCount] = await db.select({ value: count() }).from(blogPosts)
  if (blogCount.value === 0) {
    await db.insert(blogPosts).values(
      staticBlogs.map((post) => ({
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        category: post.category,
        publishedAt: post.date,
        readTime: post.readTime,
        bodyMarkdown: DEFAULT_BLOG_MARKDOWN,
        status: 'published' as const,
        tags: '[]',
        twitterCard: 'summary_large_image',
        metaTitle: `${post.title} — Gayatri Law Offices`,
        metaDescription: post.excerpt,
      })),
    )
  }

  const [projectCount] = await db.select({ value: count() }).from(portfolioProjects)
  if (projectCount.value === 0) {
    await db.insert(portfolioProjects).values(
      staticProjects.map((project, i) => ({
        slug: project.slug,
        title: project.title,
        category: project.category,
        excerpt: project.excerpt,
        year: project.year,
        duration: project.duration,
        role: project.role,
        summary: project.summary,
        bodyMarkdown: '',
        ongoing: false,
        projectStatus: 'completed',
        projectType: 'agency',
        featured: false,
        skills: stringifyJsonArray([]),
        metrics: stringifyJsonArray([]),
        galleryJson: stringifyJson([]),
        videosJson: stringifyJson([]),
        linksJson: stringifyJson([]),
        attachmentsJson: stringifyJson([]),
        testimonialsJson: stringifyJson([]),
        challengesMarkdown: '',
        tags: stringifyJsonArray([]),
        scope: stringifyJsonArray([...project.scope]),
        deliverables: stringifyJsonArray([...project.deliverables]),
        outcomes: stringifyJsonArray([...project.outcomes]),
        tools: stringifyJsonArray([...project.tools]),
        published: true,
        sortOrder: i,
        twitterCard: 'summary_large_image',
        metaTitle: `${project.title} — Projects | Gayatri Law Offices`,
        metaDescription: project.excerpt,
      })),
    )
  }

  return { seeded: true }
}
