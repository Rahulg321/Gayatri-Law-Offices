import { createFileRoute } from '@tanstack/react-router'
import { AdminBlogsListPage } from '#/features/blogs/components/AdminBlogsListPage'
import { adminListBlogPosts } from '#/features/blogs/server/queries/admin-list-blog-posts'

export const Route = createFileRoute('/admin/blogs/')({
  loader: () => adminListBlogPosts(),
  component: AdminBlogsRoute,
})

function AdminBlogsRoute() {
  const items = Route.useLoaderData()
  return <AdminBlogsListPage items={items} />
}
