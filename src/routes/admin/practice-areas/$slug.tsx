import { createFileRoute } from '@tanstack/react-router'
import { AdminPracticeAreaEditPage } from '#/features/practice-areas/components/AdminPracticeAreaEditPage'
import { adminGetPracticeArea } from '#/features/practice-areas/server/queries/admin-list-practice-areas'

export const Route = createFileRoute('/admin/practice-areas/$slug')({
  loader: ({ params }) =>
    params.slug === 'new' ? null : adminGetPracticeArea({ data: params.slug }),
  component: AdminPracticeAreaEditRoute,
})

function AdminPracticeAreaEditRoute() {
  const { slug } = Route.useParams()
  const initial = Route.useLoaderData()
  return <AdminPracticeAreaEditPage slug={slug} initial={initial} />
}
