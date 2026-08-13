import { createFileRoute } from "@tanstack/react-router";
import { AdminBlogEditPage } from "#/features/blogs/components/AdminBlogEditPage";
import { adminGetBlogPost } from "#/features/blogs/server/queries/admin-list-blog-posts";

export const Route = createFileRoute("/admin/blogs/$slug")({
  loader: ({ params }) =>
    params.slug === "new" ? null : adminGetBlogPost({ data: params.slug }),
  component: AdminBlogEditRoute,
});

function AdminBlogEditRoute() {
  const { slug } = Route.useParams();
  const initial = Route.useLoaderData();
  return <AdminBlogEditPage slug={slug} initial={initial} />;
}
