import { createFileRoute } from '@tanstack/react-router'
import { WhyUsPage } from '#/features/marketing/components/WhyUsPage'

export const Route = createFileRoute('/why-us')({
  head: () => ({
    meta: [
      { title: 'Why Choose Gayatri Law Offices — Benefits & Process' },
      { name: 'description', content: 'Discover why 150+ law firms choose Gayatri Law Offices for legal process outsourcing. Cost savings, quality, security, and a proven delivery process.' },
    ],
  }),
  component: WhyUsPage,
})
