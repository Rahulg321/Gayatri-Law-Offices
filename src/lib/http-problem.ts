/** RFC 9457 Problem Details plus the code / message / resolution fields agents expect. */

export const PROBLEM_JSON = 'application/problem+json; charset=utf-8'

export type HttpProblemCode =
  | 'not_found'
  | 'method_not_allowed'
  | 'invalid_request'
  | 'internal_error'

export type HttpProblem = {
  type: string
  title: string
  status: number
  detail: string
  code: HttpProblemCode
  message: string
  resolution: string
  instance?: string
}

const PROBLEM_TYPE_BASE = 'https://gayatrilegalsolutions.com/problems'

function titleFor(code: HttpProblemCode): string {
  switch (code) {
    case 'not_found':
      return 'Not Found'
    case 'method_not_allowed':
      return 'Method Not Allowed'
    case 'invalid_request':
      return 'Invalid Request'
    case 'internal_error':
      return 'Internal Server Error'
    default: {
      const _exhaustive: never = code
      return _exhaustive
    }
  }
}

function defaultStatusFor(code: HttpProblemCode): number {
  switch (code) {
    case 'not_found':
      return 404
    case 'method_not_allowed':
      return 405
    case 'invalid_request':
      return 400
    case 'internal_error':
      return 500
    default: {
      const _exhaustive: never = code
      return _exhaustive
    }
  }
}

function defaultDetailFor(code: HttpProblemCode): string {
  switch (code) {
    case 'not_found':
      return 'The requested resource does not exist.'
    case 'method_not_allowed':
      return 'This HTTP method is not supported for this resource.'
    case 'invalid_request':
      return 'The request could not be understood or validated.'
    case 'internal_error':
      return 'An unexpected error occurred while processing the request.'
    default: {
      const _exhaustive: never = code
      return _exhaustive
    }
  }
}

function defaultResolutionFor(code: HttpProblemCode): string {
  switch (code) {
    case 'not_found':
      return 'GET /openapi.json for the published API surface, GET /api/v1/status for availability, or open /llms.txt for public pages.'
    case 'method_not_allowed':
      return 'Retry with a method listed in the Allow header. Read /openapi.json for supported operations.'
    case 'invalid_request':
      return 'Check required fields against the OpenAPI schema at /openapi.json and retry with valid JSON.'
    case 'internal_error':
      return 'Retry later. If the problem persists, contact info@gayatrilawoffices.com with the request path and timestamp.'
    default: {
      const _exhaustive: never = code
      return _exhaustive
    }
  }
}

export function createHttpProblem(input: {
  code: HttpProblemCode
  status?: number
  detail?: string
  resolution?: string
  instance?: string
}): HttpProblem {
  const status = input.status ?? defaultStatusFor(input.code)
  const detail = input.detail ?? defaultDetailFor(input.code)
  return {
    type: `${PROBLEM_TYPE_BASE}/${input.code}`,
    title: titleFor(input.code),
    status,
    detail,
    code: input.code,
    message: detail,
    resolution: input.resolution ?? defaultResolutionFor(input.code),
    ...(input.instance ? { instance: input.instance } : {}),
  }
}

export function httpProblemResponse(
  input: {
    code: HttpProblemCode
    status?: number
    detail?: string
    resolution?: string
    instance?: string
  },
  extraHeaders?: HeadersInit,
): Response {
  const problem = createHttpProblem(input)
  const headers = new Headers(extraHeaders)
  headers.set('Content-Type', PROBLEM_JSON)
  headers.set('Cache-Control', 'private, no-store')
  return new Response(JSON.stringify(problem), {
    status: problem.status,
    headers,
  })
}

export function apiNotFoundResponse(request: Request): Response {
  return httpProblemResponse({
    code: 'not_found',
    instance: new URL(request.url).pathname,
  })
}

export function methodNotAllowedResponse(request: Request, allow: string): Response {
  return httpProblemResponse(
    {
      code: 'method_not_allowed',
      instance: new URL(request.url).pathname,
      detail: `Method ${request.method} is not allowed. Allowed: ${allow}.`,
    },
    { Allow: allow },
  )
}

export const apiFallbackHandlers = {
  GET: async ({ request }: { request: Request }) => apiNotFoundResponse(request),
  POST: async ({ request }: { request: Request }) => apiNotFoundResponse(request),
  PUT: async ({ request }: { request: Request }) => apiNotFoundResponse(request),
  PATCH: async ({ request }: { request: Request }) => apiNotFoundResponse(request),
  DELETE: async ({ request }: { request: Request }) => apiNotFoundResponse(request),
}
