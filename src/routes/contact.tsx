import { createFileRoute } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Textarea } from '#/components/ui/textarea'
import { Label } from '#/components/ui/label'
import { Badge } from '#/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '#/components/ui/accordion'
import { services as servicesData } from '#/lib/data'

export const Route = createFileRoute('/contact')({
  head: () => ({
    meta: [
      { title: 'Contact Us — Get a Free Quote | Gayatri Law Offices' },
      { name: 'description', content: 'Get in touch for a free consultation and quote. Contact Gayatri Law Offices for contract drafting, document review, litigation support, and more.' },
    ],
  }),
  component: ContactPage,
})

function ContactPage() {
  return (
    <main className="page-wrap px-4 pb-16 pt-28 sm:pt-32">
      <section className="text-center">
        <Badge variant="outline" className="mb-4 rounded-full border-[var(--gold)]/30 px-3 py-1 text-[10px] tracking-[0.2em] text-[var(--gold)] uppercase">Get in Touch</Badge>
        <h1 className="display-title mb-6 text-4xl leading-[1.06] font-semibold tracking-tight text-[var(--charcoal)] sm:text-5xl">Let's Discuss Your Needs</h1>
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-[var(--charcoal-soft)] sm:text-lg">
          Whether you need a one-time project or ongoing support, we are here to help. Reach out for a free consultation and customized quote.
        </p>
      </section>

      <section className="mt-12 grid gap-8 sm:mt-16 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="feature-card">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-[var(--charcoal)]">Send Us a Message</CardTitle>
              <CardDescription className="text-sm">Fill out the form below and we'll get back to you within 24 hours.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs font-semibold text-[var(--charcoal)]">Full Name *</Label>
                    <Input id="name" placeholder="John Doe" className="rounded-xl border-[var(--line)] text-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-semibold text-[var(--charcoal)]">Email Address *</Label>
                    <Input id="email" type="email" placeholder="john@lawfirm.com" className="rounded-xl border-[var(--line)] text-sm" />
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-xs font-semibold text-[var(--charcoal)]">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" className="rounded-xl border-[var(--line)] text-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="firm" className="text-xs font-semibold text-[var(--charcoal)]">Law Firm / Company</Label>
                    <Input id="firm" placeholder="Your Law Firm" className="rounded-xl border-[var(--line)] text-sm" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="service" className="text-xs font-semibold text-[var(--charcoal)]">Service Interested In *</Label>
                  <select id="service" className="w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-sm text-[var(--charcoal)]">
                    <option value="">Select a service...</option>
                    {servicesData.map((s) => (
                      <option key={s.slug} value={s.slug}>{s.title}</option>
                    ))}
                    <option value="other">Other / Multiple Services</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-xs font-semibold text-[var(--charcoal)]">Message *</Label>
                  <Textarea id="message" placeholder="Tell us about your project, timeline, and requirements..." className="min-h-32 rounded-xl border-[var(--line)] text-sm" />
                </div>
                <Button type="submit" className="w-full cursor-pointer rounded-full bg-[var(--gold)] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_2px_12px_rgba(184,134,11,0.3)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[var(--gold-deep)] sm:w-auto">
                  Submit Inquiry
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="feature-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[var(--charcoal)]">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="font-semibold text-[var(--charcoal)]">Email</p>
                <p className="text-[var(--charcoal-soft)]">info@gayatrilawoffices.com</p>
              </div>
              <div>
                <p className="font-semibold text-[var(--charcoal)]">Phone</p>
                <p className="text-[var(--charcoal-soft)]">+91 98765 43210</p>
              </div>
              <div>
                <p className="font-semibold text-[var(--charcoal)]">WhatsApp</p>
                <p className="text-[var(--charcoal-soft)]">+91 98765 43210</p>
              </div>
              <div>
                <p className="font-semibold text-[var(--charcoal)]">Office</p>
                <p className="text-[var(--charcoal-soft)]">Mumbai, Maharashtra, India</p>
              </div>
              <div>
                <p className="font-semibold text-[var(--charcoal)]">Hours</p>
                <p className="text-[var(--charcoal-soft)]">Monday-Friday: 9:00 AM – 6:00 PM IST<br />Extended hours for US/UK time zones</p>
              </div>
            </CardContent>
          </Card>

          <Card className="feature-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[var(--charcoal)]">Quick Answers</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                <AccordionItem value="response-time" className="border-[var(--line)]">
                  <AccordionTrigger className="text-sm font-medium text-[var(--charcoal)] hover:text-[var(--gold)]">How quickly will I get a response?</AccordionTrigger>
                  <AccordionContent className="text-xs text-[var(--charcoal-soft)]">We respond to all inquiries within 24 hours. Urgent requests are prioritized and typically addressed within 4-6 hours.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="nda" className="border-[var(--line)]">
                  <AccordionTrigger className="text-sm font-medium text-[var(--charcoal)] hover:text-[var(--gold)]">Do you sign NDAs?</AccordionTrigger>
                  <AccordionContent className="text-xs text-[var(--charcoal-soft)]">Yes, we sign comprehensive NDAs and confidentiality agreements before any engagement begins. We can work within your existing framework.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="pilot" className="border-[var(--line)]">
                  <AccordionTrigger className="text-sm font-medium text-[var(--charcoal)] hover:text-[var(--gold)]">Can we start with a trial project?</AccordionTrigger>
                  <AccordionContent className="text-xs text-[var(--charcoal-soft)]">Absolutely. We encourage starting with a pilot engagement so you can experience our quality and process firsthand.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
