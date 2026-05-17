import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { processSteps } from '#/lib/data'

export const Route = createFileRoute('/why-us')({
  head: () => ({
    meta: [
      { title: 'Why Choose Gayatri Law Offices — Benefits & Process' },
      { name: 'description', content: 'Discover why 150+ law firms choose Gayatri Law Offices for legal process outsourcing. Cost savings, quality, security, and a proven delivery process.' },
    ],
  }),
  component: WhyUsPage,
})

function WhyUsPage() {
  return (
    <main className="page-wrap px-4 pb-16 pt-28 sm:pt-32">
      <section className="island-shell rise-in-blur relative overflow-hidden rounded-[2.5rem] px-6 py-12 sm:px-12 sm:py-20">
        <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(184,134,11,0.12),transparent_60%)]" />
        <Badge variant="outline" className="mb-4 rounded-full border-[var(--gold)]/30 px-3 py-1 text-[10px] tracking-[0.2em] text-[var(--gold)] uppercase">Why Choose Us</Badge>
        <h1 className="display-title mb-6 max-w-3xl text-4xl leading-[1.06] font-semibold tracking-tight text-[var(--charcoal)] sm:text-5xl">The Smarter Way to Scale Your Legal Practice</h1>
        <p className="max-w-2xl text-base leading-relaxed text-[var(--charcoal-soft)] sm:text-lg">
          We combine India's exceptional legal talent with rigorous quality processes and secure infrastructure — delivering results that rival in-house teams at a fraction of the cost.
        </p>
      </section>

      <section className="mt-14 sm:mt-20">
        <h2 className="display-title mb-8 text-3xl font-semibold tracking-tight text-[var(--charcoal)] sm:text-4xl">Why Leading Firms Choose Us</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {[
            { title: '40-60% Cost Savings', desc: 'Compared to in-house associates or domestic paralegals, our services deliver substantial cost reduction without sacrificing quality.' },
            { title: 'Scalable On Demand', desc: 'Need 2 reviewers or 50? Our team scales to match your caseload — no hiring delays, no overhead.' },
            { title: '24/7 Productivity', desc: 'The India time zone advantage means your work continues while you sleep — faster turnaround on every project.' },
            { title: 'ISO 27001 Certified', desc: 'Our information security management is independently audited and certified — your client data is protected at every step.' },
            { title: 'Domain Experts', desc: 'We don\u2019t do generalist pools. Your work is handled by professionals with specific expertise in your practice area.' },
            { title: 'Flexible Engagement', desc: 'Fixed-fee, hourly, or retainer — choose the model that fits your budget and workflow. No long-term commitments required.' },
          ].map((item, i) => (
            <Card key={item.title} className="feature-card rise-in" style={{ animationDelay: `${i * 80}ms` }}>
              <CardHeader><CardTitle className="text-base font-semibold text-[var(--charcoal)]">{item.title}</CardTitle></CardHeader>
              <CardContent><CardDescription className="text-sm text-[var(--charcoal-soft)]">{item.desc}</CardDescription></CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-14 sm:mt-20">
        <h2 className="display-title mb-10 text-center text-3xl font-semibold tracking-tight text-[var(--charcoal)] sm:text-4xl">Our Delivery Process</h2>
        <div className="grid gap-4 sm:grid-cols-5">
          {processSteps.map((s, i) => (
            <Card key={s.step} className="feature-card rise-in relative text-center" style={{ animationDelay: `${i * 100}ms` }}>
              <CardHeader>
                <span className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--gold-pale)] text-sm font-bold text-[var(--gold)]">{s.step}</span>
                <CardTitle className="text-sm font-semibold text-[var(--charcoal)]">{s.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs text-[var(--charcoal-soft)]">{s.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="island-shell mt-14 rounded-[2.5rem] px-6 py-12 text-center sm:mt-20 sm:px-12 sm:py-16">
        <h2 className="display-title mb-4 text-3xl font-semibold tracking-tight text-[var(--charcoal)] sm:text-4xl">Ready to Experience the Difference?</h2>
        <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-[var(--charcoal-soft)] sm:text-base">
          Start with a pilot project and see firsthand why 150+ law firms trust Gayatri Law Offices.
        </p>
        <Link to="/contact">
          <Button className="group cursor-pointer rounded-full bg-[var(--gold)] px-8 py-3 text-base font-semibold text-white shadow-[0_2px_12px_rgba(184,134,11,0.3)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[var(--gold-deep)] active:scale-[0.97]">
            Start Your Pilot Project
            <span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15 transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </span>
          </Button>
        </Link>
      </section>
    </main>
  )
}
