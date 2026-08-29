import { Link } from '@tanstack/react-router'
import { Separator } from '#/components/ui/separator'
import { SITE_NAME } from '#/lib/site'

const QUICK_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/services', label: 'Services' },
  { to: '/why-us', label: 'Why Choose Us' },
  { to: '/testimonials', label: 'Testimonials' },
  { to: '/projects', label: 'Projects' },
  { to: '/blogs', label: 'Blogs' },
  { to: '/contact', label: 'Contact' },
]

const SERVICES = [
  { slug: 'litigation-support', label: 'Litigation Support' },
  { slug: 'document-review', label: 'eDiscovery & Document Review' },
  { slug: 'court-filing-docket-support', label: 'Court Filing & Docket Support' },
  { slug: 'discovery-support', label: 'Discovery Support' },
  { slug: 'document-production', label: 'Document Production' },
  { slug: 'legal-research-case-support', label: 'Legal Research & Case Support' },
  { slug: 'case-legal-operations', label: 'Case & Legal Operations' },
  { slug: 'legal-transcription-records', label: 'Legal Transcription & Records' },
  { slug: 'legal-website-technology-support', label: 'Legal Website & Technology Support' },
]

const LEGAL_LINKS = [
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms of Service' },
  { to: '/faq', label: 'FAQ' },
]

const SOCIAL_LINKS = [
  { href: 'https://www.linkedin.com/company/gayatri-legal-solutions/', label: 'LinkedIn', icon: 'in' },
  { href: 'linkedin.com/in/gayatri-gupta-377060233', label: 'X (Twitter)', icon: '𝕏' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer mt-24 px-4 pb-12 pt-14 text-[var(--charcoal-soft)] sm:pt-18">
      <div className="page-wrap grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-base font-semibold text-[var(--charcoal)] no-underline"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-[linear-gradient(135deg,var(--gold),var(--gold-light))]" />
            {SITE_NAME}
          </Link>
          <p className="mt-3 text-sm leading-relaxed">
            Expert legal process outsourcing services from India. Cost-effective, high-quality support for law firms and legal departments worldwide.
          </p>
          <div className="mt-4 flex gap-3">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] text-sm font-semibold text-[var(--charcoal-soft)] no-underline transition-colors hover:border-[var(--gold)] hover:text-[var(--gold)]"
                aria-label={s.label}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-semibold tracking-[0.15em] text-[var(--charcoal)] uppercase">
            Quick Links
          </h3>
          <ul className="space-y-2.5">
            {QUICK_LINKS.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-sm text-[var(--charcoal-soft)] no-underline transition-colors hover:text-[var(--gold)]"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-semibold tracking-[0.15em] text-[var(--charcoal)] uppercase">
            Our Services
          </h3>
          <ul className="space-y-2.5">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link
                  to="/services/$slug"
                  params={{ slug: s.slug }}
                  className="text-sm text-[var(--charcoal-soft)] no-underline transition-colors hover:text-[var(--gold)]"
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-semibold tracking-[0.15em] text-[var(--charcoal)] uppercase">
            Legal
          </h3>
          <ul className="space-y-2.5">
            {LEGAL_LINKS.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-sm text-[var(--charcoal-soft)] no-underline transition-colors hover:text-[var(--gold)]"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-5 space-y-1.5 text-sm">
            <p className="text-[var(--charcoal-soft)]">info@gayatrilawoffices.com</p>
            <p className="text-[var(--charcoal-soft)]">+91 09876 54321</p>
            <p className="text-[var(--charcoal-soft)]">Ludhiana, India</p>
          </div>
        </div>
      </div>

      <Separator className="page-wrap mt-10 mb-5" />

      <div className="page-wrap flex flex-col items-center justify-between gap-3 text-center text-xs sm:flex-row">
        <p className="m-0 text-[var(--slate-soft)]">
          &copy; {year} {SITE_NAME}. All rights reserved.
        </p>
        <p className="m-0 text-[var(--slate-soft)]">
          Confidentiality guaranteed. NDAs standard on all engagements.
        </p>
      </div>
    </footer>
  )
}
