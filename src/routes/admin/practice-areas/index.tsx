import { createFileRoute } from '@tanstack/react-router'
import { AdminPracticeAreasListPage } from '#/features/practice-areas/components/AdminPracticeAreasListPage'
import { adminListPracticeAreas } from '#/features/practice-areas/server/queries/admin-list-practice-areas'

export const Route = createFileRoute('/admin/practice-areas/')({
  loader: () => adminListPracticeAreas(),
  component: AdminPracticeAreasRoute,
})

function AdminPracticeAreasRoute() {
  const items = Route.useLoaderData()
  return <AdminPracticeAreasListPage items={items} />
}
