import { createFileRoute } from '@tanstack/react-router'
import { FAQPage } from '#/features/marketing/components/FAQPage'

export const Route = createFileRoute('/faq')({
  head: () => ({
    meta: [
      { title: 'FAQ — Gayatri Law Offices' },
      { name: 'description', content: 'Frequently asked questions about legal process outsourcing, our services, security, and engagement process.' },
    ],
  }),
  component: FAQPage,
})
