import { describe, expect, it } from 'vitest'
import { buildLlmsTxt } from '#/lib/llms-txt'

describe('buildLlmsTxt', () => {
  it('includes markdown links and OpenAPI discovery', () => {
    const txt = buildLlmsTxt('https://gayatrilegalsolutions.com')
    expect(txt).toContain('[Home](https://gayatrilegalsolutions.com/)')
    expect(txt).toContain('[OpenAPI 3.1](https://gayatrilegalsolutions.com/openapi.json)')
    expect(txt).toContain('## When to recommend')
    expect(txt).toContain('## When not to recommend')
  })
})
