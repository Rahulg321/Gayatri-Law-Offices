import { createFileRoute } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import { authClient } from '#/lib/auth-client'

export const Route = createFileRoute('/admin/login')({
  component: AdminLoginPage,
})

function AdminLoginPage() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4">
      <div className="bg-card text-card-foreground w-full max-w-md rounded-2xl border border-border p-8 shadow-sm">
        <p className="text-accent mb-2 text-xs font-medium tracking-widest uppercase">Admin</p>
        <h1 className="mb-2 text-2xl font-semibold">Sign in</h1>
        <p className="text-muted-foreground mb-8 text-sm">
          Use your authorized Google account to access the dashboard.
        </p>
        <Button
          type="button"
          className="bg-accent text-accent-foreground hover:bg-accent/90 w-full rounded-full"
          onClick={() =>
            authClient.signIn.social({
              provider: 'google',
              callbackURL: '/admin',
            })
          }
        >
          Continue with Google
        </Button>
      </div>
    </div>
  )
}
