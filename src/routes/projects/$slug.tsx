import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { Markdown } from '#/components/Markdown'
import { Badge } from '#/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Separator } from '#/components/ui/separator'
import { portfolioSocialImage } from '#/lib/cms'
import { loadPortfolioProject } from '#/lib/cms-public'
import {
  PUBLIC_CMS_GC_MS,
  PUBLIC_CMS_STALE_MS,
  applyPublicCmsCacheHeaders,
} from '#/lib/cms-route-cache'
import { portfolioProjectHeadMeta } from '#/lib/portfolio-head'
import { youtubeEmbedSrc, vimeoEmbedSrc } from '#/lib/portfolio-embed'

function formatStatusLabel(raw: string) {
  return raw.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

export const Route = createFileRoute('/projects/$slug')({
  staleTime: PUBLIC_CMS_STALE_MS,
  gcTime: PUBLIC_CMS_GC_MS,
  head: ({ loaderData }) => {
    const project = loaderData?.project
    if (!project) return {}
    return portfolioProjectHeadMeta(project)
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
  const hero = portfolioSocialImage(project)
  const dateLineParts = [
    project.ongoing ? 'Ongoing' : null,
    project.startDate ? `Started ${project.startDate}` : null,
    project.endDate && !project.ongoing ? `Ended ${project.endDate}` : null,
    project.year ? `Listed year: ${project.year}` : null,
    project.duration,
  ].filter(Boolean)

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

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="rounded-full bg-[var(--gold-pale)] text-[11px] text-[var(--gold-deep)]">
            {project.category}
          </Badge>
          <Badge variant="outline" className="rounded-full border-[var(--line)] text-[11px] font-normal capitalize text-[var(--charcoal-soft)]">
            {formatStatusLabel(project.projectStatus)}
          </Badge>
          {project.featured ? (
            <Badge className="rounded-full bg-[var(--gold)] text-[11px] text-white">Featured</Badge>
          ) : null}
        </div>

        <h1 className="display-title mb-4 text-4xl leading-[1.08] font-semibold tracking-tight text-[var(--charcoal)] sm:text-5xl">
          {project.title}
        </h1>

        {dateLineParts.length ? (
          <p className="mb-2 text-sm text-[var(--slate-soft)]">{dateLineParts.join(' · ')}</p>
        ) : null}

        <dl className="mb-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--slate-soft)]">
          <div>
            <dt className="sr-only">Role</dt>
            <dd className="text-[var(--charcoal-soft)]">{project.role}</dd>
          </div>
          {project.clientName ? (
            <div>
              <dt className="sr-only">Client</dt>
              <dd>
                {project.clientUrl?.trim() ? (
                  <a href={project.clientUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[var(--gold-deep)] no-underline hover:underline">
                    {project.clientName}
                    <ExternalLink className="size-3.5 opacity-70" aria-hidden />
                  </a>
                ) : (
                  project.clientName
                )}
              </dd>
            </div>
          ) : null}
          {project.teamSize?.trim() ? (
            <div>
              <dt className="sr-only">Team</dt>
              <dd>{project.teamSize}</dd>
            </div>
          ) : null}
          {project.budgetRange?.trim() ? (
            <div>
              <dt className="sr-only">Budget range</dt>
              <dd>{project.budgetRange}</dd>
            </div>
          ) : null}
          <div>
            <dt className="sr-only">Engagement type</dt>
            <dd className="capitalize">{formatStatusLabel(project.projectType)}</dd>
          </div>
        </dl>

        {hero ? (
          <img src={hero} alt="" className="mb-8 aspect-[16/9] w-full rounded-xl border border-[var(--line)] object-cover" />
        ) : null}

        <div className="prose prose-lg mb-10 max-w-none text-[var(--charcoal-soft)]">
          <p className="lead text-lg leading-relaxed">{project.summary}</p>
        </div>

        {project.tags.length ? (
          <div className="mb-10 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="rounded-full border-[var(--line)] font-normal text-[var(--charcoal-soft)]">
                {tag}
              </Badge>
            ))}
          </div>
        ) : null}

        {project.bodyMarkdown.trim() ? (
          <Markdown content={project.bodyMarkdown} className="prose prose-lg mb-14 max-w-none text-[var(--charcoal-soft)]" />
        ) : null}

        {project.gallery.length ? (
          <section className="mb-14">
            <h2 className="display-title mb-6 text-xl font-semibold text-[var(--charcoal)]">Gallery</h2>
            <div className="columns-1 gap-4 sm:columns-2">
              {project.gallery.map((img) => (
                <figure key={`${img.url}-${img.sortOrder}`} className="mb-4 break-inside-avoid">
                  <img src={img.url} alt={img.alt || project.title} className="w-full rounded-lg border border-[var(--line)] object-cover" />
                  {(img.caption ?? '').trim() ? (
                    <figcaption className="mt-2 text-center text-xs text-[var(--slate-soft)]">{img.caption}</figcaption>
                  ) : null}
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        {project.videos.length ? (
          <section className="mb-14">
            <h2 className="display-title mb-6 text-xl font-semibold text-[var(--charcoal)]">Videos</h2>
            <div className="space-y-8">
              {project.videos.map((v, i) => {
                const heading = v.title?.trim() || `Video ${i + 1}`
                return (
                  <div key={`${v.url}-${i}`} className="space-y-3">
                    <p className="text-sm font-medium text-[var(--charcoal)]">{heading}</p>
                    <div className="overflow-hidden rounded-xl border border-[var(--line)]">
                      {v.kind === 'file' ? (
                        <video controls className="aspect-video w-full bg-black sm:max-h-[480px]" src={v.url} />
                      ) : null}
                      {v.kind === 'youtube' ? (
                        (() => {
                          const src = youtubeEmbedSrc(v.url)
                          return src ? (
                            <iframe
                              title={heading}
                              className="aspect-video w-full"
                              src={src}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                              referrerPolicy="strict-origin-when-cross-origin"
                            />
                          ) : (
                            <p className="p-4 text-sm text-[var(--charcoal-soft)]">Could not embed this YouTube URL.</p>
                          )
                        })()
                      ) : null}
                      {v.kind === 'vimeo' ? (
                        (() => {
                          const src = vimeoEmbedSrc(v.url)
                          return src ? (
                            <iframe
                              title={heading}
                              className="aspect-video w-full"
                              src={src}
                              allow="autoplay; fullscreen; picture-in-picture"
                              allowFullScreen
                              referrerPolicy="strict-origin-when-cross-origin"
                            />
                          ) : (
                            <p className="p-4 text-sm text-[var(--charcoal-soft)]">Could not embed this Vimeo URL.</p>
                          )
                        })()
                      ) : null}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        ) : null}

        {project.metrics.length ? (
          <section className="mb-14">
            <h2 className="display-title mb-4 text-xl font-semibold text-[var(--charcoal)]">Key results</h2>
            <ul className="m-0 list-none space-y-2.5 p-0 text-[var(--charcoal-soft)]">
              {project.metrics.map((item) => (
                <li
                  key={item}
                  className="relative pl-5 before:absolute before:left-0 before:top-[0.55em] before:size-1.5 before:rounded-full before:bg-[var(--gold)]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="space-y-10">
          <section>
            <h2 className="display-title mb-4 text-xl font-semibold text-[var(--charcoal)]">Scope</h2>
            <ul className="m-0 list-none space-y-2.5 p-0 text-[var(--charcoal-soft)]">
              {project.scope.map((item) => (
                <li
                  key={item}
                  className="relative pl-5 before:absolute before:left-0 before:top-[0.55em] before:size-1.5 before:rounded-full before:bg-[var(--gold)]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="display-title mb-4 text-xl font-semibold text-[var(--charcoal)]">Deliverables</h2>
            <ul className="m-0 list-none space-y-2.5 p-0 text-[var(--charcoal-soft)]">
              {project.deliverables.map((item) => (
                <li
                  key={item}
                  className="relative pl-5 before:absolute before:left-0 before:top-[0.55em] before:size-1.5 before:rounded-full before:bg-[var(--gold)]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="display-title mb-4 text-xl font-semibold text-[var(--charcoal)]">Outcomes</h2>
            <ul className="m-0 list-none space-y-2.5 p-0 text-[var(--charcoal-soft)]">
              {project.outcomes.map((item) => (
                <li
                  key={item}
                  className="relative pl-5 before:absolute before:left-0 before:top-[0.55em] before:size-1.5 before:rounded-full before:bg-[var(--gold)]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>
          {project.skills.length ? (
            <section>
              <h2 className="display-title mb-4 text-xl font-semibold text-[var(--charcoal)]">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {project.skills.map((s) => (
                  <Badge key={s} variant="outline" className="rounded-full border-[var(--line)] font-normal text-[var(--charcoal-soft)]">
                    {s}
                  </Badge>
                ))}
              </div>
            </section>
          ) : null}
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

        {project.challengesMarkdown.trim() ? (
          <section className="mt-14">
            <h2 className="display-title mb-4 text-xl font-semibold text-[var(--charcoal)]">Challenges & approach</h2>
            <Markdown content={project.challengesMarkdown} className="prose prose-lg max-w-none text-[var(--charcoal-soft)]" />
          </section>
        ) : null}

        {project.links.length ? (
          <section className="mt-14">
            <h2 className="display-title mb-4 text-xl font-semibold text-[var(--charcoal)]">Links</h2>
            <div className="flex flex-wrap gap-2">
              {project.links.map((l) => (
                <a
                  key={`${l.url}-${l.title}`}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-border hover:border-[var(--gold)]/40 focus-visible:border-[var(--gold)] inline-flex items-center gap-1 rounded-full border bg-white/70 px-3 py-1.5 text-xs font-medium text-[var(--charcoal)] no-underline transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]/35"
                >
                  {l.title}
                  <ExternalLink className="size-3.5 shrink-0 opacity-60" aria-hidden />
                </a>
              ))}
            </div>
          </section>
        ) : null}

        {project.attachments.length ? (
          <section className="mt-14">
            <h2 className="display-title mb-4 text-xl font-semibold text-[var(--charcoal)]">Downloads</h2>
            <ul className="m-0 list-none space-y-2 p-0">
              {project.attachments.map((a) => (
                <li key={`${a.fileUrl}-${a.filename}`}>
                  <a
                    href={a.fileUrl}
                    download={a.filename}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-[var(--gold-deep)] no-underline hover:underline"
                  >
                    {a.filename}
                  </a>
                  {a.fileType ? <span className="text-muted-foreground ml-2 text-xs">{a.fileType}</span> : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {project.testimonials.length ? (
          <section className="mt-14">
            <h2 className="display-title mb-6 text-xl font-semibold text-[var(--charcoal)]">Testimonials</h2>
            <div className="space-y-6">
              {project.testimonials.map((t, i) => (
                <blockquote key={`${t.clientName}-${i}`} className="border-border rounded-xl border bg-white/60 p-5">
                  <p className="text-sm italic leading-relaxed text-[var(--charcoal-soft)]">&ldquo;{t.quote}&rdquo;</p>
                  <footer className="mt-4 flex items-center gap-3">
                    {t.clientPhotoUrl ? (
                      <img src={t.clientPhotoUrl} alt="" className="size-10 rounded-full object-cover" />
                    ) : null}
                    <cite className="text-xs font-semibold not-italic text-[var(--charcoal)]">{t.clientName}</cite>
                  </footer>
                </blockquote>
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <Separator className="mx-auto my-14 max-w-3xl" />

      <section className="mx-auto max-w-3xl">
        <h2 className="display-title mb-8 text-center text-2xl font-semibold text-[var(--charcoal)] sm:text-3xl">More projects</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {related.map((p) => (
            <Link key={p.slug} to="/projects/$slug" params={{ slug: p.slug }} className="no-underline">
              <Card className="feature-card h-full border-[var(--line)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:border-[var(--gold)]/30">
                <CardHeader className="pb-2">
                  <Badge variant="secondary" className="mb-2 w-fit rounded-full bg-[var(--gold-pale)] text-[11px] text-[var(--gold-deep)]">
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
