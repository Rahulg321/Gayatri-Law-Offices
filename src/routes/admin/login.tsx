import { createFileRoute } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import { authClient } from '#/lib/auth-client'

export const Route = createFileRoute('/admin/login')({
  component: AdminLoginPage,
})

function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f4f0] px-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--line)] bg-white p-8 shadow-sm">
        <p className="mb-2 text-xs font-medium tracking-widest text-[var(--gold)] uppercase">
          Admin
        </p>
        <h1 className="mb-2 text-2xl font-semibold text-[var(--charcoal)]">Sign in</h1>
        <p className="mb-8 text-sm text-[var(--charcoal-soft)]">
          Use your authorized Google account to access the dashboard.
        </p>
        <Button
          type="button"
          className="w-full rounded-full bg-[var(--gold)] text-white hover:bg-[var(--gold-deep)]"
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
