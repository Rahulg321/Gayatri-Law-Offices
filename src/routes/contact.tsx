import { createFileRoute } from '@tanstack/react-router'
import { ContactPage } from '#/features/marketing/components/ContactPage'

export const Route = createFileRoute('/contact')({
  head: () => ({
    meta: [
      { title: 'Contact Us — Get a Free Quote | Gayatri Legal Solutions' },
      { name: 'description', content: 'Get in touch for a free consultation and quote. Contact Gayatri Legal Solutions for contract drafting, document review, litigation support, and more.' },
    ],
  }),
  component: ContactPage,
})
