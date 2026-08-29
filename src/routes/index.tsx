import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '#/features/marketing/components/HomePage'
import { loadFeaturedPortfolioProjects } from '#/features/projects/server/queries/load-portfolio-projects'
import {
  PUBLIC_CMS_GC_MS,
  PUBLIC_CMS_STALE_MS,
  applyPublicCmsCacheHeaders,
} from '#/lib/cms-route-cache'

export const Route = createFileRoute('/')({
  staleTime: PUBLIC_CMS_STALE_MS,
  gcTime: PUBLIC_CMS_GC_MS,
  loader: () => {
    applyPublicCmsCacheHeaders()
    return loadFeaturedPortfolioProjects()
  },
  head: () => ({
    meta: [
      { title: 'Gayatri Legal Solutions — Expert Legal Process Outsourcing from India' },
      { name: 'description', content: 'Cost-effective, high-quality legal process outsourcing services for law firms worldwide. Contract drafting, document review, litigation support, and more. Visit gayatrilegalsolutions.com.' },
      { property: 'og:title', content: 'Gayatri Legal Solutions — Expert Legal Process Outsourcing from India' },
      { property: 'og:description', content: 'Cost-effective, high-quality LPO services for global law firms.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: 'https://gayatrilegalsolutions.com/og-image.svg' },
    ],
    links: [{ rel: 'canonical', href: 'https://gayatrilegalsolutions.com/' }],
  }),
  component: HomeRoute,
})

function HomeRoute() {
  const featuredProjects = Route.useLoaderData()
  return <HomePage featuredProjects={featuredProjects} />
}
