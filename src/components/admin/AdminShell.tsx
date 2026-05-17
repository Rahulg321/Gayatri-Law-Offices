import { Link, useRouterState } from '@tanstack/react-router'
import { LogOut } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { authClient } from '#/lib/auth-client'
import { cn } from '#/lib/utils'

const nav = [
  { to: '/admin', label: 'Dashboard', exact: true },
  { to: '/admin/practice-areas', label: 'Practice areas' },
  { to: '/admin/blogs', label: 'Blogs' },
  { to: '/admin/projects', label: 'Projects' },
] as const

export function AdminShell({
  children,
  user,
}: {
  children: React.ReactNode
  user: { name: string; email: string }
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <div className="min-h-screen bg-[#f6f4f0] text-[var(--charcoal)]">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <aside className="hidden w-56 shrink-0 border-r border-[var(--line)] bg-white p-6 md:block">
          <p className="mb-1 text-xs font-medium tracking-widest text-[var(--gold)] uppercase">
            Admin
          </p>
          <p className="mb-8 text-sm text-[var(--charcoal-soft)]">Gayatri Law Offices</p>
          <nav className="flex flex-col gap-1">
            {nav.map((item) => {
              const active =
                item.exact === true
                  ? pathname === item.to
                  : pathname === item.to || pathname.startsWith(`${item.to}/`)
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    'rounded-lg px-3 py-2 text-sm font-medium no-underline transition-colors',
                    active
                      ? 'bg-[var(--gold-pale)] text-[var(--gold-deep)]'
                      : 'text-[var(--charcoal-soft)] hover:bg-[var(--gold-pale)]/50',
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <div className="mt-auto pt-8">
            <p className="text-xs text-[var(--slate-soft)]">{user.name}</p>
            <p className="mb-3 truncate text-xs text-[var(--slate-soft)]">{user.email}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => authClient.signOut()}
            >
              <LogOut className="mr-2 size-4" />
              Sign out
            </Button>
          </div>
        </aside>
        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>
    </div>
  )
}
