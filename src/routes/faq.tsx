import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '#/components/ui/accordion'
import { faqs } from '#/lib/data'

export const Route = createFileRoute('/faq')({
  head: () => ({
    meta: [
      { title: 'FAQ — Gayatri Law Offices' },
      { name: 'description', content: 'Frequently asked questions about legal process outsourcing, our services, security, and engagement process.' },
    ],
  }),
  component: FAQPage,
})

function FAQPage() {
  return (
    <main className="page-wrap px-4 pb-16 pt-28 sm:pt-32">
      <section className="text-center">
        <Badge variant="outline" className="mb-4 rounded-full border-[var(--gold)]/30 px-3 py-1 text-[10px] tracking-[0.2em] text-[var(--gold)] uppercase">FAQ</Badge>
        <h1 className="display-title mb-6 text-4xl leading-[1.06] font-semibold tracking-tight text-[var(--charcoal)] sm:text-5xl">Frequently Asked Questions</h1>
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-[var(--charcoal-soft)] sm:text-lg">
          Everything you need to know about working with Gayatri Law Offices.
        </p>
      </section>

      <section className="mx-auto mt-12 max-w-3xl space-y-8 sm:mt-16">
        {faqs.map((group, gi) => (
          <Card key={group.category} className="feature-card">
            <CardHeader>
              <Badge variant="outline" className="mb-2 w-fit rounded-full border-[var(--gold)]/30 text-[10px] tracking-wider text-[var(--gold)] uppercase">{group.category}</Badge>
              <CardTitle className="display-title text-xl font-semibold text-[var(--charcoal)]">{group.category}</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {group.items.map((item, idx) => (
                  <AccordionItem key={idx} value={`${gi}-${idx}`} className="border-[var(--line)]">
                    <AccordionTrigger className="text-left text-sm font-semibold text-[var(--charcoal)] hover:text-[var(--gold)] transition-colors">{item.q}</AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-[var(--charcoal-soft)]">{item.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  )
}
