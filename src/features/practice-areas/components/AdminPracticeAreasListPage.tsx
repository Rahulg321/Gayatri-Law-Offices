import { Link, useRouter } from '@tanstack/react-router'
import { ArrowDown, ArrowUp, Pencil, Plus } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { adminMovePracticeArea } from '#/features/practice-areas/server/mutations/move-practice-area'
import { invalidateCmsRoutes } from '#/lib/cms-route-cache'
import type { PracticeArea } from '#/lib/cms'

export function AdminPracticeAreasListPage({ items }: { items: PracticeArea[] }) {
  const router = useRouter()
  const [moving, setMoving] = useState<string | null>(null)

  async function handleMove(slug: string, direction: 'up' | 'down') {
    setMoving(slug)
    try {
      const result = await adminMovePracticeArea({ data: { slug, direction } })
      if (result.ok) {
        await invalidateCmsRoutes(router)
      }
    } finally {
      setMoving(null)
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Practice areas</h1>
          <p className="text-muted-foreground text-sm">{items.length} entries</p>
        </div>
        <Link to="/admin/practice-areas/$slug" params={{ slug: 'new' }}>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full">
            <Plus className="mr-2 size-4" />
            New
          </Button>
        </Link>
      </div>
      <ul className="divide-border bg-card divide-y rounded-xl border border-border">
        {items.map((item, index) => (
          <li key={item.slug} className="flex items-center justify-between gap-4 px-4 py-3">
            <div>
              <p className="font-medium">
                {item.icon} {item.title}
              </p>
              <p className="text-muted-foreground text-xs">
                {item.slug} · sort {item.sortOrder}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={index === 0 || moving !== null}
                  onClick={() => void handleMove(item.slug, 'up')}
                  aria-label={`Move ${item.title} up`}
                >
                  <ArrowUp className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={index === items.length - 1 || moving !== null}
                  onClick={() => void handleMove(item.slug, 'down')}
                  aria-label={`Move ${item.title} down`}
                >
                  <ArrowDown className="size-4" />
                </Button>
              </div>
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
