import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { AdminShell } from "#/features/admin/components/AdminShell";
import { getAdminSession } from "#/features/auth/server/queries/get-admin-session";
import { applyAdminNoStoreHeaders } from "#/lib/cms-route-cache";

export const Route = createFileRoute("/admin")({
  staleTime: 0,
  loader: () => {
    applyAdminNoStoreHeaders();
    return {};
  },
  beforeLoad: async ({ location }) => {
    const isLogin = location.pathname === "/admin/login";
    const session = await getAdminSession();
    if (isLogin) {
      if (session) throw redirect({ to: "/admin" });
      return {};
    }
    if (!session)
      throw redirect({
        to: "/admin/login",
        search: { error: undefined, error_description: undefined },
      });
    return { session };
  },
  component: AdminLayout,
});

function AdminLayout() {
  const { session } = Route.useRouteContext();

  if (!session) {
    return <Outlet />;
  }

  return (
    <AdminShell user={session.user}>
      <Outlet />
    </AdminShell>
  );
}
