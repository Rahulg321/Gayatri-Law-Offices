import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { teamMembers } from '#/lib/data'

export const Route = createFileRoute('/team')({
  head: () => ({
    meta: [
      { title: 'Our Team — Gayatri Law Offices' },
      { name: 'description', content: 'Meet the experienced legal professionals behind Gayatri Law Offices — leadership, research, and litigation support teams.' },
    ],
  }),
  component: TeamPage,
})

function TeamPage() {
  return (
    <main className="page-wrap px-4 pb-16 pt-28 sm:pt-32">
      <section className="text-center">
        <Badge variant="outline" className="mb-4 rounded-full border-[var(--gold)]/30 px-3 py-1 text-[10px] tracking-[0.2em] text-[var(--gold)] uppercase">Our Team</Badge>
        <h1 className="display-title mb-6 text-4xl leading-[1.06] font-semibold tracking-tight text-[var(--charcoal)] sm:text-5xl">Meet the People Behind Our Success</h1>
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-[var(--charcoal-soft)] sm:text-lg">
          A team of experienced legal professionals dedicated to delivering exceptional results for every client engagement.
        </p>
      </section>

      <section className="mt-12 grid gap-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
        {teamMembers.map((member, i) => (
          <Card key={member.name} className="feature-card rise-in text-center" style={{ animationDelay: `${i * 100}ms` }}>
            <CardHeader className="items-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--gold-pale)]">
                <span className="display-title text-2xl font-semibold text-[var(--gold)]">{member.initials}</span>
              </div>
              <CardTitle className="text-base font-semibold text-[var(--charcoal)]">{member.name}</CardTitle>
              <Badge variant="outline" className="rounded-full border-[var(--gold)]/30 text-[10px] tracking-wider text-[var(--gold)] uppercase">{member.role}</Badge>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm leading-relaxed text-[var(--charcoal-soft)]">{member.bio}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="island-shell mt-16 rounded-[2.5rem] px-6 py-12 text-center sm:px-12 sm:py-16">
        <h2 className="display-title mb-4 text-3xl font-semibold tracking-tight text-[var(--charcoal)] sm:text-4xl">Want to Join Our Team?</h2>
        <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-[var(--charcoal-soft)] sm:text-base">
          We're always looking for talented legal professionals to join our growing team in Mumbai and remotely.
        </p>
        <Link to="/contact">
          <Button className="group cursor-pointer rounded-full bg-[var(--gold)] px-8 py-3 text-base font-semibold text-white shadow-[0_2px_12px_rgba(184,134,11,0.3)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[var(--gold-deep)] active:scale-[0.97]">
            Send Your Resume
            <span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15 transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </span>
          </Button>
        </Link>
      </section>
    </main>
  )
}
