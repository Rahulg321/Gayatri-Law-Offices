import { createFileRoute } from '@tanstack/react-router'
import { handleApiCatalog } from '#/lib/public-agent-handlers'

export const Route = createFileRoute('/.well-known/api-catalog')({
  server: {
    handlers: {
      GET: async ({ request }) => handleApiCatalog(request),
      HEAD: async ({ request }) => handleApiCatalog(request),
      POST: async ({ request }) => handleApiCatalog(request),
    },
  },
})
