import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import Footer from '../components/Footer'
import Header from '../components/Header'

import appCss from '../styles.css?url'

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Gayatri Law Offices — Expert Legal Process Outsourcing from India' },
      { name: 'description', content: 'Gayatri Law Offices provides cost-effective, high-quality legal process outsourcing (LPO) services for law firms and legal departments worldwide. Contract drafting, document review, litigation support, and more.' },
      { name: 'keywords', content: 'legal process outsourcing, LPO India, contract drafting, document review, litigation support, legal research, due diligence, paralegal services' },
      { property: 'og:title', content: 'Gayatri Law Offices — Expert Legal Process Outsourcing from India' },
      { property: 'og:description', content: 'Cost-effective, high-quality LPO services for global law firms. Contract drafting, document review, litigation support, and more.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://gayatri-law-offices.pages.dev' },
      { property: 'og:site_name', content: 'Gayatri Law Offices' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Gayatri Law Offices — Expert Legal Process Outsourcing from India' },
      { name: 'twitter:description', content: 'Cost-effective, high-quality LPO services for global law firms.' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'canonical', href: 'https://gayatri-law-offices.pages.dev' },
      { rel: 'icon', href: '/favicon.ico' },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Gayatri Law Offices',
          description: 'Expert legal process outsourcing services from India, providing cost-effective contract drafting, document review, litigation support, and legal research for law firms worldwide.',
          url: 'https://gayatri-law-offices.pages.dev',
          areaServed: ['US', 'UK', 'EU', 'India'],
          knowsAbout: [
            'Legal Process Outsourcing',
            'Contract Drafting',
            'Document Review',
            'Litigation Support',
            'Legal Research',
            'Due Diligence',
            'Intellectual Property',
          ],
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
        }),
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(184,134,11,0.24)]">
        <Header />
        {children}
        <Footer />
        <TanStackDevtools
          config={{ position: 'bottom-right' }}
          plugins={[
            { name: 'Tanstack Router', render: <TanStackRouterDevtoolsPanel /> },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
