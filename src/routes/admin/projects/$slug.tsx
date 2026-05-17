import { useForm } from '@tanstack/react-form'
import { Link, createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import type { z } from 'zod'
import { ImageField } from '#/components/admin/ImageField'
import { MarkdownEditor } from '#/components/admin/MarkdownEditor'
import { SeoFields } from '#/components/admin/SeoFields'
import { StringListField } from '#/components/admin/StringListField'
import { Button } from '#/components/ui/button'
import { Field, FieldError, FieldLabel } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { Switch } from '#/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'
import { Textarea } from '#/components/ui/textarea'
import type { PortfolioProject } from '#/lib/cms'
import { adminDeleteProject, adminGetProject, adminSaveProject } from '#/lib/cms-admin'
import { adminPortfolioProjectFormSchema } from '#/lib/cms-schemas'
import { invalidateCmsRoutes } from '#/lib/cms-route-cache'
import { syncSlugFromTitle } from '#/lib/sync-slug-from-title'
import { portfolioProjectStatuses, portfolioProjectTypes } from '#/db/schema'

export const Route = createFileRoute('/admin/projects/$slug')({
  loader: ({ params }) =>
    params.slug === 'new' ? null : adminGetProject({ data: params.slug }),
  component: AdminProjectEditPage,
})

type ProjectFormValues = z.infer<typeof adminPortfolioProjectFormSchema>

function formatEnumLabel(s: string) {
  return s
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function projectDefaults(initial: PortfolioProject | null): ProjectFormValues {
  return {
    slug: initial?.slug ?? '',
    title: initial?.title ?? '',
    category: initial?.category ?? '',
    excerpt: initial?.excerpt ?? '',
    year: initial?.year ?? String(new Date().getFullYear()),
    duration: initial?.duration ?? '',
    role: initial?.role ?? '',
    summary: initial?.summary ?? '',
    bodyMarkdown: initial?.bodyMarkdown ?? '',
    featuredImageUrl: initial?.featuredImageUrl ?? '',
    startDate: initial?.startDate ?? '',
    endDate: initial?.endDate ?? '',
    ongoing: initial?.ongoing ?? false,
    projectStatus: initial?.projectStatus ?? 'completed',
    projectType: initial?.projectType ?? 'freelance',
    featured: initial?.featured ?? false,
    clientName: initial?.clientName ?? '',
    clientUrl: initial?.clientUrl ?? '',
    challengesMarkdown: initial?.challengesMarkdown ?? '',
    teamSize: initial?.teamSize ?? '',
    budgetRange: initial?.budgetRange ?? '',
    skills: initial?.skills?.length ? [...initial.skills] : [''],
    metrics: initial?.metrics?.length ? [...initial.metrics] : [''],
    gallery: initial?.gallery?.length
      ? initial.gallery.map((g) => ({
          url: g.url,
          alt: g.alt,
          caption: g.caption ?? '',
          sortOrder: g.sortOrder ?? 0,
        }))
      : [],
    videos: initial?.videos?.length
      ? initial.videos.map((v) => ({
          kind: v.kind,
          url: v.url,
          title: v.title ?? '',
        }))
      : [],
    links: initial?.links?.length
      ? initial.links.map((l) => ({
          title: l.title,
          url: l.url,
          icon: l.icon ?? '',
        }))
      : [],
    attachments: initial?.attachments?.length
      ? initial.attachments.map((a) => ({
          fileUrl: a.fileUrl,
          filename: a.filename,
          fileType: a.fileType ?? '',
          sizeBytes: a.sizeBytes ?? null,
        }))
      : [],
    testimonials: initial?.testimonials?.length
      ? initial.testimonials.map((t) => ({
          quote: t.quote,
          clientName: t.clientName,
          clientPhotoUrl: t.clientPhotoUrl ?? '',
        }))
      : [],
    tags: initial?.tags?.length ? [...initial.tags] : [''],
    scope: initial?.scope?.length ? initial.scope : [''],
    deliverables: initial?.deliverables?.length ? initial.deliverables : [''],
    outcomes: initial?.outcomes?.length ? initial.outcomes : [''],
    tools: initial?.tools?.length ? initial.tools : [''],
    published: initial?.published ?? true,
    sortOrder: initial?.sortOrder ?? 0,
    metaTitle: initial?.metaTitle ?? '',
    metaDescription: initial?.metaDescription ?? '',
    ogImageUrl: initial?.ogImageUrl ?? '',
    canonicalUrl: initial?.canonicalUrl ?? '',
    twitterCard: (initial?.twitterCard as 'summary_large_image' | 'summary') ?? 'summary_large_image',
  }
}

function AdminProjectEditPage() {
  const { slug: slugParam } = Route.useParams()
  return (
    <div>
      <ProjectEditForm key={slugParam} />
    </div>
  )
}

function ProjectEditForm() {
  const router = useRouter()
  const navigate = useNavigate()
  const initial = Route.useLoaderData()
  const isNew = Route.useParams().slug === 'new'
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const form = useForm({
    defaultValues: projectDefaults(initial),
    validators: {
      onSubmit: adminPortfolioProjectFormSchema,
      onBlur: adminPortfolioProjectFormSchema,
    },
    onSubmit: async ({ value }) => {
      setSaving(true)
      setError(null)
      try {
        const gallery = value.gallery
          .filter((g) => g.url.trim())
          .map((g, i) => ({
            url: g.url.trim(),
            alt: g.alt.trim(),
            caption: g.caption?.trim() || undefined,
            sortOrder: i,
          }))
        const videos = value.videos
          .filter((v) => v.url.trim())
          .map((v) => ({
            kind: v.kind,
            url: v.url.trim(),
            title: v.title?.trim() || undefined,
          }))
        const links = value.links
          .filter((l) => l.title.trim() && l.url.trim())
          .map((l) => ({
            title: l.title.trim(),
            url: l.url.trim(),
            icon: l.icon?.trim() || undefined,
          }))
        const attachments = value.attachments
          .filter((a) => a.fileUrl.trim() && a.filename.trim())
          .map((a) => ({
            fileUrl: a.fileUrl.trim(),
            filename: a.filename.trim(),
            fileType: a.fileType?.trim() || undefined,
            sizeBytes: a.sizeBytes ?? null,
          }))
        const testimonials = value.testimonials
          .filter((t) => t.quote.trim() && t.clientName.trim())
          .map((t) => ({
            quote: t.quote.trim(),
            clientName: t.clientName.trim(),
            clientPhotoUrl: t.clientPhotoUrl?.trim() || undefined,
          }))

        await adminSaveProject({
          data: {
            ...value,
            scope: value.scope.map((s) => s.trim()).filter(Boolean),
            deliverables: value.deliverables.map((s) => s.trim()).filter(Boolean),
            outcomes: value.outcomes.map((s) => s.trim()).filter(Boolean),
            tools: value.tools.map((s) => s.trim()).filter(Boolean),
            skills: value.skills.map((s) => s.trim()).filter(Boolean),
            metrics: value.metrics.map((s) => s.trim()).filter(Boolean),
            tags: value.tags.map((t) => t.trim()).filter(Boolean),
            gallery,
            videos,
            links,
            attachments,
            testimonials,
            startDate: value.startDate.trim() || null,
            endDate: value.endDate.trim() || null,
            clientName: value.clientName.trim() || null,
            clientUrl: value.clientUrl.trim() || null,
            teamSize: value.teamSize.trim() || null,
            budgetRange: value.budgetRange.trim() || null,
            featuredImageUrl: value.featuredImageUrl.trim() || null,
            metaTitle: value.metaTitle.trim() || null,
            metaDescription: value.metaDescription.trim() || null,
            ogImageUrl: value.ogImageUrl.trim() || null,
            canonicalUrl: value.canonicalUrl.trim() || null,
          },
        })
        await invalidateCmsRoutes(router)
        await navigate({ to: '/admin/projects' })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Save failed')
      } finally {
        setSaving(false)
      }
    },
  })

  const projectSlug = form.state.values.slug || 'draft'

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">{isNew ? 'New project' : 'Edit project'}</h1>
        <Link to="/admin/projects" className="text-accent text-sm hover:underline">
          Back to list
        </Link>
      </div>
      <form
        noValidate
        className="max-w-2xl space-y-8"
        onSubmit={(e) => {
          e.preventDefault()
          void form.handleSubmit()
        }}
      >
        <Tabs defaultValue="basics" className="w-full gap-4">
          <TabsList
            variant="line"
            className="flex h-auto min-h-9 w-full flex-wrap justify-start gap-1"
          >
            <TabsTrigger value="basics">Basics</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="publishing">Publishing</TabsTrigger>
          </TabsList>
          <TabsContent value="basics" className="mt-6 space-y-8">
        <fieldset className="border-border space-y-4 rounded-xl border p-4">
          <legend className="px-1 text-sm font-semibold">Identification</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <form.Field name="slug">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Slug</FieldLabel>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      disabled={!isNew}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
                  </Field>
                )
              }}
            </form.Field>
            <form.Field name="title">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        const title = e.target.value
                        field.handleChange(title)
                        syncSlugFromTitle(form, title)
                      }}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
                  </Field>
                )
              }}
            </form.Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <form.Field name="category">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Category</FieldLabel>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
                  </Field>
                )
              }}
            </form.Field>
            <form.Field name="year">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Year label</FieldLabel>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
                  </Field>
                )
              }}
            </form.Field>
          </div>
          <form.Field name="excerpt">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Short description</FieldLabel>
                  <Textarea
                    id={field.name}
                    value={field.state.value}
                    rows={3}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
                </Field>
              )
            }}
          </form.Field>
        </fieldset>

        <fieldset className="border-border space-y-4 rounded-xl border p-4">
          <legend className="px-1 text-sm font-semibold">Timeline & classification</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <form.Field name="startDate">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Start date (ISO optional)</FieldLabel>
                  <Input
                    id={field.name}
                    type="text"
                    placeholder="e.g. 2024-01-15"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </Field>
              )}
            </form.Field>
            <form.Field name="endDate">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>End date</FieldLabel>
                  <Input
                    id={field.name}
                    type="text"
                    placeholder="e.g. 2024-08-01"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </Field>
              )}
            </form.Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <form.Field name="duration">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Duration (display)</FieldLabel>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </Field>
              )}
            </form.Field>
            <form.Field name="ongoing">
              {(field) => (
                <Field orientation="horizontal" className="items-center pt-6">
                  <Switch
                    id="admin-project-ongoing"
                    checked={field.state.value}
                    onCheckedChange={(v) => field.handleChange(v)}
                  />
                  <FieldLabel htmlFor="admin-project-ongoing">Ongoing</FieldLabel>
                </Field>
              )}
            </form.Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <form.Field name="projectStatus">
              {(field) => (
                <Field>
                  <FieldLabel>Status</FieldLabel>
                  <Select value={field.state.value} onValueChange={(v) => field.handleChange(v as never)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {portfolioProjectStatuses.map((s) => (
                        <SelectItem key={s} value={s}>
                          {formatEnumLabel(s)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            </form.Field>
            <form.Field name="projectType">
              {(field) => (
                <Field>
                  <FieldLabel>Type</FieldLabel>
                  <Select value={field.state.value} onValueChange={(v) => field.handleChange(v as never)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {portfolioProjectTypes.map((s) => (
                        <SelectItem key={s} value={s}>
                          {formatEnumLabel(s)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            </form.Field>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <form.Field name="featured">
              {(field) => (
                <Field orientation="horizontal">
                  <Switch id="featured" checked={field.state.value} onCheckedChange={(v) => field.handleChange(v)} />
                  <FieldLabel htmlFor="featured">Featured on homepage</FieldLabel>
                </Field>
              )}
            </form.Field>
            <form.Field name="sortOrder">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Sort order</FieldLabel>
                    <Input
                      id={field.name}
                      type="number"
                      className="w-24"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        const n = Number(e.target.value)
                        field.handleChange(Number.isNaN(n) ? 0 : n)
                      }}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
                  </Field>
                )
              }}
            </form.Field>
          </div>
        </fieldset>

        <fieldset className="border-border space-y-4 rounded-xl border p-4">
          <legend className="px-1 text-sm font-semibold">Client</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <form.Field name="clientName">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Client / company name</FieldLabel>
                  <Input id={field.name} value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                </Field>
              )}
            </form.Field>
            <form.Field name="clientUrl">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Client URL</FieldLabel>
                  <Input id={field.name} type="url" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                </Field>
              )}
            </form.Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <form.Field name="role">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Your role</FieldLabel>
                  <Input id={field.name} value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} />
                </Field>
              )}
            </form.Field>
            <form.Field name="teamSize">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Team size</FieldLabel>
                  <Input id={field.name} value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                </Field>
              )}
            </form.Field>
          </div>
          <form.Field name="budgetRange">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Budget range</FieldLabel>
                <Input id={field.name} value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
              </Field>
            )}
          </form.Field>
        </fieldset>
          </TabsContent>
          <TabsContent value="content" className="mt-6 space-y-8">

        <fieldset className="border-border space-y-4 rounded-xl border p-4">
          <legend className="px-1 text-sm font-semibold">Narrative</legend>
          <form.Field name="summary">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Lead summary</FieldLabel>
                  <Textarea
                    id={field.name}
                    value={field.state.value}
                    rows={4}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
                </Field>
              )
            }}
          </form.Field>
          <form.Field name="bodyMarkdown">
            {(field) => (
              <Field>
                <FieldLabel>Full story (Markdown)</FieldLabel>
                <MarkdownEditor value={field.state.value} onChange={(v) => field.handleChange(v)} />
              </Field>
            )}
          </form.Field>
          <form.Field name="challengesMarkdown">
            {(field) => (
              <Field>
                <FieldLabel>Challenges (Markdown, optional)</FieldLabel>
                <MarkdownEditor value={field.state.value} onChange={(v) => field.handleChange(v)} />
              </Field>
            )}
          </form.Field>
        </fieldset>

        <fieldset className="border-border space-y-4 rounded-xl border p-4">
          <legend className="px-1 text-sm font-semibold">Skills & stacks</legend>
          <form.Field name="skills">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <div className="space-y-1">
                  <StringListField label="Skills" values={field.state.value} onChange={(v) => field.handleChange(v)} />
                  {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
                </div>
              )
            }}
          </form.Field>
          <form.Field name="tools">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <div className="space-y-1">
                  <StringListField label="Tools & software" values={field.state.value} onChange={(v) => field.handleChange(v)} />
                  {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
                </div>
              )
            }}
          </form.Field>
          <form.Field name="metrics">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <div className="space-y-1">
                  <StringListField
                    label="Key metrics"
                    values={field.state.value}
                    onChange={(v) => field.handleChange(v)}
                  />
                  {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
                </div>
              )
            }}
          </form.Field>
          <form.Field name="tags">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <div className="space-y-1">
                  <StringListField label="Tags" values={field.state.value} onChange={(v) => field.handleChange(v)} />
                  {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
                </div>
              )
            }}
          </form.Field>
        </fieldset>

        <fieldset className="border-border space-y-4 rounded-xl border p-4">
          <legend className="px-1 text-sm font-semibold">Structured lists</legend>
          <form.Field name="scope">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <div className="space-y-1">
                  <StringListField label="Scope" values={field.state.value} onChange={(v) => field.handleChange(v)} />
                  {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
                </div>
              )
            }}
          </form.Field>
          <form.Field name="deliverables">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <div className="space-y-1">
                  <StringListField label="Deliverables" values={field.state.value} onChange={(v) => field.handleChange(v)} />
                  {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
                </div>
              )
            }}
          </form.Field>
          <form.Field name="outcomes">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <div className="space-y-1">
                  <StringListField label="Outcomes & narrative" values={field.state.value} onChange={(v) => field.handleChange(v)} />
                  {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
                </div>
              )
            }}
          </form.Field>
        </fieldset>
          </TabsContent>
          <TabsContent value="media" className="mt-6 space-y-8">

        <fieldset className="border-border space-y-4 rounded-xl border p-4">
          <legend className="px-1 text-sm font-semibold">Media</legend>
          <form.Field name="featuredImageUrl">
            {(field) => (
              <ImageField
                label="Featured / hero image"
                hint="Shown on listings and detail hero."
                value={field.state.value}
                onChange={(url) => field.handleChange(url)}
                uploadTarget={{ kind: 'portfolio', projectSlug }}
              />
            )}
          </form.Field>
          <form.Field name="gallery">
            {(field) => (
              <Field>
                <FieldLabel>Gallery</FieldLabel>
                <div className="border-border mt-2 space-y-6 rounded-xl border p-4">
                  {field.state.value.map((item, idx) => (
                    <div key={`g-${idx}`} className="border-border relative space-y-3 rounded-lg border p-4">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="absolute right-2 top-2"
                        onClick={() => field.handleChange(field.state.value.filter((_, i) => i !== idx))}
                      >
                        Remove
                      </Button>
                      <ImageField
                        label="Image URL"
                        value={item.url}
                        onChange={(url) => {
                          const next = [...field.state.value]
                          next[idx] = { ...next[idx], url }
                          field.handleChange(next)
                        }}
                        uploadTarget={{ kind: 'portfolio', projectSlug }}
                      />
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <FieldLabel className="text-xs">Alt text</FieldLabel>
                          <Input
                            value={item.alt}
                            onChange={(e) => {
                              const next = [...field.state.value]
                              next[idx] = { ...next[idx], alt: e.target.value }
                              field.handleChange(next)
                            }}
                          />
                        </div>
                        <div>
                          <FieldLabel className="text-xs">Caption</FieldLabel>
                          <Input
                            value={item.caption ?? ''}
                            onChange={(e) => {
                              const next = [...field.state.value]
                              next[idx] = { ...next[idx], caption: e.target.value }
                              field.handleChange(next)
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      field.handleChange([
                        ...field.state.value,
                        { url: '', alt: '', caption: '', sortOrder: field.state.value.length },
                      ])
                    }
                  >
                    Add gallery image
                  </Button>
                </div>
              </Field>
            )}
          </form.Field>
          <form.Field name="videos">
            {(field) => (
              <Field>
                <FieldLabel>Videos</FieldLabel>
                <div className="border-border mt-2 space-y-6 rounded-xl border p-4">
                  {field.state.value.map((item, idx) => (
                    <div key={`v-${idx}`} className="border-border relative space-y-3 rounded-lg border p-4">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="absolute right-2 top-2"
                        onClick={() => field.handleChange(field.state.value.filter((_, i) => i !== idx))}
                      >
                        Remove
                      </Button>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <FieldLabel className="text-xs">Source</FieldLabel>
                          <Select
                            value={item.kind}
                            onValueChange={(v) => {
                              const next = [...field.state.value]
                              next[idx] = { ...next[idx], kind: v as (typeof item)['kind'] }
                              field.handleChange(next)
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="youtube">YouTube</SelectItem>
                              <SelectItem value="vimeo">Vimeo</SelectItem>
                              <SelectItem value="file">MP4/WebM URL</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <FieldLabel className="text-xs">Title (optional)</FieldLabel>
                          <Input
                            value={item.title ?? ''}
                            onChange={(e) => {
                              const next = [...field.state.value]
                              next[idx] = { ...next[idx], title: e.target.value }
                              field.handleChange(next)
                            }}
                          />
                        </div>
                      </div>
                      <Input
                        placeholder="Video URL"
                        value={item.url}
                        onChange={(e) => {
                          const next = [...field.state.value]
                          next[idx] = { ...next[idx], url: e.target.value }
                          field.handleChange(next)
                        }}
                      />
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      field.handleChange([...field.state.value, { kind: 'youtube', url: '', title: '' }])
                    }
                  >
                    Add video
                  </Button>
                </div>
              </Field>
            )}
          </form.Field>
        </fieldset>

        <fieldset className="border-border space-y-4 rounded-xl border p-4">
          <legend className="px-1 text-sm font-semibold">Links & files</legend>
          <form.Field name="links">
            {(field) => (
              <Field>
                <FieldLabel>Outbound links</FieldLabel>
                <div className="border-border mt-2 space-y-4 rounded-xl border p-4">
                  {field.state.value.map((item, idx) => (
                    <div key={`l-${idx}`} className="border-border grid gap-3 rounded-lg border p-3 sm:grid-cols-3">
                      <Input
                        placeholder="Title"
                        value={item.title}
                        onChange={(e) => {
                          const next = [...field.state.value]
                          next[idx] = { ...next[idx], title: e.target.value }
                          field.handleChange(next)
                        }}
                      />
                      <Input
                        placeholder="URL"
                        className="sm:col-span-2"
                        value={item.url}
                        onChange={(e) => {
                          const next = [...field.state.value]
                          next[idx] = { ...next[idx], url: e.target.value }
                          field.handleChange(next)
                        }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="sm:col-span-3"
                        onClick={() => field.handleChange(field.state.value.filter((_, i) => i !== idx))}
                      >
                        Remove row
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => field.handleChange([...field.state.value, { title: '', url: '', icon: '' }])}
                  >
                    Add link
                  </Button>
                </div>
              </Field>
            )}
          </form.Field>

          <form.Field name="attachments">
            {(field) => (
              <Field>
                <FieldLabel>Attachments (PDF, etc.)</FieldLabel>
                <div className="border-border mt-2 space-y-6 rounded-xl border p-4">
                  {field.state.value.map((item, idx) => (
                    <div key={`a-${idx}`} className="border-border relative space-y-3 rounded-lg border p-4">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="absolute right-2 top-2"
                        onClick={() => field.handleChange(field.state.value.filter((_, i) => i !== idx))}
                      >
                        Remove
                      </Button>
                      <Input
                        placeholder="Display filename"
                        value={item.filename}
                        onChange={(e) => {
                          const next = [...field.state.value]
                          next[idx] = { ...next[idx], filename: e.target.value }
                          field.handleChange(next)
                        }}
                      />
                      <Input
                        placeholder="MIME type (optional)"
                        value={item.fileType ?? ''}
                        onChange={(e) => {
                          const next = [...field.state.value]
                          next[idx] = { ...next[idx], fileType: e.target.value }
                          field.handleChange(next)
                        }}
                      />
                      <ImageField
                        label="File URL"
                        hint="PDF or hosted video file (upload)."
                        accept="application/pdf,video/mp4,video/webm"
                        value={item.fileUrl}
                        onChange={(url) => {
                          const next = [...field.state.value]
                          next[idx] = { ...next[idx], fileUrl: url }
                          if (!(next[idx].filename ?? '').trim() && url) {
                            try {
                              const last = decodeURIComponent(url.split('/').pop() ?? '')
                              next[idx].filename = last || next[idx].filename
                            } catch {
                              /* ignore */
                            }
                          }
                          field.handleChange(next)
                        }}
                        uploadTarget={{ kind: 'portfolio', projectSlug }}
                      />
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      field.handleChange([...field.state.value, { fileUrl: '', filename: '', fileType: '', sizeBytes: null }])
                    }
                  >
                    Add attachment
                  </Button>
                </div>
              </Field>
            )}
          </form.Field>
        </fieldset>
          </TabsContent>
          <TabsContent value="publishing" className="mt-6 space-y-8">

        <fieldset className="border-border space-y-4 rounded-xl border p-4">
          <legend className="px-1 text-sm font-semibold">Testimonials</legend>
          <form.Field name="testimonials">
            {(field) => (
              <div className="border-border mt-2 space-y-6 rounded-xl border p-4">
                {field.state.value.map((item, idx) => (
                  <div key={`t-${idx}`} className="border-border relative space-y-3 rounded-lg border p-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="absolute right-2 top-2"
                      onClick={() => field.handleChange(field.state.value.filter((_, i) => i !== idx))}
                    >
                      Remove
                    </Button>
                    <FieldLabel className="text-xs">Quote</FieldLabel>
                    <Textarea
                      rows={3}
                      value={item.quote}
                      onChange={(e) => {
                        const next = [...field.state.value]
                        next[idx] = { ...next[idx], quote: e.target.value }
                        field.handleChange(next)
                      }}
                    />
                    <FieldLabel className="text-xs">Client name</FieldLabel>
                    <Input
                      value={item.clientName}
                      onChange={(e) => {
                        const next = [...field.state.value]
                        next[idx] = { ...next[idx], clientName: e.target.value }
                        field.handleChange(next)
                      }}
                    />
                    <ImageField
                      label="Client photo URL (optional)"
                      value={item.clientPhotoUrl ?? ''}
                      onChange={(url) => {
                        const next = [...field.state.value]
                        next[idx] = { ...next[idx], clientPhotoUrl: url }
                        field.handleChange(next)
                      }}
                      uploadTarget={{ kind: 'portfolio', projectSlug }}
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    field.handleChange([...field.state.value, { quote: '', clientName: '', clientPhotoUrl: '' }])
                  }
                >
                  Add testimonial
                </Button>
              </div>
            )}
          </form.Field>
        </fieldset>

        <fieldset className="border-border rounded-xl border p-4">
          <legend className="px-1 text-sm font-semibold">Publishing</legend>
          <div className="flex flex-wrap items-center gap-6 pt-2">
            <form.Field name="published">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field orientation="horizontal" data-invalid={isInvalid}>
                    <Switch
                      id="admin-project-published"
                      checked={field.state.value}
                      onCheckedChange={(v) => field.handleChange(v)}
                      aria-invalid={isInvalid}
                    />
                    <FieldLabel htmlFor="admin-project-published">Published</FieldLabel>
                    {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
                  </Field>
                )
              }}
            </form.Field>
          </div>
        </fieldset>

        <SeoFields form={form} showCanonical showTwitterCard />

          </TabsContent>
        </Tabs>

        {error ? <p className="text-destructive text-sm">{error}</p> : null}
        <div className="flex gap-3">
          <Button type="submit" disabled={saving} className="bg-accent text-accent-foreground hover:bg-accent/90">
            {saving ? 'Saving…' : 'Save'}
          </Button>
          {!isNew ? (
            <Button
              type="button"
              variant="destructive"
              onClick={async () => {
                if (!confirm('Delete this project?')) return
                await adminDeleteProject({ data: form.getFieldValue('slug') })
                await invalidateCmsRoutes(router)
                await navigate({ to: '/admin/projects' })
              }}
            >
              Delete
            </Button>
          ) : null}
        </div>
      </form>
    </div>
  )
}
