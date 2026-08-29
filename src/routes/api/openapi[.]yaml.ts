import { createFileRoute } from '@tanstack/react-router'
import { handleOpenApiYaml } from '#/lib/public-agent-handlers'

export const Route = createFileRoute('/api/openapi.yaml')({
  server: {
    handlers: {
      GET: async ({ request }) => handleOpenApiYaml(request),
      HEAD: async ({ request }) => handleOpenApiYaml(request),
      POST: async ({ request }) => handleOpenApiYaml(request),
    },
  },
})
