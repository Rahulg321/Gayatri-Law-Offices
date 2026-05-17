import { createFileRoute } from '@tanstack/react-router'
import { Badge } from '#/components/ui/badge'

export const Route = createFileRoute('/terms')({
  head: () => ({
    meta: [
      { title: 'Terms of Service — Gayatri Law Offices' },
      { name: 'description', content: 'Terms of Service for Gayatri Law Offices — website usage and service engagement terms.' },
    ],
  }),
  component: TermsPage,
})

function TermsPage() {
  return (
    <main className="page-wrap px-4 pb-16 pt-28 sm:pt-32">
      <section className="mx-auto max-w-3xl">
        <Badge variant="outline" className="mb-4 rounded-full border-[var(--gold)]/30 px-3 py-1 text-[10px] tracking-[0.2em] text-[var(--gold)] uppercase">Legal</Badge>
        <h1 className="display-title mb-8 text-4xl leading-[1.06] font-semibold tracking-tight text-[var(--charcoal)] sm:text-5xl">Terms of Service</h1>
        <p className="mb-4 text-sm text-[var(--slate-soft)]">Last updated: May 2026</p>

        <div className="prose prose-lg max-w-none text-[var(--charcoal-soft)] space-y-6">
          <p>These Terms of Service ("Terms") govern your use of the Gayatri Law Offices website and services. By accessing our website or engaging our services, you agree to these Terms.</p>

          <h2 className="display-title text-2xl font-semibold text-[var(--charcoal)]">1. No Attorney-Client Relationship</h2>
          <p>Use of this website or submission of an inquiry does not create an attorney-client relationship. Gayatri Law Offices provides legal support and outsourcing services to licensed attorneys and law firms. We do not provide legal advice directly to end clients.</p>

          <h2 className="display-title text-2xl font-semibold text-[var(--charcoal)]">2. Service Engagements</h2>
          <p>All service engagements are governed by a separate written agreement that includes scope of work, deliverables, fees, confidentiality provisions, and other terms specific to the engagement.</p>

          <h2 className="display-title text-2xl font-semibold text-[var(--charcoal)]">3. Confidentiality</h2>
          <p>Client confidentiality is paramount. We execute comprehensive NDAs and confidentiality agreements for all engagements. Client information, documents, and work product are treated as strictly confidential.</p>

          <h2 className="display-title text-2xl font-semibold text-[var(--charcoal)]">4. Disclaimer</h2>
          <p>The information on this website is for general informational purposes only and does not constitute legal advice. While we strive for accuracy, we make no representations or warranties about the completeness or accuracy of the content.</p>

          <h2 className="display-title text-2xl font-semibold text-[var(--charcoal)]">5. Limitation of Liability</h2>
          <p>To the fullest extent permitted by applicable law, Gayatri Law Offices shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of this website.</p>

          <h2 className="display-title text-2xl font-semibold text-[var(--charcoal)]">6. Governing Law</h2>
          <p>These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.</p>

          <h2 className="display-title text-2xl font-semibold text-[var(--charcoal)]">7. Contact</h2>
          <p>For questions about these Terms, please contact us at info@gayatrilawoffices.com.</p>
        </div>
      </section>
    </main>
  )
}
