import { createFileRoute } from '@tanstack/react-router'
import { handlePublicStatus } from '#/lib/public-agent-handlers'

export const Route = createFileRoute('/api/v1/status')({
  server: {
    handlers: {
      GET: async ({ request }) => handlePublicStatus(request),
      HEAD: async ({ request }) => handlePublicStatus(request),
      POST: async ({ request }) => handlePublicStatus(request),
      PUT: async ({ request }) => handlePublicStatus(request),
      PATCH: async ({ request }) => handlePublicStatus(request),
      DELETE: async ({ request }) => handlePublicStatus(request),
    },
  },
})
