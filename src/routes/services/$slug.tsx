import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { seoDescription, seoTitle } from '#/lib/cms'
import { ServiceDetailPage } from '#/features/practice-areas/components/ServiceDetailPage'
import { loadPracticeArea } from '#/features/practice-areas/server/queries/load-practice-areas'
import {
  PUBLIC_CMS_GC_MS,
  PUBLIC_CMS_STALE_MS,
  applyPublicCmsCacheHeaders,
} from '#/lib/cms-route-cache'

export const Route = createFileRoute('/services/$slug')({
  staleTime: PUBLIC_CMS_STALE_MS,
  gcTime: PUBLIC_CMS_GC_MS,
  loader: async ({ params }) => {
    applyPublicCmsCacheHeaders()
    const service = await loadPracticeArea({ data: params.slug })
    if (!service) throw notFound()
    return service
  },
  head: ({ loaderData }) => {
    const svc = loaderData
    if (!svc) return {}
    const title = seoTitle(svc.title, svc.metaTitle)
    const description = seoDescription(svc.short, svc.metaDescription)
    return {
      meta: [
        { title: `${title} — LPO Services | Gayatri Law Offices` },
        { name: 'description', content: description },
        { property: 'og:title', content: `${title} — Gayatri Law Offices` },
        { property: 'og:description', content: description },
        ...(svc.ogImageUrl
          ? [{ property: 'og:image', content: svc.ogImageUrl }]
          : []),
      ],
    }
  },
  component: ServiceDetailRoute,
  notFoundComponent: () => (
    <main className="page-wrap px-4 pb-16 pt-28 sm:pt-32">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="display-title mb-4 text-3xl font-semibold text-[var(--charcoal)]">
          Service not found
        </h1>
        <p className="text-[var(--charcoal-soft)]">
          This service may have been removed.
        </p>
        <Link
          to="/services"
          className="mt-6 inline-block text-sm font-medium text-[var(--gold-deep)] hover:underline"
        >
          Back to all services
        </Link>
      </div>
    </main>
  ),
})

function ServiceDetailRoute() {
  const service = Route.useLoaderData()
  return <ServiceDetailPage service={service} />
}
