import { describe, expect, it } from 'vitest'
import { buildOrganizationJsonLd } from '#/lib/organization'

describe('Organization JSON-LD', () => {
  it('includes contactPoint and PostalAddress', () => {
    const json = buildOrganizationJsonLd('https://gayatrilegalsolutions.com')
    expect(json['@type']).toBe('Organization')
    expect(json.name).toBe('Gayatri Legal Solutions')
    expect(json.url).toBe('https://gayatrilegalsolutions.com')
    expect(json.contactPoint.email).toContain('@')
    expect(json.contactPoint.telephone.length).toBeGreaterThan(5)
    expect(json.contactPoint.contactType).toBe('customer service')
    expect(json.address['@type']).toBe('PostalAddress')
    expect(json.address.addressLocality).toBe('Ludhiana')
    expect(json.sameAs.length).toBeGreaterThan(0)
  })
})
