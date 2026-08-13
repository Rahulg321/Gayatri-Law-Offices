import { createFileRoute } from '@tanstack/react-router'
import { AdminLoginPage } from '#/features/auth/components/AdminLoginPage'

export const Route = createFileRoute('/admin/login')({
  validateSearch: (search: Record<string, unknown>) => ({
    error: typeof search.error === 'string' ? search.error : undefined,
    error_description:
      typeof search.error_description === 'string' ? search.error_description : undefined,
  }),
  component: AdminLoginRoute,
})

function AdminLoginRoute() {
  const { error, error_description } = Route.useSearch()
  return <AdminLoginPage error={error} error_description={error_description} />
}
