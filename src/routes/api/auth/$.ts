import { createFileRoute } from '@tanstack/react-router'
import { auth } from '#/lib/auth.server'

function withAuthNoStore(response: Response): Response {
  const headers = new Headers(response.headers)
  headers.set('Cache-Control', 'private, no-store')
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: async ({ request }) => withAuthNoStore(await auth.handler(request)),
      POST: async ({ request }) => withAuthNoStore(await auth.handler(request)),
    },
  },
})
