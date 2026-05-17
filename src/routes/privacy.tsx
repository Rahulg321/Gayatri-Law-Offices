import { createFileRoute } from '@tanstack/react-router'
import { Badge } from '#/components/ui/badge'

export const Route = createFileRoute('/privacy')({
  head: () => ({
    meta: [
      { title: 'Privacy Policy — Gayatri Law Offices' },
      { name: 'description', content: 'Privacy Policy for Gayatri Law Offices — how we collect, use, and protect your personal information.' },
    ],
  }),
  component: PrivacyPage,
})

function PrivacyPage() {
  return (
    <main className="page-wrap px-4 pb-16 pt-28 sm:pt-32">
      <section className="mx-auto max-w-3xl">
        <Badge variant="outline" className="mb-4 rounded-full border-[var(--gold)]/30 px-3 py-1 text-[10px] tracking-[0.2em] text-[var(--gold)] uppercase">Legal</Badge>
        <h1 className="display-title mb-8 text-4xl leading-[1.06] font-semibold tracking-tight text-[var(--charcoal)] sm:text-5xl">Privacy Policy</h1>
        <p className="mb-4 text-sm text-[var(--slate-soft)]">Last updated: May 2026</p>

        <div className="prose prose-lg max-w-none text-[var(--charcoal-soft)] space-y-6">
          <p>Gayatri Law Offices ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.</p>

          <h2 className="display-title text-2xl font-semibold text-[var(--charcoal)]">1. Information We Collect</h2>
          <p>We may collect information that you voluntarily provide when you fill out contact forms, request quotes, or communicate with us. This includes your name, email address, phone number, law firm name, and details about your project requirements.</p>

          <h2 className="display-title text-2xl font-semibold text-[var(--charcoal)]">2. How We Use Your Information</h2>
          <p>We use your information to respond to inquiries, provide requested services, communicate about your engagement, and improve our website and services. We do not sell, trade, or rent your personal information to third parties.</p>

          <h2 className="display-title text-2xl font-semibold text-[var(--charcoal)]">3. Data Security</h2>
          <p>We implement industry-standard security measures including encryption, access controls, and secure data handling protocols. Our operations are ISO 27001 certified. Client documents and communications are protected through comprehensive confidentiality agreements.</p>

          <h2 className="display-title text-2xl font-semibold text-[var(--charcoal)]">4. GDPR Compliance</h2>
          <p>For clients in the European Union, we comply with GDPR requirements including data minimization, purpose limitation, and your rights to access, correct, or delete personal data. We maintain GDPR-compliant data processing agreements and secure cross-border transfer mechanisms.</p>

          <h2 className="display-title text-2xl font-semibold text-[var(--charcoal)]">5. Cookies</h2>
          <p>Our website may use essential cookies for functionality and analytics. You can control cookie preferences through your browser settings. We do not use cookies for advertising or tracking purposes.</p>

          <h2 className="display-title text-2xl font-semibold text-[var(--charcoal)]">6. Contact Us</h2>
          <p>For questions about this Privacy Policy or to exercise your data rights, please contact us at info@gayatrilawoffices.com.</p>
        </div>
      </section>
    </main>
  )
}
