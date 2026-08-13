import { createFileRoute } from '@tanstack/react-router'
import { TeamPage } from '#/features/marketing/components/TeamPage'

export const Route = createFileRoute('/team')({
  head: () => ({
    meta: [
      { title: 'Our Team — Gayatri Law Offices' },
      { name: 'description', content: 'Meet the experienced legal professionals behind Gayatri Law Offices — leadership, research, and litigation support teams.' },
    ],
  }),
  component: TeamPage,
})
