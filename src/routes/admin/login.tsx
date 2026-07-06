import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '#/components/ui/button'
import { getAuthErrorMessage } from '#/lib/auth-errors'
import { authClient } from '#/lib/auth-client'

export const Route = createFileRoute('/admin/login')({
  validateSearch: (search: Record<string, unknown>) => ({
    error: typeof search.error === 'string' ? search.error : undefined,
    error_description:
      typeof search.error_description === 'string' ? search.error_description : undefined,
  }),
  component: AdminLoginPage,
})

function AdminLoginPage() {
  const { error, error_description } = Route.useSearch()
  const [isSigningIn, setIsSigningIn] = useState(false)
  const authError = getAuthErrorMessage(error, error_description)

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true)
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/admin',
        errorCallbackURL: '/admin/login',
      })
    } catch {
      setIsSigningIn(false)
    }
  }

  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4">
      <div className="bg-card text-card-foreground w-full max-w-md rounded-2xl border border-border p-8 shadow-sm">
        <p className="text-accent mb-2 text-xs font-medium tracking-widest uppercase">Admin</p>
        <h1 className="mb-2 text-2xl font-semibold">Sign in</h1>
        <p className="text-muted-foreground mb-8 text-sm">
          Use your authorized Google account to access the dashboard.
        </p>
        {authError ? (
          <p className="bg-destructive/10 text-destructive mb-4 rounded-lg px-3 py-2 text-sm">
            {authError}
          </p>
        ) : null}
        <Button
          type="button"
          className="bg-accent text-accent-foreground hover:bg-accent/90 w-full rounded-full"
          disabled={isSigningIn}
          onClick={() => void handleGoogleSignIn()}
        >
          {isSigningIn ? 'Redirecting to Google…' : 'Continue with Google'}
        </Button>
      </div>
    </div>
  )
}
