import { appendVary, NEGOTIATION_VARY } from '#/lib/accept'
import { apiNotFoundResponse, methodNotAllowedResponse } from '#/lib/http-problem'
import { buildLlmsTxt } from '#/lib/llms-txt'
import { buildApiCatalog, buildOpenApiDocument } from '#/lib/openapi'
import { buildRobotsTxt } from '#/lib/robots-txt'
import { SITE_NAME, originFromRequest } from '#/lib/site'
import { toYaml } from '#/lib/yaml'

function textResponse(body: string, contentType: string): Response {
  const headers = new Headers({
    'Content-Type': contentType,
    'Cache-Control': 'public, max-age=0, must-revalidate',
  })
  appendVary(headers, [...NEGOTIATION_VARY])
  return new Response(body, { headers })
}

export function handleRobotsTxt(request: Request): Response {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return methodNotAllowedResponse(request, 'GET, HEAD')
  }
  return textResponse(buildRobotsTxt(originFromRequest(request)), 'text/plain; charset=utf-8')
}

export function handleLlmsTxt(request: Request): Response {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return methodNotAllowedResponse(request, 'GET, HEAD')
  }
  return textResponse(buildLlmsTxt(originFromRequest(request)), 'text/plain; charset=utf-8')
}

export function handleOpenApi(request: Request): Response {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return methodNotAllowedResponse(request, 'GET, HEAD')
  }
  return textResponse(
    JSON.stringify(buildOpenApiDocument(originFromRequest(request))),
    'application/openapi+json; charset=utf-8',
  )
}

export function handleOpenApiYaml(request: Request): Response {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return methodNotAllowedResponse(request, 'GET, HEAD')
  }
  return textResponse(
    `${toYaml(buildOpenApiDocument(originFromRequest(request)))}\n`,
    'application/yaml; charset=utf-8',
  )
}

export function handleApiCatalog(request: Request): Response {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return methodNotAllowedResponse(request, 'GET, HEAD')
  }
  return textResponse(
    JSON.stringify(buildApiCatalog(originFromRequest(request))),
    'application/linkset+json; charset=utf-8',
  )
}

export function handlePublicStatus(request: Request): Response {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return methodNotAllowedResponse(request, 'GET, HEAD')
  }
  const origin = originFromRequest(request)
  return textResponse(
    JSON.stringify({
      ok: true,
      service: 'gayatri-law-offices-public',
      name: SITE_NAME,
      version: '1.0.0',
      docs: `${origin}/openapi.json`,
      contact: `${origin}/contact`,
    }),
    'application/json; charset=utf-8',
  )
}

export function handleUnknownApi(request: Request): Response {
  return apiNotFoundResponse(request)
}
