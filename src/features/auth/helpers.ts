const AUTH_ERROR_MESSAGES: Record<string, string> = {
  access_denied: 'Google sign-in was cancelled.',
  account_not_linked:
    'This Google account could not be linked. Try the email already registered for admin access.',
  unable_to_create_user:
    'This Google account is not authorized for admin access.',
  unable_to_create_session: 'Could not start an admin session. Please try again.',
  unable_to_link_account: 'Could not link your Google account. Please try again.',
  invalid_code: 'Google sign-in expired or was invalid. Please try again.',
  no_code: 'Google did not return an authorization code. Please try again.',
  state_not_found: 'Sign-in state expired. Please try again.',
  email_not_found: 'Google did not return an email address for this account.',
  invalid_origin:
    'This site origin is not allowed for admin sign-in. Use the primary domain or update auth trusted hosts.',
  missing_or_null_origin: 'Sign-in request was missing an origin. Please try again.',
}

export function getAuthErrorMessage(
  error: string | undefined,
  description: string | undefined,
): string | null {
  if (description?.trim()) return description.trim()
  if (!error?.trim()) return null
  const normalized = error.trim().toLowerCase()
  return (
    AUTH_ERROR_MESSAGES[normalized] ??
    AUTH_ERROR_MESSAGES[normalized.replace(/-/g, '_')] ??
    'Sign-in failed. Please try again.'
  )
}
