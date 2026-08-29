import { createMiddleware } from '@tanstack/react-start'
import { appendVary, acceptExplicitlyPrefersJson, NEGOTIATION_VARY, preferredType } from '#/lib/accept'
import { httpProblemResponse } from '#/lib/http-problem'
import { resolvePageMarkdown } from '#/lib/page-markdown.server'

const SKIP_MARKDOWN_PREFIXES = ['/api/', '/admin', '/cdn-cgi/']
const SKIP_MARKDOWN_EXACT = new Set([
  '/openapi.json',
  '/api/openapi.yaml',
  '/robots.txt',
  '/sitemap.xml',
  '/llms.txt',
  '/.well-known/api-catalog',
  '/favicon.ico',
  '/manifest.json',
  '/og-image.svg',
])

function shouldNegotiateDocument(pathname: string): boolean {
  if (SKIP_MARKDOWN_EXACT.has(pathname)) return false
  if (SKIP_MARKDOWN_PREFIXES.some((p) => pathname.startsWith(p))) return false
  if (/\.[a-z0-9]+$/i.test(pathname) && !pathname.endsWith('.html')) return false
  return true
}

function markdownResponse(body: string, status = 200): Response {
  const headers = new Headers({
    'Content-Type': 'text/markdown; charset=utf-8',
    'Cache-Control': 'public, max-age=0, must-revalidate',
  })
  appendVary(headers, [...NEGOTIATION_VARY])
  return new Response(body, { status, headers })
}

function notAcceptableResponse(): Response {
  const headers = new Headers({
    'Content-Type': 'text/plain; charset=utf-8',
  })
  appendVary(headers, [...NEGOTIATION_VARY])
  return new Response('Not Acceptable\n\nAvailable: text/html, text/markdown\n', {
    status: 406,
    headers,
  })
}

function cloneWithNegotiationHeaders(response: Response, markdownPath: string | null): Response {
  const headers = new Headers(response.headers)
  appendVary(headers, [...NEGOTIATION_VARY])
  const contentType = headers.get('content-type') ?? ''
  if (markdownPath && contentType.includes('text/html')) {
    const link = `<${markdownPath}>; rel="alternate"; type="text/markdown"`
    const existing = headers.get('Link')
    headers.set('Link', existing ? `${existing}, ${link}` : link)
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

export const agentContentMiddleware = createMiddleware({ type: 'request' }).server(
  async ({ next, request, pathname, handlerType }) => {
    if (handlerType !== 'router') return next()
    if (request.method !== 'GET' && request.method !== 'HEAD') return next()

    const accept = request.headers.get('accept')

    if (!shouldNegotiateDocument(pathname)) {
      const result = await next()
      const contentType = result.response.headers.get('content-type') ?? ''
      if (
        acceptExplicitlyPrefersJson(accept) &&
        result.response.status >= 400 &&
        !contentType.includes('json')
      ) {
        return httpProblemResponse({
          code: result.response.status === 404 ? 'not_found' : 'internal_error',
          status: result.response.status,
          instance: pathname,
        })
      }
      return result
    }

    const chosen = preferredType(accept, ['text/html', 'text/markdown'])
    if (chosen === null && accept) {
      if (acceptExplicitlyPrefersJson(accept)) {
        const result = await next()
        const status = result.response.status >= 400 ? result.response.status : 406
        return httpProblemResponse({
          code: status === 404 ? 'not_found' : status === 405 ? 'method_not_allowed' : 'internal_error',
          status,
          instance: pathname,
        })
      }
      return notAcceptableResponse()
    }

    if (chosen === 'text/markdown') {
      try {
        const md = await resolvePageMarkdown(pathname)
        if (md) return markdownResponse(md)
      } catch {
        // Fall through to HTML when CMS lookups fail and HTML is still acceptable.
      }
      if (!preferredType(accept, ['text/html'])) return notAcceptableResponse()
    }

    const result = await next()
    const contentType = result.response.headers.get('content-type') ?? ''
    if (
      acceptExplicitlyPrefersJson(accept) &&
      result.response.status >= 400 &&
      !contentType.includes('json')
    ) {
      return httpProblemResponse({
        code: result.response.status === 404 ? 'not_found' : 'internal_error',
        status: result.response.status,
        instance: pathname,
      })
    }

    const mdAvailable = markdownForPathExists(pathname)
    return {
      ...result,
      response: cloneWithNegotiationHeaders(result.response, mdAvailable ? pathname : null),
    }
  },
)

function markdownForPathExists(pathname: string): boolean {
  const path = pathname.replace(/\/+$/, '') || '/'
  return (
    path === '/' ||
    [
      '/about',
      '/contact',
      '/privacy',
      '/terms',
      '/faq',
      '/why-us',
      '/testimonials',
      '/timeline',
      '/services',
      '/projects',
      '/blogs',
      '/team',
    ].includes(path) ||
    /^\/(services|blogs|projects)\/[^/]+$/.test(path)
  )
}
