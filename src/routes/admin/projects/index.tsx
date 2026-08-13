import { createFileRoute } from '@tanstack/react-router'
import { AdminProjectsListPage } from '#/features/projects/components/AdminProjectsListPage'
import { adminListProjects } from '#/features/projects/server/queries/admin-list-projects'

export const Route = createFileRoute('/admin/projects/')({
  loader: () => adminListProjects(),
  component: AdminProjectsRoute,
})

function AdminProjectsRoute() {
  const items = Route.useLoaderData()
  return <AdminProjectsListPage items={items} />
}
