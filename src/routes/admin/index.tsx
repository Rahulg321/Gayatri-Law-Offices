import { createFileRoute } from '@tanstack/react-router'
import { AdminDashboardPage } from '#/features/admin/components/AdminDashboardPage'

export const Route = createFileRoute('/admin/')({
  component: AdminDashboardPage,
})
