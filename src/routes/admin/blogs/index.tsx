import { Link, createFileRoute } from '@tanstack/react-router'
import { Pencil, Plus } from 'lucide-react'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { adminListBlogPosts } from '#/lib/cms-admin'

export const Route = createFileRoute('/admin/blogs/')({
  loader: () => adminListBlogPosts(),
  component: AdminBlogsListPage,
})

function AdminBlogsListPage() {
  const items = Route.useLoaderData()

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Blogs</h1>
          <p className="text-muted-foreground text-sm">{items.length} posts</p>
        </div>
        <Link to="/admin/blogs/$slug" params={{ slug: 'new' }}>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full">
            <Plus className="mr-2 size-4" />
            New post
          </Button>
        </Link>
      </div>
      <ul className="divide-border bg-card divide-y rounded-xl border border-border">
        {items.map((item) => (
          <li key={item.slug} className="flex items-center justify-between gap-4 px-4 py-3">
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-muted-foreground text-xs">
                {item.category} · {item.date}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {!item.published ? <Badge variant="secondary">Draft</Badge> : null}
              <Link to="/admin/blogs/$slug" params={{ slug: item.slug }}>
                <Button type="button" variant="outline" size="sm">
                  <Pencil className="size-4" />
                </Button>
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
