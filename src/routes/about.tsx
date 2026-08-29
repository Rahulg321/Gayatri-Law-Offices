import { createFileRoute } from '@tanstack/react-router'
import { AboutPage } from '#/features/marketing/components/AboutPage'

export const Route = createFileRoute('/about')({
  head: () => ({
    meta: [
      { title: 'About Gayatri Legal Solutions — Our Story & Mission' },
      { name: 'description', content: 'Learn about Gayatri Legal Solutions — our founding story, mission, values, and the team behind India\'s trusted legal process outsourcing provider.' },
      { property: 'og:title', content: 'About Gayatri Legal Solutions — Our Story & Mission' },
    ],
  }),
  component: AboutPage,
})
