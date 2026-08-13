import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { BlogPostPage } from "#/features/blogs/components/BlogPostPage";
import { blogPostHeadMeta } from "#/features/blogs/helpers";
import { loadBlogPost } from "#/features/blogs/server/queries/load-blog-posts";
import {
  PUBLIC_CMS_GC_MS,
  PUBLIC_CMS_STALE_MS,
  applyPublicCmsCacheHeaders,
} from "#/lib/cms-route-cache";

export const Route = createFileRoute("/blogs/$slug")({
  staleTime: PUBLIC_CMS_STALE_MS,
  gcTime: PUBLIC_CMS_GC_MS,
  loader: async ({ params }) => {
    applyPublicCmsCacheHeaders();
    const data = await loadBlogPost({ data: params.slug });
    if (!data) throw notFound();
    return data;
  },

  head: ({ loaderData }) => {
    const post = loaderData?.post;
    if (!post) return {};
    return blogPostHeadMeta(post);
  },

  component: BlogPostRoute,
  notFoundComponent: () => (
    <main className="page-wrap px-4 pb-16 pt-28 sm:pt-32">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="display-title mb-4 text-3xl font-semibold text-[var(--charcoal)]">
          Post not found
        </h1>
        <p className="text-[var(--charcoal-soft)]">
          This post may have been removed.
        </p>
        <Link
          to="/blogs"
          className="mt-6 inline-block text-sm font-medium text-[var(--gold-deep)] hover:underline"
        >
          Back to all posts
        </Link>
      </div>
    </main>
  ),
});

function BlogPostRoute() {
  const { post, related } = Route.useLoaderData();
  return <BlogPostPage post={post} related={related} />;
}
