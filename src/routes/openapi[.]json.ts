import { createFileRoute } from '@tanstack/react-router'
import { handleOpenApi } from '#/lib/public-agent-handlers'

export const Route = createFileRoute('/openapi.json')({
  server: {
    handlers: {
      GET: async ({ request }) => handleOpenApi(request),
      HEAD: async ({ request }) => handleOpenApi(request),
      POST: async ({ request }) => handleOpenApi(request),
    },
  },
})
