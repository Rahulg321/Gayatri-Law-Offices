import { Link, createFileRoute } from '@tanstack/react-router'
import { Pencil, Plus } from 'lucide-react'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { adminListPracticeAreas } from '#/lib/cms-admin'

export const Route = createFileRoute('/admin/practice-areas/')({
  loader: () => adminListPracticeAreas(),
  component: AdminPracticeAreasListPage,
})

function AdminPracticeAreasListPage() {
  const items = Route.useLoaderData()

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-[var(--charcoal)]">Practice areas</h1>
          <p className="text-sm text-[var(--charcoal-soft)]">{items.length} entries</p>
        </div>
        <Link to="/admin/practice-areas/$slug" params={{ slug: 'new' }}>
          <Button className="rounded-full bg-[var(--gold)] text-white hover:bg-[var(--gold-deep)]">
            <Plus className="mr-2 size-4" />
            New
          </Button>
        </Link>
      </div>
      <ul className="divide-y divide-[var(--line)] rounded-xl border border-[var(--line)] bg-white">
        {items.map((item) => (
          <li key={item.slug} className="flex items-center justify-between gap-4 px-4 py-3">
            <div>
              <p className="font-medium text-[var(--charcoal)]">
                {item.icon} {item.title}
              </p>
              <p className="text-xs text-[var(--slate-soft)]">{item.slug}</p>
            </div>
            <div className="flex items-center gap-2">
              {!item.published ? <Badge variant="secondary">Draft</Badge> : null}
              <Link to="/admin/practice-areas/$slug" params={{ slug: item.slug }}>
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
