import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Badge } from '#/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Separator } from '#/components/ui/separator'
import { seoDescription, seoTitle } from '#/lib/cms'
import { loadPortfolioProject } from '#/lib/cms-public'
import {
  PUBLIC_CMS_GC_MS,
  PUBLIC_CMS_STALE_MS,
  applyPublicCmsCacheHeaders,
} from '#/lib/cms-route-cache'

export const Route = createFileRoute('/projects/$slug')({
  staleTime: PUBLIC_CMS_STALE_MS,
  gcTime: PUBLIC_CMS_GC_MS,
  head: ({ loaderData }) => {
    const project = loaderData?.project
    if (!project) return {}
    const title = seoTitle(project.title, project.metaTitle)
    const description = seoDescription(project.excerpt, project.metaDescription)
    return {
      meta: [
        { title: `${title} — Projects | Gayatri Law Offices` },
        { name: 'description', content: description },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:type', content: 'article' },
        ...(project.ogImageUrl ? [{ property: 'og:image', content: project.ogImageUrl }] : []),
      ],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            name: project.title,
            description,
            datePublished: `${project.year}-01-01`,
            about: project.category,
          }),
        },
      ],
    }
  },
  loader: async ({ params }) => {
    applyPublicCmsCacheHeaders()
    const data = await loadPortfolioProject({ data: params.slug })
    if (!data) throw notFound()
    return data
  },
  component: ProjectDetailPage,
})

function ProjectDetailPage() {
  const { project, related } = Route.useLoaderData()

  return (
    <main className="page-wrap px-4 pb-16 pt-28 sm:pt-32">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/projects"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[var(--charcoal-soft)] no-underline transition-colors hover:text-[var(--gold)]"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to all projects
        </Link>

        <Badge
          variant="secondary"
          className="mb-4 rounded-full bg-[var(--gold-pale)] text-[11px] text-[var(--gold-deep)]"
        >
          {project.category}
        </Badge>
        <h1 className="display-title mb-4 text-4xl leading-[1.08] font-semibold tracking-tight text-[var(--charcoal)] sm:text-5xl">
          {project.title}
        </h1>
        <dl className="mb-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--slate-soft)]">
          <div>
            <dt className="sr-only">Year</dt>
            <dd>{project.year}</dd>
          </div>
          <div>
            <dt className="sr-only">Duration</dt>
            <dd>{project.duration}</dd>
          </div>
          <div className="w-full sm:w-auto">
            <dt className="sr-only">Role</dt>
            <dd className="text-[var(--charcoal-soft)]">{project.role}</dd>
          </div>
        </dl>

        <div className="prose prose-lg max-w-none text-[var(--charcoal-soft)]">
          <p className="lead text-lg leading-relaxed">{project.summary}</p>
        </div>

        <div className="mt-10 space-y-10">
          <section>
            <h2 className="display-title mb-4 text-xl font-semibold text-[var(--charcoal)]">Scope</h2>
            <ul className="m-0 list-none space-y-2.5 p-0 text-[var(--charcoal-soft)]">
              {project.scope.map((item) => (
                <li key={item} className="relative pl-5 before:absolute before:left-0 before:top-[0.55em] before:size-1.5 before:rounded-full before:bg-[var(--gold)]">
                  {item}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="display-title mb-4 text-xl font-semibold text-[var(--charcoal)]">Deliverables</h2>
            <ul className="m-0 list-none space-y-2.5 p-0 text-[var(--charcoal-soft)]">
              {project.deliverables.map((item) => (
                <li key={item} className="relative pl-5 before:absolute before:left-0 before:top-[0.55em] before:size-1.5 before:rounded-full before:bg-[var(--gold)]">
                  {item}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="display-title mb-4 text-xl font-semibold text-[var(--charcoal)]">Outcomes</h2>
            <ul className="m-0 list-none space-y-2.5 p-0 text-[var(--charcoal-soft)]">
              {project.outcomes.map((item) => (
                <li key={item} className="relative pl-5 before:absolute before:left-0 before:top-[0.55em] before:size-1.5 before:rounded-full before:bg-[var(--gold)]">
                  {item}
                </li>
              ))}
            </ul>
          </section>
          {project.tools.length ? (
            <section>
              <h2 className="display-title mb-4 text-xl font-semibold text-[var(--charcoal)]">Tools & platforms</h2>
              <div className="flex flex-wrap gap-2">
                {project.tools.map((t) => (
                  <Badge key={t} variant="outline" className="rounded-full border-[var(--line)] font-normal text-[var(--charcoal-soft)]">
                    {t}
                  </Badge>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>

      <Separator className="mx-auto my-14 max-w-3xl" />

      <section className="mx-auto max-w-3xl">
        <h2 className="display-title mb-8 text-center text-2xl font-semibold text-[var(--charcoal)] sm:text-3xl">
          More projects
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {related.map((p) => (
            <Link key={p.slug} to="/projects/$slug" params={{ slug: p.slug }} className="no-underline">
              <Card className="feature-card h-full border-[var(--line)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:border-[var(--gold)]/30">
                <CardHeader className="pb-2">
                  <Badge
                    variant="secondary"
                    className="mb-2 w-fit rounded-full bg-[var(--gold-pale)] text-[11px] text-[var(--gold-deep)]"
                  >
                    {p.category}
                  </Badge>
                  <CardTitle className="text-base font-semibold leading-snug text-[var(--charcoal)]">{p.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[var(--charcoal-soft)] line-clamp-3">{p.excerpt}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
