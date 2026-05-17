import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/resources/$slug')({
  beforeLoad: ({ params }) => {
    throw redirect({ to: '/blogs/$slug', params: { slug: params.slug } })
  },
})
