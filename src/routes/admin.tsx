import { Outlet, createFileRoute, redirect, useRouterState } from '@tanstack/react-router'
import { AdminShell } from '#/components/admin/AdminShell'
import { getAdminSession } from '#/lib/admin-auth'

export const Route = createFileRoute('/admin')({
  beforeLoad: async ({ location }) => {
    const isLogin = location.pathname === '/admin/login'
    const session = await getAdminSession()
    if (isLogin) {
      if (session) throw redirect({ to: '/admin' })
      return {}
    }
    if (!session) throw redirect({ to: '/admin/login' })
    return { session }
  },
  component: AdminLayout,
})

function AdminLayout() {
  const isLogin = useRouterState({
    select: (s) => s.location.pathname === '/admin/login',
  })
  const { session } = Route.useRouteContext()

  if (isLogin) {
    return <Outlet />
  }

  if (!session) return null

  return (
    <AdminShell user={session.user}>
      <Outlet />
    </AdminShell>
  )
}
