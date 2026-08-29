import { createFileRoute } from '@tanstack/react-router'
import { TeamPage } from '#/features/marketing/components/TeamPage'

export const Route = createFileRoute('/team')({
  head: () => ({
    meta: [
      { title: 'Our Team — Gayatri Legal Solutions' },
      { name: 'description', content: 'Meet the experienced legal professionals behind Gayatri Legal Solutions — leadership, research, and litigation support teams.' },
    ],
  }),
  component: TeamPage,
})
