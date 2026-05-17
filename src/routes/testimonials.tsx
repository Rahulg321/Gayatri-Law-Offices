import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { testimonials, stats } from '#/lib/data'

export const Route = createFileRoute('/testimonials')({
  head: () => ({
    meta: [
      { title: 'Client Testimonials & Case Studies — Gayatri Law Offices' },
      { name: 'description', content: 'See what 150+ law firms say about Gayatri Law Offices. Real testimonials and case studies from our LPO clients worldwide.' },
    ],
  }),
  component: TestimonialsPage,
})

function TestimonialsPage() {
  return (
    <main className="page-wrap px-4 pb-16 pt-28 sm:pt-32">
      <section className="text-center">
        <Badge variant="outline" className="mb-4 rounded-full border-[var(--gold)]/30 px-3 py-1 text-[10px] tracking-[0.2em] text-[var(--gold)] uppercase">Testimonials</Badge>
        <h1 className="display-title mb-6 text-4xl leading-[1.06] font-semibold tracking-tight text-[var(--charcoal)] sm:text-5xl">Trusted by Law Firms Worldwide</h1>
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-[var(--charcoal-soft)] sm:text-lg">
          Don't take our word for it. Hear from the law firms and legal departments that rely on Gayatri Law Offices every day.
        </p>
      </section>

      <section className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {stats.map((stat, i) => (
          <div key={stat.label} className="island-shell rise-in flex flex-col items-center rounded-[1.5rem] px-4 py-5 text-center sm:px-6 sm:py-7" style={{ animationDelay: `${200 + i * 100}ms` }}>
            <span className="display-title text-2xl font-semibold text-[var(--gold)] sm:text-3xl">{stat.value}</span>
            <span className="mt-1 text-xs font-medium tracking-wide text-[var(--charcoal-soft)] uppercase sm:text-sm">{stat.label}</span>
          </div>
        ))}
      </section>

      <section className="mt-12 grid gap-6 sm:mt-16 sm:grid-cols-2">
        {testimonials.map((t, i) => (
          <Card key={i} className="feature-card rise-in flex flex-col border-[var(--line)]" style={{ animationDelay: `${i * 100}ms` }}>
            <CardHeader>
              <svg className="mb-3 h-8 w-8 text-[var(--gold)]/20" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
              <CardDescription className="text-base leading-relaxed italic text-[var(--charcoal-soft)]">{t.quote}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <p className="text-sm font-semibold text-[var(--charcoal)]">{t.author}</p>
              <p className="text-xs text-[var(--slate-soft)]">{t.title}, {t.firm}</p>
              <Badge variant="secondary" className="mt-4 rounded-full bg-[var(--gold-pale)] text-xs text-[var(--gold-deep)]">{t.metrics}</Badge>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="island-shell mt-16 rounded-[2.5rem] px-6 py-12 text-center sm:px-12 sm:py-16">
        <h2 className="display-title mb-4 text-3xl font-semibold tracking-tight text-[var(--charcoal)] sm:text-4xl">Join 150+ Satisfied Law Firms</h2>
        <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-[var(--charcoal-soft)] sm:text-base">
          Experience the quality, reliability, and cost savings that our clients rave about.
        </p>
        <Link to="/contact">
          <Button className="group cursor-pointer rounded-full bg-[var(--gold)] px-8 py-3 text-base font-semibold text-white shadow-[0_2px_12px_rgba(184,134,11,0.3)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[var(--gold-deep)] active:scale-[0.97]">
            Get Started Today
            <span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15 transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </span>
          </Button>
        </Link>
      </section>
    </main>
  )
}
