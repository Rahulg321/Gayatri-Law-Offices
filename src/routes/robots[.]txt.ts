import { createFileRoute } from '@tanstack/react-router'
import { handleRobotsTxt } from '#/lib/public-agent-handlers'

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: async ({ request }) => handleRobotsTxt(request),
      HEAD: async ({ request }) => handleRobotsTxt(request),
      POST: async ({ request }) => handleRobotsTxt(request),
    },
  },
})
