import { createFileRoute } from '@tanstack/react-router'
import { PrivacyPage } from '#/features/marketing/components/PrivacyPage'

export const Route = createFileRoute('/privacy')({
  head: () => ({
    meta: [
      { title: 'Privacy Policy — Gayatri Law Offices' },
      { name: 'description', content: 'Privacy Policy for Gayatri Law Offices — how we collect, use, and protect your personal information.' },
    ],
  }),
  component: PrivacyPage,
})
