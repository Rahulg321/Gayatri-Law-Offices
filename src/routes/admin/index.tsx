import { Link, createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '#/components/ui/button'
import { adminSeedCms } from '#/lib/cms-admin'
import { invalidateCmsRoutes } from '#/lib/cms-route-cache'

export const Route = createFileRoute('/admin/')({
  component: AdminDashboardPage,
})

function AdminDashboardPage() {
  const router = useRouter()
  const [seedStatus, setSeedStatus] = useState<string | null>(null)

  return (
    <div>
      <h1 className="mb-2 text-3xl font-semibold">Dashboard</h1>
      <p className="text-muted-foreground mb-8">
        Manage practice areas, blog posts, and portfolio projects.
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          to="/admin/practice-areas"
          className="bg-card text-card-foreground rounded-xl border border-border p-6 no-underline transition-shadow hover:shadow-md"
        >
          <h2 className="font-semibold">Practice areas</h2>
          <p className="text-muted-foreground mt-1 text-sm">Services & LPO offerings</p>
        </Link>
        <Link
          to="/admin/blogs"
          className="bg-card text-card-foreground rounded-xl border border-border p-6 no-underline transition-shadow hover:shadow-md"
        >
          <h2 className="font-semibold">Blogs</h2>
          <p className="text-muted-foreground mt-1 text-sm">Articles & insights</p>
        </Link>
        <Link
          to="/admin/projects"
          className="bg-card text-card-foreground rounded-xl border border-border p-6 no-underline transition-shadow hover:shadow-md"
        >
          <h2 className="font-semibold">Projects</h2>
          <p className="text-muted-foreground mt-1 text-sm">Portfolio case studies</p>
        </Link>
      </div>
      <div className="bg-card mt-10 rounded-xl border border-dashed border-border p-6">
        <h3 className="mb-2 font-semibold">Initial data</h3>
        <p className="text-muted-foreground mb-4 text-sm">
          Import content from the original static site data (only fills empty tables).
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={async () => {
            setSeedStatus('Seeding…')
            try {
              await adminSeedCms()
              await invalidateCmsRoutes(router)
              setSeedStatus('Seed complete.')
            } catch {
              setSeedStatus('Seed failed.')
            }
          }}
        >
          Seed from static data
        </Button>
        {seedStatus ? <p className="text-muted-foreground mt-2 text-sm">{seedStatus}</p> : null}
      </div>
    </div>
  )
}
