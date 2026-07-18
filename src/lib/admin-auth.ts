import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders, setResponseHeaders } from '@tanstack/react-start/server'
import { auth } from '#/lib/auth.server'
import { isAdminEmail } from '#/lib/admin'

function applyAdminApiNoStoreHeaders() {
  // Typed as Headers instance; runtime accepts a record of header values.
  setResponseHeaders({ 'Cache-Control': 'private, no-store' } as never)
}

export const getAdminSession = createServerFn({ method: 'GET' }).handler(async () => {
  applyAdminApiNoStoreHeaders()
  const session = await auth.api.getSession({
    headers: getRequestHeaders(),
  })
  if (!session?.user?.email || !isAdminEmail(session.user.email)) {
    return null
  }
  return {
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
    },
  }
})

export async function requireAdminSession() {
  applyAdminApiNoStoreHeaders()
  const session = await getAdminSession()
  if (!session) {
    throw new Error('Unauthorized')
  }
  return session
}
