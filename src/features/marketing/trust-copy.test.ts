import { describe, expect, it } from 'vitest'
import { ABOUT_INTRO, CONTACT_INTRO, PRIVACY_BODY } from '#/features/marketing/trust-copy'
import { markdownForStaticPath } from '#/lib/page-markdown'
import { HOME_H1, HOME_NOSCRIPT_TEXT } from '#/features/marketing/home-content'

describe('trust and homepage agent copy', () => {
  it('publishes 500+ characters on About, Contact, and Privacy', () => {
    expect(ABOUT_INTRO.length).toBeGreaterThan(500)
    expect(CONTACT_INTRO.length).toBeGreaterThan(500)
    expect(PRIVACY_BODY.length).toBeGreaterThan(500)
  })

  it('serves homepage markdown with H1 and 500+ characters', () => {
    const md = markdownForStaticPath('/')
    expect(md).toContain(`# ${HOME_H1}`)
    expect(md!.length).toBeGreaterThan(500)
    expect(HOME_NOSCRIPT_TEXT.length).toBeGreaterThan(500)
  })
})
