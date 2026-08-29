import { createFileRoute } from '@tanstack/react-router'
import { TermsPage } from '#/features/marketing/components/TermsPage'

export const Route = createFileRoute('/terms')({
  head: () => ({
    meta: [
      { title: 'Terms of Service — Gayatri Legal Solutions' },
      { name: 'description', content: 'Terms of Service for Gayatri Legal Solutions — website usage and service engagement terms.' },
    ],
  }),
  component: TermsPage,
})
