import { useEffect } from 'react'
import {
  Outlet,
  createFileRoute,
  redirect,
  useNavigate,
  useRouter,
  useRouterState,
} from '@tanstack/react-router'
import { AdminShell } from '#/components/admin/AdminShell'
import { getAdminSession } from '#/lib/admin-auth'
import { authClient } from '#/lib/auth-client'
import { applyAdminNoStoreHeaders } from '#/lib/cms-route-cache'

export const Route = createFileRoute('/admin')({
  staleTime: 0,
  loader: () => {
    applyAdminNoStoreHeaders()
    return {}
  },
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
  const navigate = useNavigate()
  const router = useRouter()
  const isLogin = useRouterState({
    select: (s) => s.location.pathname === '/admin/login',
  })
  const { session } = Route.useRouteContext()
  const { data: clientSession, isPending } = authClient.useSession()

  useEffect(() => {
    if (isLogin || isPending || clientSession) return
    void router.invalidate().then(() => {
      void navigate({ to: '/admin/login', replace: true })
    })
  }, [clientSession, isLogin, isPending, navigate, router])

  if (isLogin) {
    return <Outlet />
  }

  if (!session || (!isPending && !clientSession)) return null

  return (
    <AdminShell user={session.user}>
      <Outlet />
    </AdminShell>
  )
}
