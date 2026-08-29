import { createFileRoute } from '@tanstack/react-router'
import { handleUnknownApi } from '#/lib/public-agent-handlers'

const handlers = {
  GET: async ({ request }: { request: Request }) => handleUnknownApi(request),
  POST: async ({ request }: { request: Request }) => handleUnknownApi(request),
  PUT: async ({ request }: { request: Request }) => handleUnknownApi(request),
  PATCH: async ({ request }: { request: Request }) => handleUnknownApi(request),
  DELETE: async ({ request }: { request: Request }) => handleUnknownApi(request),
}

export const Route = createFileRoute('/api/$')({
  server: {
    handlers,
  },
})
