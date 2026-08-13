import { createFileRoute } from '@tanstack/react-router'
import { TestimonialsPage } from '#/features/marketing/components/TestimonialsPage'

export const Route = createFileRoute('/testimonials')({
  head: () => ({
    meta: [
      { title: 'Client Testimonials & Case Studies — Gayatri Law Offices' },
      { name: 'description', content: 'See what 150+ law firms say about Gayatri Law Offices. Real testimonials and case studies from our LPO clients worldwide.' },
    ],
  }),
  component: TestimonialsPage,
})
