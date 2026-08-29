import { createFileRoute } from '@tanstack/react-router'
import { WhyUsPage } from '#/features/marketing/components/WhyUsPage'

export const Route = createFileRoute('/why-us')({
  head: () => ({
    meta: [
      { title: 'Why Choose Gayatri Legal Solutions — Benefits & Process' },
      { name: 'description', content: 'Discover why 150+ law firms choose Gayatri Legal Solutions for legal process outsourcing. Cost savings, quality, security, and a proven delivery process.' },
    ],
  }),
  component: WhyUsPage,
})
