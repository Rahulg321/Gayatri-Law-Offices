import { createFileRoute } from '@tanstack/react-router'
import { ServicesIndexPage } from '#/features/practice-areas/components/ServicesIndexPage'
import { loadPracticeAreas } from '#/features/practice-areas/server/queries/load-practice-areas'
import {
  PUBLIC_CMS_GC_MS,
  PUBLIC_CMS_STALE_MS,
  applyPublicCmsCacheHeaders,
} from '#/lib/cms-route-cache'

export const Route = createFileRoute('/services/')({
  staleTime: PUBLIC_CMS_STALE_MS,
  gcTime: PUBLIC_CMS_GC_MS,
  loader: () => {
    applyPublicCmsCacheHeaders()
    return loadPracticeAreas()
  },
  head: () => ({
    meta: [
      { title: 'LPO Services — Contract, Research & Litigation Support' },
      {
        name: 'description',
        content:
          'Comprehensive legal process outsourcing services: contract drafting, document review, legal research, litigation support, due diligence, IP, and paralegal services.',
      },
    ],
  }),
  component: ServicesIndexRoute,
})

function ServicesIndexRoute() {
  const services = Route.useLoaderData()
  return <ServicesIndexPage services={services} />
}
