import { HeadContent, Scripts, createRootRoute, useRouterState } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import Footer from '#/components/shared/Footer'
import Header from '#/components/shared/Header'
import { buildOrganizationJsonLd } from '#/lib/organization'
import {
  SITE_CANONICAL_ORIGIN,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_OG_IMAGE_URL,
} from '#/lib/site'

import appCss from '#/styles.css?url'

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`

const DEFAULT_TITLE = `${SITE_NAME} — Expert Legal Process Outsourcing from India`

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: DEFAULT_TITLE },
      { name: 'description', content: SITE_DESCRIPTION },
      { name: 'keywords', content: 'Gayatri Legal Solutions, gayatrilegalsolutions, legal process outsourcing, LPO India, contract drafting, document review, litigation support, legal research, due diligence, paralegal services' },
      { property: 'og:title', content: DEFAULT_TITLE },
      { property: 'og:description', content: SITE_DESCRIPTION },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: SITE_CANONICAL_ORIGIN },
      { property: 'og:site_name', content: SITE_NAME },
      { property: 'og:image', content: SITE_OG_IMAGE_URL },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: DEFAULT_TITLE },
      { name: 'twitter:description', content: SITE_DESCRIPTION },
      { name: 'twitter:image', content: SITE_OG_IMAGE_URL },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'canonical', href: SITE_CANONICAL_ORIGIN },
      { rel: 'service-desc', href: '/openapi.json', type: 'application/openapi+json' },
      { rel: 'describedby', href: '/llms.txt', type: 'text/plain' },
      { rel: 'icon', href: '/favicon.ico' },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify(buildOrganizationJsonLd()),
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const isAdmin = useRouterState({
    select: (s) => s.location.pathname.startsWith('/admin'),
  })

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(184,134,11,0.24)]">
        {!isAdmin ? <Header /> : null}
        {children}
        {!isAdmin ? <Footer /> : null}
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
