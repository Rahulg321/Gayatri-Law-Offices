import { describe, expect, it } from 'vitest'
import { appendVary, acceptExplicitlyPrefersJson, preferredType } from '#/lib/accept'

describe('Accept negotiation (acceptmarkdown.com)', () => {
  it('prefers text/markdown when listed first at equal q', () => {
    expect(preferredType('text/markdown, text/html, */*', ['text/html', 'text/markdown'])).toBe(
      'text/markdown',
    )
  })

  it('honors q-values', () => {
    expect(
      preferredType('text/html;q=0.8, text/markdown;q=0.9', ['text/html', 'text/markdown']),
    ).toBe('text/markdown')
  })

  it('returns null when produced types are rejected', () => {
    expect(
      preferredType('text/html;q=0, text/markdown;q=0', ['text/html', 'text/markdown']),
    ).toBeNull()
    expect(preferredType('application/pdf', ['text/html', 'text/markdown'])).toBeNull()
  })

  it('defaults to the first produced type when Accept is missing', () => {
    expect(preferredType(null, ['text/html', 'text/markdown'])).toBe('text/html')
  })

  it('appends Accept and Accept-Encoding without duplicating', () => {
    const headers = new Headers({ Vary: 'Accept-Encoding' })
    appendVary(headers, ['Accept', 'Accept-Encoding'])
    expect(headers.get('Vary')).toBe('Accept-Encoding, Accept')
  })

  it('only treats explicit JSON Accept as JSON-preferring', () => {
    expect(acceptExplicitlyPrefersJson('*/*')).toBe(false)
    expect(acceptExplicitlyPrefersJson('text/html,application/xhtml+xml,*/*;q=0.8')).toBe(false)
    expect(acceptExplicitlyPrefersJson('application/json')).toBe(true)
    expect(acceptExplicitlyPrefersJson('application/problem+json, text/html;q=0.1')).toBe(true)
  })
})
