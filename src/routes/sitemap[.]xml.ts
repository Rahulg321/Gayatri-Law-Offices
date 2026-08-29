import { createFileRoute } from '@tanstack/react-router'
import { handleSitemap } from '#/lib/sitemap.server'
import { methodNotAllowedResponse } from '#/lib/http-problem'

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async ({ request }) => handleSitemap(request),
      HEAD: async ({ request }) => handleSitemap(request),
      POST: async ({ request }) => methodNotAllowedResponse(request, 'GET, HEAD'),
    },
  },
})
