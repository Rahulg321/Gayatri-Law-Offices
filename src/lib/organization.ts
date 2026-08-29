import {
  SITE_ADDRESS,
  SITE_ALTERNATE_NAMES,
  SITE_CANONICAL_ORIGIN,
  SITE_DESCRIPTION,
  SITE_EMAIL,
  SITE_NAME,
  SITE_OG_IMAGE_URL,
  SITE_PHONE,
  SITE_SAME_AS,
} from '#/lib/site'

export function buildOrganizationJsonLd(origin: string = SITE_CANONICAL_ORIGIN) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    alternateName: [...SITE_ALTERNATE_NAMES],
    description: SITE_DESCRIPTION,
    url: origin,
    email: SITE_EMAIL,
    telephone: SITE_PHONE,
    image: SITE_OG_IMAGE_URL,
    logo: SITE_OG_IMAGE_URL,
    sameAs: [...SITE_SAME_AS],
    areaServed: ['US', 'UK', 'EU', 'IN'],
    knowsAbout: [
      'Legal Process Outsourcing',
      'Contract Drafting',
      'Document Review',
      'Litigation Support',
      'Legal Research',
      'Due Diligence',
      'Intellectual Property',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: SITE_EMAIL,
      telephone: SITE_PHONE,
      availableLanguage: ['English'],
      url: `${origin}/contact`,
    },
    address: SITE_ADDRESS,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'LPO Services',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Contract Drafting & Review' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Document Review & e-Discovery' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Legal Research & Writing' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Litigation Support' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Due Diligence' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Intellectual Property Support' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Paralegal & Administrative Services' } },
      ],
    },
  }
}
