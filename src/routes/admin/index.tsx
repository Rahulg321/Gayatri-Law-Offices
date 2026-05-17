import { Link, createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '#/components/ui/button'
import { adminSeedCms } from '#/lib/cms-admin'

export const Route = createFileRoute('/admin/')({
  component: AdminDashboardPage,
})

function AdminDashboardPage() {
  const [seedStatus, setSeedStatus] = useState<string | null>(null)

  return (
    <div>
      <h1 className="mb-2 text-3xl font-semibold text-[var(--charcoal)]">Dashboard</h1>
      <p className="mb-8 text-[var(--charcoal-soft)]">
        Manage practice areas, blog posts, and portfolio projects.
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          to="/admin/practice-areas"
          className="rounded-xl border border-[var(--line)] bg-white p-6 no-underline transition-shadow hover:shadow-md"
        >
          <h2 className="font-semibold text-[var(--charcoal)]">Practice areas</h2>
          <p className="mt-1 text-sm text-[var(--charcoal-soft)]">Services & LPO offerings</p>
        </Link>
        <Link
          to="/admin/blogs"
          className="rounded-xl border border-[var(--line)] bg-white p-6 no-underline transition-shadow hover:shadow-md"
        >
          <h2 className="font-semibold text-[var(--charcoal)]">Blogs</h2>
          <p className="mt-1 text-sm text-[var(--charcoal-soft)]">Articles & insights</p>
        </Link>
        <Link
          to="/admin/projects"
          className="rounded-xl border border-[var(--line)] bg-white p-6 no-underline transition-shadow hover:shadow-md"
        >
          <h2 className="font-semibold text-[var(--charcoal)]">Projects</h2>
          <p className="mt-1 text-sm text-[var(--charcoal-soft)]">Portfolio case studies</p>
        </Link>
      </div>
      <div className="mt-10 rounded-xl border border-dashed border-[var(--line)] bg-white p-6">
        <h3 className="mb-2 font-semibold">Initial data</h3>
        <p className="mb-4 text-sm text-[var(--charcoal-soft)]">
          Import content from the original static site data (only fills empty tables).
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={async () => {
            setSeedStatus('Seeding…')
            try {
              await adminSeedCms()
              setSeedStatus('Seed complete.')
            } catch {
              setSeedStatus('Seed failed.')
            }
          }}
        >
          Seed from static data
        </Button>
        {seedStatus ? <p className="mt-2 text-sm text-[var(--charcoal-soft)]">{seedStatus}</p> : null}
      </div>
    </div>
  )
}
