import { createFileRoute } from '@tanstack/react-router'
import { handleLlmsTxt } from '#/lib/public-agent-handlers'

export const Route = createFileRoute('/llms.txt')({
  server: {
    handlers: {
      GET: async ({ request }) => handleLlmsTxt(request),
      HEAD: async ({ request }) => handleLlmsTxt(request),
      POST: async ({ request }) => handleLlmsTxt(request),
    },
  },
})
