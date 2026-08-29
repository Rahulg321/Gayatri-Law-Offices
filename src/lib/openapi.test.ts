import { describe, expect, it } from 'vitest'
import { buildOpenApiDocument } from '#/lib/openapi'

describe('buildOpenApiDocument', () => {
  it('publishes OpenAPI 3.1 with a typed RFC 9457 error schema', () => {
    const spec = buildOpenApiDocument('https://gayatrilegalsolutions.com')

    expect(spec.openapi).toBe('3.1.0')
    expect(spec.paths['/api/v1/status']?.get?.operationId).toBe('getPublicStatus')
    expect(spec.components.schemas.Problem.required).toEqual(
      expect.arrayContaining(['code', 'message', 'resolution', 'status', 'detail']),
    )
    expect(spec.components.responses.Problem.content['application/problem+json'].schema).toEqual({
      $ref: '#/components/schemas/Problem',
    })
    expect(spec.servers[0]?.url).toBe('https://gayatrilegalsolutions.com')
  })
})
