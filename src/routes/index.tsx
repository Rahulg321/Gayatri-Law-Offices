import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { portfolioSocialImage } from '#/lib/cms'
import { loadFeaturedPortfolioProjects } from '#/lib/cms-public'
import {
  PUBLIC_CMS_GC_MS,
  PUBLIC_CMS_STALE_MS,
  applyPublicCmsCacheHeaders,
} from '#/lib/cms-route-cache'
import { services, testimonials, stats } from '#/lib/data'

export const Route = createFileRoute('/')({
  staleTime: PUBLIC_CMS_STALE_MS,
  gcTime: PUBLIC_CMS_GC_MS,
  loader: () => {
    applyPublicCmsCacheHeaders()
    return loadFeaturedPortfolioProjects()
  },
  head: () => ({
    meta: [
      { title: 'Gayatri Law Offices — Expert Legal Process Outsourcing from India' },
      { name: 'description', content: 'Cost-effective, high-quality legal process outsourcing services for law firms worldwide. Contract drafting, document review, litigation support, and more.' },
      { property: 'og:title', content: 'Gayatri Law Offices — Expert Legal Process Outsourcing from India' },
      { property: 'og:description', content: 'Cost-effective, high-quality LPO services for global law firms.' },
    ],
    scripts: [{
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Gayatri Law Offices',
        url: 'https://gayatri-law-offices.pages.dev',
      }),
    }],
  }),
  component: HomePage,
})

function HomePage() {
  const featuredProjects = Route.useLoaderData()

  return (
    <main className="page-wrap px-4 pb-16 pt-28 sm:pt-32">
      <section className="island-shell rise-in-blur relative overflow-hidden rounded-[2.5rem] px-6 py-12 sm:px-12 sm:py-20">
        <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(184,134,11,0.16),transparent_60%)]" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(139,69,19,0.08),transparent_60%)]" />
        <Badge variant="outline" className="mb-4 rounded-full border-[var(--gold)]/30 px-3 py-1 text-[10px] tracking-[0.2em] text-[var(--gold)] uppercase">
          Trusted by 150+ Law Firms Worldwide
        </Badge>
        <h1 className="display-title mb-6 max-w-4xl text-4xl leading-[1.06] font-semibold tracking-tight text-[var(--charcoal)] sm:text-5xl lg:text-6xl">
          Expert Legal Process Outsourcing From India
        </h1>
        <p className="mb-8 max-w-2xl text-base leading-relaxed text-[var(--charcoal-soft)] sm:text-lg">
          Cost-effective, high-quality support for global law firms and legal departments. Contract drafting, document review, litigation support, and more — delivered with precision and confidentiality.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/contact">
            <Button className="group cursor-pointer rounded-full bg-[var(--gold)] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_2px_12px_rgba(184,134,11,0.3)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[var(--gold-deep)] hover:shadow-[0_4px_18px_rgba(184,134,11,0.4)] active:scale-[0.97]">
              Get a Free Quote
              <span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15 transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </span>
            </Button>
          </Link>
          <Link to="/services">
            <Button variant="outline" className="cursor-pointer rounded-full border-[var(--line)] bg-white/60 px-6 py-2.5 text-sm font-semibold text-[var(--charcoal)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-[var(--gold)]/30 hover:bg-white/80 active:scale-[0.97]">
              Explore Our Services
            </Button>
          </Link>
        </div>
      </section>

      <section className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="island-shell rise-in flex flex-col items-center rounded-[1.5rem] px-4 py-5 text-center sm:px-6 sm:py-7"
            style={{ animationDelay: `${200 + i * 100}ms` }}
          >
            <span className="display-title text-2xl font-semibold text-[var(--gold)] sm:text-3xl">{stat.value}</span>
            <span className="mt-1 text-xs font-medium tracking-wide text-[var(--charcoal-soft)] uppercase sm:text-sm">{stat.label}</span>
          </div>
        ))}
      </section>

      {featuredProjects.length > 0 ? (
        <section className="mt-14 sm:mt-20">
          <div className="mb-10 text-center sm:mb-12">
            <Badge variant="outline" className="mb-3 rounded-full border-[var(--gold)]/30 px-3 py-1 text-[10px] tracking-[0.2em] text-[var(--gold)] uppercase">
              Featured projects
            </Badge>
            <h2 className="display-title text-3xl font-semibold tracking-tight text-[var(--charcoal)] sm:text-4xl">Highlighted engagements</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[var(--charcoal-soft)] sm:text-base">
              A curated set of engagements with clear scope and measurable outcomes.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {featuredProjects.map((project, i) => {
              const thumb = portfolioSocialImage(project)
              return (
                <Link key={project.slug} to="/projects/$slug" params={{ slug: project.slug }} className="group no-underline">
                  <Card
                    className="feature-card rise-in flex h-full flex-col overflow-hidden border-[var(--line)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:border-[var(--gold)]/30"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <div className="bg-[var(--gold-pale)]/25 relative aspect-[16/10] shrink-0 border-b border-[var(--line)]">
                      {thumb ? (
                        <img src={thumb} alt="" className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
                      ) : (
                        <div className="flex size-full items-center justify-center bg-gradient-to-br from-white/70 to-[var(--gold-pale)]/40 text-[10px] text-[var(--slate-soft)]">
                          Project preview
                        </div>
                      )}
                    </div>
                    <CardHeader className="pb-2">
                      <div className="mb-2 flex flex-wrap gap-2">
                        <Badge variant="secondary" className="rounded-full bg-[var(--gold-pale)] text-[10px] text-[var(--gold-deep)]">{project.category}</Badge>
                      </div>
                      <CardTitle className="flex items-start justify-between gap-2 text-base font-semibold leading-snug text-[var(--charcoal)] transition-colors group-hover:text-[var(--gold)]">
                        <span>{project.title}</span>
                        <ArrowUpRight className="mt-0.5 size-4 shrink-0 opacity-50 transition-opacity group-hover:opacity-100" aria-hidden />
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="mt-auto">
                      <CardDescription className="line-clamp-3 text-sm leading-relaxed text-[var(--charcoal-soft)]">{project.excerpt}</CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
          <div className="mt-8 text-center">
            <Link to="/projects">
              <Button variant="outline" className="cursor-pointer rounded-full border-[var(--line)] bg-white/60 px-6 py-2.5 text-sm font-semibold text-[var(--charcoal)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-[var(--gold)]/30 hover:bg-white/80 active:scale-[0.97]">
                View all projects
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Button>
            </Link>
          </div>
        </section>
      ) : null}

      <section className="mt-14 sm:mt-20">
        <div className="mb-10 text-center sm:mb-14">
          <Badge variant="outline" className="mb-3 rounded-full border-[var(--gold)]/30 px-3 py-1 text-[10px] tracking-[0.2em] text-[var(--gold)] uppercase">Our Services</Badge>
          <h2 className="display-title text-3xl font-semibold tracking-tight text-[var(--charcoal)] sm:text-4xl">Comprehensive LPO Solutions</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[var(--charcoal-soft)] sm:text-base">
            From contract drafting to litigation support — every service backed by experienced legal professionals and rigorous quality control.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.slice(0, 4).map((svc, i) => (
            <Link key={svc.slug} to="/services/$slug" params={{ slug: svc.slug }} className="no-underline">
              <Card
                className="feature-card rise-in group h-full cursor-pointer border-[var(--line)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:border-[var(--gold)]/30 hover:shadow-[0_24px_48px_rgba(139,69,19,0.06)]"
                style={{ animationDelay: `${100 + i * 100}ms` }}
              >
                <CardHeader>
                  <span className="mb-2 text-2xl">{svc.icon}</span>
                  <CardTitle className="text-base font-semibold text-[var(--charcoal)]">{svc.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed text-[var(--charcoal-soft)]">{svc.short}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link to="/services">
            <Button variant="outline" className="cursor-pointer rounded-full border-[var(--line)] bg-white/60 px-6 py-2.5 text-sm font-semibold text-[var(--charcoal)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-[var(--gold)]/30 hover:bg-white/80 active:scale-[0.97]">
              View All Services
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Button>
          </Link>
        </div>
      </section>

      <section className="mt-14 sm:mt-20">
        <div className="mb-10 sm:mb-14">
          <Badge variant="outline" className="mb-3 rounded-full border-[var(--gold)]/30 px-3 py-1 text-[10px] tracking-[0.2em] text-[var(--gold)] uppercase">Client Testimonials</Badge>
          <h2 className="display-title text-3xl font-semibold tracking-tight text-[var(--charcoal)] sm:text-4xl">Trusted by Law Firms Worldwide</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {testimonials.slice(0, 3).map((t, i) => (
            <Card
              key={i}
              className="rise-in feature-card flex flex-col border-[var(--line)]"
              style={{ animationDelay: `${100 + i * 120}ms` }}
            >
              <CardHeader>
                <svg className="mb-2 h-6 w-6 text-[var(--gold)]/30" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
                <CardDescription className="text-sm leading-relaxed italic text-[var(--charcoal-soft)]">{t.quote}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <p className="text-xs font-semibold text-[var(--charcoal)]">{t.author}</p>
                <p className="text-xs text-[var(--slate-soft)]">{t.title}, {t.firm}</p>
                <Badge variant="secondary" className="mt-3 rounded-full bg-[var(--gold-pale)] text-[11px] text-[var(--gold-deep)]">{t.metrics}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="island-shell mt-14 rounded-[2.5rem] px-6 py-12 text-center sm:mt-20 sm:px-12 sm:py-16">
        <Badge variant="outline" className="mb-3 rounded-full border-[var(--gold)]/30 px-3 py-1 text-[10px] tracking-[0.2em] text-[var(--gold)] uppercase">Get Started</Badge>
        <h2 className="display-title mb-4 text-3xl font-semibold tracking-tight text-[var(--charcoal)] sm:text-4xl">Ready to Transform Your Legal Workflow?</h2>
        <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-[var(--charcoal-soft)] sm:text-base">
          Let's discuss how Gayatri Law Offices can help your firm reduce costs, scale efficiently, and deliver exceptional results for your clients.
        </p>
        <Link to="/contact">
          <Button className="group cursor-pointer rounded-full bg-[var(--gold)] px-8 py-3 text-base font-semibold text-white shadow-[0_2px_12px_rgba(184,134,11,0.3)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[var(--gold-deep)] hover:shadow-[0_4px_18px_rgba(184,134,11,0.4)] active:scale-[0.97]">
            Schedule a Consultation
            <span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15 transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </span>
          </Button>
        </Link>
      </section>
    </main>
  )
}
