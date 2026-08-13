import { createFileRoute } from '@tanstack/react-router'
import { AdminProjectEditPage } from '#/features/projects/components/AdminProjectEditPage'
import { adminGetProject } from '#/features/projects/server/queries/admin-list-projects'

export const Route = createFileRoute('/admin/projects/$slug')({
  loader: ({ params }) =>
    params.slug === 'new' ? null : adminGetProject({ data: params.slug }),
  component: AdminProjectEditRoute,
})

function AdminProjectEditRoute() {
  const { slug } = Route.useParams()
  const initial = Route.useLoaderData()
  return <AdminProjectEditPage slug={slug} initial={initial} />
}
