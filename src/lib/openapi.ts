import { SITE_CANONICAL_ORIGIN, SITE_EMAIL, SITE_NAME } from '#/lib/site'

const problemSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['type', 'title', 'status', 'detail', 'code', 'message', 'resolution'],
  properties: {
    type: { type: 'string', format: 'uri' },
    title: { type: 'string' },
    status: { type: 'integer' },
    detail: { type: 'string' },
    code: {
      type: 'string',
      enum: ['not_found', 'method_not_allowed', 'invalid_request', 'internal_error'],
    },
    message: { type: 'string', description: 'Human-readable message; same as detail.' },
    resolution: {
      type: 'string',
      description: 'Hint describing how an agent can recover.',
    },
    instance: { type: 'string' },
  },
} as const

export function buildOpenApiDocument(origin: string = SITE_CANONICAL_ORIGIN) {
  return {
    openapi: '3.1.0',
    info: {
      title: `${SITE_NAME} Public API`,
      version: '1.0.0',
      summary: 'Public, unauthenticated status API for Gayatri Legal Solutions.',
      description:
        'Machine-readable status for agents. Contact and CMS mutations are not exposed here. Errors use RFC 9457 application/problem+json.',
      contact: {
        name: SITE_NAME,
        url: `${origin}/contact`,
        email: SITE_EMAIL,
      },
    },
    servers: [{ url: origin, description: 'Public website origin' }],
    tags: [{ name: 'Status', description: 'Availability of the public site and API' }],
    paths: {
      '/api/v1/status': {
        get: {
          operationId: 'getPublicStatus',
          tags: ['Status'],
          summary: 'Return public service availability',
          description: 'Unauthenticated JSON health document for crawlers and agents.',
          responses: {
            '200': {
              description: 'Service is reachable',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Status' },
                },
              },
            },
            '405': { $ref: '#/components/responses/Problem' },
            '500': { $ref: '#/components/responses/Problem' },
          },
        },
      },
      '/openapi.json': {
        get: {
          operationId: 'getOpenApiDocument',
          tags: ['Status'],
          summary: 'Return this OpenAPI document',
          responses: {
            '200': {
              description: 'OpenAPI 3.1 document',
              content: {
                'application/openapi+json': {
                  schema: { type: 'object', additionalProperties: true },
                },
              },
            },
            '405': { $ref: '#/components/responses/Problem' },
          },
        },
      },
      '/api/openapi.yaml': {
        get: {
          operationId: 'getOpenApiYaml',
          tags: ['Status'],
          summary: 'Return this OpenAPI document as YAML',
          responses: {
            '200': {
              description: 'OpenAPI 3.1 YAML',
              content: {
                'application/yaml': {
                  schema: { type: 'object', additionalProperties: true },
                },
              },
            },
            '405': { $ref: '#/components/responses/Problem' },
          },
        },
      },
    },
    components: {
      schemas: {
        Problem: problemSchema,
        Status: {
          type: 'object',
          additionalProperties: false,
          required: ['ok', 'service', 'name', 'docs'],
          properties: {
            ok: { type: 'boolean' },
            service: { type: 'string' },
            name: { type: 'string' },
            version: { type: 'string' },
            docs: { type: 'string' },
            contact: { type: 'string', format: 'uri' },
          },
        },
      },
      responses: {
        Problem: {
          description: 'RFC 9457 problem details with a stable code and resolution hint',
          content: {
            'application/problem+json': {
              schema: { $ref: '#/components/schemas/Problem' },
            },
          },
        },
      },
    },
  }
}

export function buildApiCatalog(origin: string = SITE_CANONICAL_ORIGIN) {
  return {
    linkset: [
      {
        anchor: `${origin}/`,
        'service-desc': [
          {
            href: `${origin}/openapi.json`,
            type: 'application/openapi+json',
          },
          {
            href: `${origin}/api/openapi.yaml`,
            type: 'application/yaml',
          },
        ],
        item: [
          {
            href: `${origin}/api/v1/status`,
            type: 'application/json',
          },
        ],
      },
    ],
  }
}
