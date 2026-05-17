import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { timelineEvents } from '#/lib/data'

export const Route = createFileRoute('/timeline')({
  head: () => ({
    meta: [
      { title: 'Our Journey — Timeline | Gayatri Law Offices' },
      { name: 'description', content: 'Follow the growth story of Gayatri Law Offices from founding to becoming one of India\'s trusted LPO providers.' },
    ],
  }),
  component: TimelinePage,
})

function TimelinePage() {
  return (
    <main className="page-wrap px-4 pb-16 pt-28 sm:pt-32">
      <section className="text-center">
        <Badge variant="outline" className="mb-4 rounded-full border-[var(--gold)]/30 px-3 py-1 text-[10px] tracking-[0.2em] text-[var(--gold)] uppercase">Our Journey</Badge>
        <h1 className="display-title mb-6 text-4xl leading-[1.06] font-semibold tracking-tight text-[var(--charcoal)] sm:text-5xl">The Gayatri Law Offices Story</h1>
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-[var(--charcoal-soft)] sm:text-lg">
          From a vision to reality — follow our journey from a startup in Mumbai to one of India's most trusted boutique LPO providers.
        </p>
      </section>

      <section className="relative mt-14 sm:mt-20">
        <div className="absolute left-[19px] top-0 bottom-0 w-px bg-[var(--line)] sm:left-1/2 sm:-translate-x-px" />
        <div className="space-y-10">
          {timelineEvents.map((event, i) => (
            <div key={event.year} className={`rise-in relative flex gap-6 sm:gap-0 ${i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`} style={{ animationDelay: `${i * 80}ms` }}>
              <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[var(--gold)] bg-[var(--cream)] sm:absolute sm:left-1/2 sm:-translate-x-1/2">
                <span className="h-3 w-3 rounded-full bg-[var(--gold)]" />
              </div>
              <div className={`pb-10 sm:w-1/2 ${i % 2 === 0 ? 'sm:pr-14 sm:text-right' : 'sm:pl-14'}`}>
                <Card className="feature-card">
                  <CardHeader>
                    <Badge variant="outline" className="mb-1 w-fit rounded-full border-[var(--gold)]/30 text-[10px] tracking-wider text-[var(--gold)] uppercase">{event.year}</Badge>
                    <CardTitle className="text-lg font-semibold text-[var(--charcoal)]">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm text-[var(--charcoal-soft)]">{event.description}</CardDescription>
                  </CardContent>
                </Card>
              </div>
              {i < timelineEvents.length - 1 && (
                <div className={`hidden sm:block absolute left-1/2 -translate-x-1/2 top-10 h-[calc(100%+2.5rem)] w-px bg-[var(--line)]`} />
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="island-shell mt-16 rounded-[2.5rem] px-6 py-12 text-center sm:px-12 sm:py-16">
        <h2 className="display-title mb-4 text-3xl font-semibold tracking-tight text-[var(--charcoal)] sm:text-4xl">Be Part of Our Next Chapter</h2>
        <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-[var(--charcoal-soft)] sm:text-base">
          Join the growing number of law firms that trust Gayatri Law Offices with their most important work.
        </p>
        <Link to="/contact">
          <button className="group cursor-pointer inline-flex items-center gap-2 rounded-full bg-[var(--gold)] px-8 py-3 text-base font-semibold text-white shadow-[0_2px_12px_rgba(184,134,11,0.3)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[var(--gold-deep)] hover:shadow-[0_4px_18px_rgba(184,134,11,0.4)] active:scale-[0.97]">
            Get in Touch
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15 transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </span>
          </button>
        </Link>
      </section>
    </main>
  )
}
