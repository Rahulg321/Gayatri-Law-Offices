import { Link, useRouterState } from '@tanstack/react-router'
import { BookOpen, FolderKanban, Gavel, LayoutDashboard, LogOut, Monitor, Moon, Sun } from 'lucide-react'
import { useThemeMode } from '#/components/ThemeToggle'
import { Button } from '#/components/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '#/components/ui/sidebar'
import { authClient } from '#/lib/auth-client'
import { cn } from '#/lib/utils'

const nav = [
  { to: '/admin', label: 'Dashboard', exact: true, icon: LayoutDashboard },
  { to: '/admin/practice-areas', label: 'Practice areas', exact: false, icon: Gavel },
  { to: '/admin/blogs', label: 'Blogs', exact: false, icon: BookOpen },
  { to: '/admin/projects', label: 'Projects', exact: false, icon: FolderKanban },
] as const

function AdminSidebarThemeToggle() {
  const { mode, cycleMode, label } = useThemeMode()
  const Icon = mode === 'auto' ? Monitor : mode === 'dark' ? Moon : Sun
  const tooltip =
    mode === 'auto' ? 'System theme — click to change' : `${mode} theme — click to change`

  return (
    <SidebarMenu className="mb-3 border-b border-sidebar-border pb-3 group-data-[collapsible=icon]:mb-2 group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:pb-2">
      <SidebarMenuItem>
        <SidebarMenuButton type="button" onClick={cycleMode} tooltip={tooltip} aria-label={label}>
          <Icon />
          <span>Theme</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export function AdminShell({
  children,
  user,
}: {
  children: React.ReactNode
  user: { name: string; email: string }
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r border-sidebar-border">
        <SidebarHeader className="gap-3.5 border-b border-sidebar-border px-4 py-5">
          <div className="flex flex-col gap-0.5 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-0">
            <p className="text-accent text-xs font-medium tracking-widest uppercase">
              Admin
            </p>
            <p className="text-sm text-sidebar-foreground/80 group-data-[collapsible=icon]:sr-only">
              Gayatri Law Offices
            </p>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigate</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {nav.map((item) => {
                  const active =
                    item.exact === true
                      ? pathname === item.to
                      : pathname === item.to || pathname.startsWith(`${item.to}/`)
                  const Icon = item.icon
                  return (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
                        <Link to={item.to}>
                          <Icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t border-sidebar-border p-4">
          <AdminSidebarThemeToggle />
          <div className="flex flex-col gap-1 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-xs text-sidebar-foreground/70">{user.name}</p>
            <p className="mb-2 truncate text-xs text-sidebar-foreground/60">{user.email}</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={cn(
              'w-full justify-start gap-2 shadow-none',
              'group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0',
            )}
            onClick={() => authClient.signOut()}
            title="Sign out"
          >
            <LogOut className="size-4 shrink-0" />
            <span className="group-data-[collapsible=icon]:sr-only">Sign out</span>
          </Button>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="bg-background">
        <header className="bg-background/95 supports-backdrop-filter:bg-background/80 sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b border-border px-4 backdrop-blur md:hidden">
          <SidebarTrigger className="-ml-1" />
          <span className="text-foreground text-sm font-medium">Admin</span>
        </header>
        <div className="text-foreground flex-1 p-6 md:p-10">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
