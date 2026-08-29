import { faqs, processSteps, services, stats, testimonials, timelineEvents } from '#/lib/data'
import { HOME_H1, HOME_NOSCRIPT_TEXT } from '#/features/marketing/home-content'
import {
  ABOUT_INTRO,
  CONTACT_INTRO,
  PRIVACY_BODY,
} from '#/features/marketing/trust-copy'
import { SITE_CANONICAL_ORIGIN, SITE_EMAIL, SITE_NAME, SITE_PHONE } from '#/lib/site'

export function markdownForStaticPath(pathname: string): string | null {
  const path = pathname.replace(/\/+$/, '') || '/'
  switch (path) {
    case '/':
      return homeMarkdown()
    case '/about':
      return aboutMarkdown()
    case '/contact':
      return contactMarkdown()
    case '/privacy':
      return privacyMarkdown()
    case '/terms':
      return termsMarkdown()
    case '/faq':
      return faqMarkdown()
    case '/why-us':
      return whyUsMarkdown()
    case '/testimonials':
      return testimonialsMarkdown()
    case '/timeline':
      return timelineMarkdown()
    case '/services':
      return servicesIndexMarkdown()
    case '/projects':
      return '# Projects\n\nPublished portfolio engagements of Gayatri Legal Solutions.\n'
    case '/blogs':
      return '# Blog\n\nInsights on legal process outsourcing from Gayatri Legal Solutions.\n'
    case '/team':
      return `# Team\n\nLeadership and delivery teams at ${SITE_NAME}. Contact ${SITE_EMAIL} or see /about.\n`
    default:
      return null
  }
}

function homeMarkdown(): string {
  const serviceLines = services
    .slice(0, 8)
    .map((s) => `- **${s.title}**: ${s.short}`)
    .join('\n')
  const testimonialLines = testimonials
    .slice(0, 3)
    .map((t) => `> ${t.quote}\n>\n> — ${t.author}, ${t.title}, ${t.firm}`)
    .join('\n\n')
  const statLines = stats.map((s) => `- ${s.value} ${s.label}`).join('\n')
  return `# ${HOME_H1}

${HOME_NOSCRIPT_TEXT}

## Snapshot

${statLines}

## Services

${serviceLines}

## Testimonials

${testimonialLines}
`
}

function aboutMarkdown(): string {
  const timeline = timelineEvents.map((e) => `- **${e.year} — ${e.title}**: ${e.description}`).join('\n')
  return `# About ${SITE_NAME}

${ABOUT_INTRO}

## Timeline

${timeline}
`
}

function contactMarkdown(): string {
  return `# Contact ${SITE_NAME}

${CONTACT_INTRO}

- Email: ${SITE_EMAIL}
- Phone: ${SITE_PHONE}
- Office: Ludhiana, Punjab, India
- Hours: Monday–Friday 9:00 AM – 6:00 PM IST, with extended coverage for US/UK time zones
- Consultation: ${SITE_CANONICAL_ORIGIN}/contact
`
}

function privacyMarkdown(): string {
  return `# Privacy Policy

${PRIVACY_BODY}
`
}

function termsMarkdown(): string {
  return `# Terms of Service

Use of gayatrilegalsolutions.com and engagements with ${SITE_NAME} are subject to a written scope of work, confidentiality (NDA), and professional-responsibility limits. ${SITE_NAME} provides legal process support; it does not appear as attorney of record unless a separate engagement says otherwise. Questions: ${SITE_EMAIL}.
`
}

function faqMarkdown(): string {
  const blocks = faqs
    .map((group) => {
      const items = group.items.map((i) => `### ${i.q}\n\n${i.a}`).join('\n\n')
      return `## ${group.category}\n\n${items}`
    })
    .join('\n\n')
  return `# Frequently Asked Questions\n\n${blocks}\n`
}

function whyUsMarkdown(): string {
  const steps = processSteps.map((s) => `${s.step}. **${s.title}** — ${s.description}`).join('\n')
  return `# Why ${SITE_NAME}

Law firms choose ${SITE_NAME} for confidential, attorney-directed legal process outsourcing from India: litigation support, document review, research, and corporate diligence at a lower cost than expanding headcount.

## Delivery process

${steps}
`
}

function testimonialsMarkdown(): string {
  const items = testimonials
    .map((t) => `## ${t.author}\n\n${t.quote}\n\n${t.title}, ${t.firm}. ${t.metrics}.`)
    .join('\n\n')
  return `# Testimonials\n\n${items}\n`
}

function timelineMarkdown(): string {
  const items = timelineEvents.map((e) => `## ${e.year} — ${e.title}\n\n${e.description}`).join('\n\n')
  return `# Timeline\n\n${items}\n`
}

function servicesIndexMarkdown(): string {
  const items = services.map((s) => `## ${s.title}\n\n${s.description}\n`).join('\n')
  return `# LPO Services\n\n${items}`
}
