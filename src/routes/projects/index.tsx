import { createFileRoute } from '@tanstack/react-router'
import { ProjectsIndexPage } from '#/features/projects/components/ProjectsIndexPage'
import { loadPortfolioProjects } from '#/features/projects/server/queries/load-portfolio-projects'
import {
  PUBLIC_CMS_GC_MS,
  PUBLIC_CMS_STALE_MS,
  applyPublicCmsCacheHeaders,
} from '#/lib/cms-route-cache'

export const Route = createFileRoute('/projects/')({
  staleTime: PUBLIC_CMS_STALE_MS,
  gcTime: PUBLIC_CMS_GC_MS,
  loader: () => {
    applyPublicCmsCacheHeaders()
    return loadPortfolioProjects()
  },
  head: () => ({
    meta: [
      { title: 'Experience & Projects — Gayatri Law Offices' },
      {
        name: 'description',
        content:
          'Selected engagements across legal process outsourcing, remote paralegal support, litigation, research, and transactional work — with scope, deliverables, and outcomes.',
      },
    ],
  }),
  component: ProjectsIndexRoute,
})

function ProjectsIndexRoute() {
  const projects = Route.useLoaderData()
  return <ProjectsIndexPage projects={projects} />
}
