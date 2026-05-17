import { createFileRoute, Link } from '@tanstack/react-router'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/components/ui/card'
import { services } from '#/lib/data'

export const Route = createFileRoute('/services/')({
  head: () => ({
    meta: [
      { title: 'LPO Services — Contract, Research & Litigation Support' },
      {
        name: 'description',
        content:
          'Comprehensive legal process outsourcing services: contract drafting, document review, legal research, litigation support, due diligence, IP, and paralegal services.',
      },
    ],
  }),
  component: ServicesIndexPage,
})

function ServicesIndexPage() {
  return (
    <main className="page-wrap px-4 pb-16 pt-28 sm:pt-32">
      <section className="text-center">
        <Badge
          variant="outline"
          className="mb-4 rounded-full border-[var(--gold)]/30 px-3 py-1 text-[10px] tracking-[0.2em] text-[var(--gold)] uppercase"
        >
          What We Offer
        </Badge>
        <h1 className="display-title mb-4 text-4xl leading-[1.06] font-semibold tracking-tight text-[var(--charcoal)] sm:text-5xl">
          Comprehensive LPO Services
        </h1>
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-[var(--charcoal-soft)] sm:text-lg">
          From contract drafting to litigation support, our services are designed to help law firms reduce costs, scale efficiently,
          and deliver exceptional results.
        </p>
      </section>

      <section className="mt-12 grid gap-5 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((svc, i) => (
          <Link key={svc.slug} to="/services/$slug" params={{ slug: svc.slug }} className="no-underline">
            <Card
              className="feature-card rise-in group h-full border-[var(--line)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:border-[var(--gold)]/30 hover:shadow-[0_24px_48px_rgba(139,69,19,0.06)]"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <CardHeader>
                <span className="mb-2 text-3xl">{svc.icon}</span>
                <CardTitle className="text-lg font-semibold text-[var(--charcoal)]">{svc.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed text-[var(--charcoal-soft)]">{svc.short}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>

      <section className="island-shell mt-16 rounded-[2.5rem] px-6 py-12 text-center sm:px-12 sm:py-16">
        <h2 className="display-title mb-4 text-3xl font-semibold tracking-tight text-[var(--charcoal)] sm:text-4xl">Need a Custom Solution?</h2>
        <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-[var(--charcoal-soft)] sm:text-base">
          Don&apos;t see exactly what you need? We create tailored LPO solutions for unique practice area requirements.
        </p>
        <Link to="/contact">
          <Button className="group cursor-pointer rounded-full bg-[var(--gold)] px-8 py-3 text-base font-semibold text-white shadow-[0_2px_12px_rgba(184,134,11,0.3)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[var(--gold-deep)] active:scale-[0.97]">
            Request a Custom Quote
            <span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15 transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </span>
          </Button>
        </Link>
      </section>
    </main>
  )
}
