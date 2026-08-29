import { describe, expect, it } from 'vitest'
import { HOME_H1, HOME_NOSCRIPT_TEXT } from '#/features/marketing/home-content'

describe('homepage agent-readable copy', () => {
  it('has an H1 and more than 500 characters of text without JavaScript', () => {
    expect(HOME_H1.length).toBeGreaterThan(10)
    expect(HOME_NOSCRIPT_TEXT.startsWith(HOME_H1)).toBe(true)
    expect(HOME_NOSCRIPT_TEXT.length).toBeGreaterThan(500)
  })
})
