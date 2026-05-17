import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { timelineEvents } from '#/lib/data'

export const Route = createFileRoute('/about')({
  head: () => ({
    meta: [
      { title: 'About Gayatri Law Offices — Our Story & Mission' },
      { name: 'description', content: 'Learn about Gayatri Law Offices — our founding story, mission, values, and the team behind India\'s trusted legal process outsourcing provider.' },
      { property: 'og:title', content: 'About Gayatri Law Offices — Our Story & Mission' },
    ],
  }),
  component: AboutPage,
})

function AboutPage() {
  return (
    <main className="page-wrap px-4 pb-16 pt-28 sm:pt-32">
      <section className="island-shell rise-in-blur relative overflow-hidden rounded-[2.5rem] px-6 py-12 sm:px-12 sm:py-20">
        <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(184,134,11,0.12),transparent_60%)]" />
        <Badge variant="outline" className="mb-4 rounded-full border-[var(--gold)]/30 px-3 py-1 text-[10px] tracking-[0.2em] text-[var(--gold)] uppercase">Our Story</Badge>
        <h1 className="display-title mb-6 max-w-4xl text-4xl leading-[1.06] font-semibold tracking-tight text-[var(--charcoal)] sm:text-5xl">Bridging Legal Expertise Across Continents</h1>
        <p className="max-w-2xl text-base leading-relaxed text-[var(--charcoal-soft)] sm:text-lg">
          Founded in 2018, Gayatri Law Offices was built on a simple belief: that global law firms deserve access to world-class legal talent without the prohibitive costs of traditional models.
        </p>
      </section>

      <section className="mt-14 sm:mt-20">
        <div className="mb-10">
          <Badge variant="outline" className="mb-3 rounded-full border-[var(--gold)]/30 px-3 py-1 text-[10px] tracking-[0.2em] text-[var(--gold)] uppercase">Our Mission</Badge>
          <h2 className="display-title text-3xl font-semibold tracking-tight text-[var(--charcoal)] sm:text-4xl">Empowering Legal Teams Worldwide</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { title: 'Confidentiality First', desc: 'Bank-grade encryption, strict NDAs, and ISO 27001 certified processes protect every client engagement.' },
            { title: 'Quality Without Compromise', desc: 'Multi-layer review by qualified legal professionals ensures every deliverable meets the highest standards.' },
            { title: 'Cultural Alignment', desc: 'Our professionals are trained in US, UK, and EU legal conventions — we speak your language, literally and professionally.' },
          ].map((v, i) => (
            <Card key={v.title} className="rise-in feature-card" style={{ animationDelay: `${100 + i * 100}ms` }}>
              <CardHeader><CardTitle className="text-base font-semibold text-[var(--charcoal)]">{v.title}</CardTitle></CardHeader>
              <CardContent><CardDescription className="text-sm text-[var(--charcoal-soft)]">{v.desc}</CardDescription></CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-14 sm:mt-20">
        <div className="mb-10">
          <Badge variant="outline" className="mb-3 rounded-full border-[var(--gold)]/30 px-3 py-1 text-[10px] tracking-[0.2em] text-[var(--gold)] uppercase">What Sets Us Apart</Badge>
          <h2 className="display-title text-3xl font-semibold tracking-tight text-[var(--charcoal)] sm:text-4xl">The Gayatri Difference</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: 'Remote-First Excellence', desc: 'Built for remote collaboration from day one — our workflows are optimized for seamless virtual engagement with clients across time zones.' },
            { title: 'Domain-Specific Expertise', desc: 'Our professionals specialize in specific practice areas, not generalist pools. You get an expert, not just a pair of hands.' },
            { title: 'Scalable Teams', desc: 'Scale up or down as your caseload demands. From solo support to 50+ person document review teams — we flex to your needs.' },
            { title: 'AI-Assisted, Human-Validated', desc: 'We leverage AI tools for efficiency, but every output is reviewed by a qualified legal professional. Technology enhances — it never replaces.' },
            { title: 'Transparent Pricing', desc: 'Fixed-fee, hourly, or retainer — you choose the model that works for you. No hidden costs, no surprise bills.' },
            { title: '24/7 Productivity', desc: 'The India time zone advantage means work continues while you sleep. Wake up to completed deliverables.' },
          ].map((d, i) => (
            <Card key={d.title} className="rise-in feature-card" style={{ animationDelay: `${100 + i * 80}ms` }}>
              <CardHeader><CardTitle className="text-base font-semibold text-[var(--charcoal)]">{d.title}</CardTitle></CardHeader>
              <CardContent><CardDescription className="text-sm text-[var(--charcoal-soft)]">{d.desc}</CardDescription></CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-14 sm:mt-20">
        <div className="mb-10">
          <Badge variant="outline" className="mb-3 rounded-full border-[var(--gold)]/30 px-3 py-1 text-[10px] tracking-[0.2em] text-[var(--gold)] uppercase">Our Journey</Badge>
          <h2 className="display-title text-3xl font-semibold tracking-tight text-[var(--charcoal)] sm:text-4xl">From Vision to Reality</h2>
        </div>
        <div className="relative">
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-[var(--line)] sm:left-1/2 sm:-translate-x-px" />
          <div className="space-y-8">
            {timelineEvents.map((event, i) => (
              <div key={event.year} className={`rise-in relative flex gap-6 sm:gap-0 ${i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`} style={{ animationDelay: `${100 + i * 80}ms` }}>
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[var(--gold)] bg-[var(--cream)] sm:absolute sm:left-1/2 sm:-translate-x-1/2">
                  <span className="h-3 w-3 rounded-full bg-[var(--gold)]" />
                </div>
                <div className={`pb-8 sm:w-1/2 ${i % 2 === 0 ? 'sm:pr-14 sm:text-right' : 'sm:pl-14'}`}>
                  <Card className="feature-card">
                    <CardHeader>
                      <Badge variant="outline" className="mb-1 w-fit rounded-full border-[var(--gold)]/30 text-[10px] tracking-wider text-[var(--gold)] uppercase">{event.year}</Badge>
                      <CardTitle className="text-base font-semibold text-[var(--charcoal)]">{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm text-[var(--charcoal-soft)]">{event.description}</CardDescription>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="island-shell mt-14 rounded-[2.5rem] px-6 py-12 text-center sm:mt-20 sm:px-12 sm:py-16">
        <h2 className="display-title mb-4 text-3xl font-semibold tracking-tight text-[var(--charcoal)] sm:text-4xl">Let's Build Something Great Together</h2>
        <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-[var(--charcoal-soft)] sm:text-base">
          Whether you're a solo practitioner or an AmLaw 100 firm, we have the expertise and scale to support your practice.
        </p>
        <Link to="/contact">
          <Button className="group cursor-pointer rounded-full bg-[var(--gold)] px-8 py-3 text-base font-semibold text-white shadow-[0_2px_12px_rgba(184,134,11,0.3)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[var(--gold-deep)] hover:shadow-[0_4px_18px_rgba(184,134,11,0.4)] active:scale-[0.97]">
            Get in Touch
            <span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15 transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </span>
          </Button>
        </Link>
      </section>
    </main>
  )
}
