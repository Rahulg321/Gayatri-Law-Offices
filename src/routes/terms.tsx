import { createFileRoute } from '@tanstack/react-router'
import { TermsPage } from '#/features/marketing/components/TermsPage'

export const Route = createFileRoute('/terms')({
  head: () => ({
    meta: [
      { title: 'Terms of Service — Gayatri Law Offices' },
      { name: 'description', content: 'Terms of Service for Gayatri Law Offices — website usage and service engagement terms.' },
    ],
  }),
  component: TermsPage,
})
