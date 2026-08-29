import { createFileRoute } from '@tanstack/react-router'
import { TestimonialsPage } from '#/features/marketing/components/TestimonialsPage'

export const Route = createFileRoute('/testimonials')({
  head: () => ({
    meta: [
      { title: 'Client Testimonials & Case Studies — Gayatri Legal Solutions' },
      { name: 'description', content: 'See what 150+ law firms say about Gayatri Legal Solutions. Real testimonials and case studies from our LPO clients worldwide.' },
    ],
  }),
  component: TestimonialsPage,
})
