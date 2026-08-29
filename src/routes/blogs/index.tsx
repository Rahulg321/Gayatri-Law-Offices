import { createFileRoute } from "@tanstack/react-router";
import { BlogsIndexPage } from "#/features/blogs/components/BlogsIndexPage";
import { loadBlogPosts } from "#/features/blogs/server/queries/load-blog-posts";
import {
  PUBLIC_CMS_GC_MS,
  PUBLIC_CMS_STALE_MS,
  applyPublicCmsCacheHeaders,
} from "#/lib/cms-route-cache";

export const Route = createFileRoute("/blogs/")({
  staleTime: PUBLIC_CMS_STALE_MS,
  gcTime: PUBLIC_CMS_GC_MS,
  loader: () => {
    applyPublicCmsCacheHeaders();
    return loadBlogPosts();
  },
  head: () => ({
    meta: [
      { title: "Blog — LPO Insights, Trends & Legal Tech" },
      {
        name: "description",
        content:
          "Insights on legal process outsourcing trends, practice area guides, and tips for law firms. Stay informed with Gayatri Legal Solutions.",
      },
    ],
  }),
  component: BlogsIndexRoute,
});

function BlogsIndexRoute() {
  const posts = Route.useLoaderData();
  return <BlogsIndexPage posts={posts} />;
}
