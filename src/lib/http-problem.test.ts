import { describe, expect, it } from 'vitest'
import { createHttpProblem } from '#/lib/http-problem'

describe('createHttpProblem', () => {
  it('returns RFC 9457 fields plus code, message, and resolution', () => {
    const problem = createHttpProblem({
      code: 'not_found',
      instance: '/api/v1/missing',
    })

    expect(problem.type).toBe('https://gayatrilegalsolutions.com/problems/not_found')
    expect(problem.title).toBe('Not Found')
    expect(problem.status).toBe(404)
    expect(problem.code).toBe('not_found')
    expect(problem.message).toBe(problem.detail)
    expect(problem.resolution.length).toBeGreaterThan(20)
    expect(problem.instance).toBe('/api/v1/missing')
  })

  it('uses 405 for method_not_allowed', () => {
    expect(createHttpProblem({ code: 'method_not_allowed' }).status).toBe(405)
  })
})
