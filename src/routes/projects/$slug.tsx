import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ProjectDetailPage } from "#/features/projects/components/ProjectDetailPage";
import { portfolioProjectHeadMeta } from "#/features/projects/helpers";
import { loadPortfolioProject } from "#/features/projects/server/queries/load-portfolio-projects";
import {
  PUBLIC_CMS_GC_MS,
  PUBLIC_CMS_STALE_MS,
  applyPublicCmsCacheHeaders,
} from "#/lib/cms-route-cache";

export const Route = createFileRoute("/projects/$slug")({
  staleTime: PUBLIC_CMS_STALE_MS,
  gcTime: PUBLIC_CMS_GC_MS,
  loader: async ({ params }) => {
    applyPublicCmsCacheHeaders();
    const data = await loadPortfolioProject({ data: params.slug });
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    const project = loaderData?.project;
    if (!project) return {};
    return portfolioProjectHeadMeta(project);
  },
  component: ProjectDetailRoute,
  notFoundComponent: () => (
    <main className="page-wrap px-4 pb-16 pt-28 sm:pt-32">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="display-title mb-4 text-3xl font-semibold text-[var(--charcoal)]">
          Project not found
        </h1>
        <p className="text-[var(--charcoal-soft)]">
          This project may have been removed.
        </p>
        <Link
          to="/projects"
          className="mt-6 inline-block text-sm font-medium text-[var(--gold-deep)] hover:underline"
        >
          Back to all projects
        </Link>
      </div>
    </main>
  ),
});

function ProjectDetailRoute() {
  const { project, related } = Route.useLoaderData();
  return <ProjectDetailPage project={project} related={related} />;
}
