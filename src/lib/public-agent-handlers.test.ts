import { describe, expect, it } from 'vitest'
import {
  handleOpenApi,
  handleOpenApiYaml,
  handlePublicStatus,
  handleUnknownApi,
} from '#/lib/public-agent-handlers'

describe('public agent HTTP handlers', () => {
  it('serves OpenAPI 3.1 at GET /openapi.json', async () => {
    const response = handleOpenApi(new Request('https://gayatrilegalsolutions.com/openapi.json'))
    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('application/openapi+json')
    const body = await response.json() as { openapi: string }
    expect(body.openapi).toBe('3.1.0')
  })

  it('serves JSON status', async () => {
    const response = handlePublicStatus(new Request('https://gayatrilegalsolutions.com/api/v1/status'))
    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('application/json')
    const body = await response.json() as { ok: boolean; docs: string }
    expect(body.ok).toBe(true)
    expect(body.docs).toContain('/openapi.json')
  })

  it('returns RFC 9457 JSON for unknown API paths', async () => {
    const response = handleUnknownApi(
      new Request('https://gayatrilegalsolutions.com/api/v1/missing'),
    )
    expect(response.status).toBe(404)
    expect(response.headers.get('content-type')).toContain('application/problem+json')
    const body = await response.json() as {
      code: string
      message: string
      resolution: string
    }
    expect(body.code).toBe('not_found')
    expect(body.message.length).toBeGreaterThan(5)
    expect(body.resolution.length).toBeGreaterThan(10)
  })

  it('returns JSON 405 with Allow for POST /api/v1/status', async () => {
    const response = handlePublicStatus(
      new Request('https://gayatrilegalsolutions.com/api/v1/status', { method: 'POST' }),
    )
    expect(response.status).toBe(405)
    expect(response.headers.get('allow')).toContain('GET')
    const body = await response.json() as { code: string }
    expect(body.code).toBe('method_not_allowed')
  })

  it('serves OpenAPI YAML at GET /api/openapi.yaml', async () => {
    const response = handleOpenApiYaml(
      new Request('https://gayatrilegalsolutions.com/api/openapi.yaml'),
    )
    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('application/yaml')
    expect(response.headers.get('vary')).toMatch(/Accept/)
    const body = await response.text()
    expect(body).toContain('openapi: 3.1.0')
  })
})
