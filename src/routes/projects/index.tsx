import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import { Badge } from '#/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/components/ui/card'
import { portfolioSocialImage } from '#/lib/cms'
import { loadPortfolioProjects } from '#/lib/cms-public'
import {
  PUBLIC_CMS_GC_MS,
  PUBLIC_CMS_STALE_MS,
  applyPublicCmsCacheHeaders,
} from '#/lib/cms-route-cache'

export const Route = createFileRoute('/projects/')({
  staleTime: PUBLIC_CMS_STALE_MS,
  gcTime: PUBLIC_CMS_GC_MS,
  loader: () => {
    applyPublicCmsCacheHeaders()
    return loadPortfolioProjects()
  },
  head: () => ({
    meta: [
      { title: 'Experience & Projects — Gayatri Law Offices' },
      {
        name: 'description',
        content:
          'Selected engagements across legal process outsourcing, remote paralegal support, litigation, research, and transactional work — with scope, deliverables, and outcomes.',
      },
    ],
  }),
  component: ProjectsIndexPage,
})

function ProjectsIndexPage() {
  const portfolioProjects = Route.useLoaderData()

  return (
    <main className="page-wrap px-4 pb-16 pt-28 sm:pt-32">
      <section className="text-center">
        <Badge
          variant="outline"
          className="mb-4 rounded-full border-[var(--gold)]/30 px-3 py-1 text-[10px] tracking-[0.2em] text-[var(--gold)] uppercase"
        >
          Experience
        </Badge>
        <h1 className="display-title mb-6 text-4xl leading-[1.06] font-semibold tracking-tight text-[var(--charcoal)] sm:text-5xl">
          Projects & engagements
        </h1>
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-[var(--charcoal-soft)] sm:text-lg">
          A sample of past work spanning document review, remote paralegal programs, litigation support, legal research, and corporate diligence — each delivered with the same confidentiality standards we apply to every client.
        </p>
      </section>

      <section className="mt-12 grid gap-6 sm:mt-16 sm:grid-cols-2">
        {portfolioProjects.map((project, i) => {
          const thumb = portfolioSocialImage(project)
          return (
            <Link key={project.slug} to="/projects/$slug" params={{ slug: project.slug }} className="group no-underline">
              <Card
                className="feature-card rise-in h-full overflow-hidden border-[var(--line)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:border-[var(--gold)]/30"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="bg-[var(--gold-pale)]/30 relative aspect-[16/9] overflow-hidden border-b border-[var(--line)]">
                  {thumb ? (
                    <img src={thumb} alt="" className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
                  ) : (
                    <div className="from-muted/40 to-muted flex size-full items-center justify-center bg-gradient-to-br text-xs text-[var(--slate-soft)]">
                      No image
                    </div>
                  )}
                  {project.featured ? (
                    <Badge className="absolute left-3 top-3 rounded-full bg-[var(--gold)] text-[10px] text-white">Featured</Badge>
                  ) : null}
                </div>
                <CardHeader>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="rounded-full bg-[var(--gold-pale)] text-[11px] text-[var(--gold-deep)]">
                      {project.category}
                    </Badge>
                    <span className="text-xs text-[var(--slate-soft)]">{project.year}</span>
                  </div>
                  <CardTitle className="flex items-start justify-between gap-3 text-lg font-semibold leading-snug text-[var(--charcoal)] transition-colors group-hover:text-[var(--gold)]">
                    <span>{project.title}</span>
                    <ArrowUpRight className="mt-0.5 size-5 shrink-0 opacity-50 transition-opacity group-hover:opacity-100" aria-hidden />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed text-[var(--charcoal-soft)]">{project.excerpt}</CardDescription>
                  <p className="mt-4 text-xs font-medium text-[var(--gold-deep)]">View case study →</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </section>
    </main>
  )
}
