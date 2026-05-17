import { Link, createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import type { z } from 'zod'
import { SeoFields } from '#/components/admin/SeoFields'
import { StringListField } from '#/components/admin/StringListField'
import { Button } from '#/components/ui/button'
import { Field, FieldError, FieldLabel } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { Switch } from '#/components/ui/switch'
import { Textarea } from '#/components/ui/textarea'
import type { PracticeArea } from '#/lib/cms'
import {
  adminDeletePracticeArea,
  adminGetPracticeArea,
  adminSavePracticeArea,
} from '#/lib/cms-admin'
import { adminPracticeAreaFormSchema } from '#/lib/cms-schemas'
import { invalidateCmsRoutes } from '#/lib/cms-route-cache'

export const Route = createFileRoute('/admin/practice-areas/$slug')({
  loader: ({ params }) =>
    params.slug === 'new' ? null : adminGetPracticeArea({ data: params.slug }),
  component: AdminPracticeAreaEditPage,
})

type PracticeAreaFormValues = z.infer<typeof adminPracticeAreaFormSchema>

function practiceAreaDefaults(initial: PracticeArea | null): PracticeAreaFormValues {
  return {
    slug: initial?.slug ?? '',
    title: initial?.title ?? '',
    short: initial?.short ?? '',
    description: initial?.description ?? '',
    icon: initial?.icon ?? '📄',
    benefits: initial?.benefits?.length ? initial.benefits : [''],
    published: initial?.published ?? true,
    sortOrder: initial?.sortOrder ?? 0,
    metaTitle: initial?.metaTitle ?? '',
    metaDescription: initial?.metaDescription ?? '',
    ogImageUrl: initial?.ogImageUrl ?? '',
  }
}

function AdminPracticeAreaEditPage() {
  const { slug: slugParam } = Route.useParams()
  return (
    <div>
      <PracticeAreaEditForm key={slugParam} />
    </div>
  )
}

function PracticeAreaEditForm() {
  const router = useRouter()
  const navigate = useNavigate()
  const initial = Route.useLoaderData()
  const isNew = Route.useParams().slug === 'new'
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const form = useForm({
    defaultValues: practiceAreaDefaults(initial),
    validators: {
      onSubmit: adminPracticeAreaFormSchema,
      onBlur: adminPracticeAreaFormSchema,
    },
    onSubmit: async ({ value }) => {
      setSaving(true)
      setError(null)
      try {
        await adminSavePracticeArea({
          data: {
            ...value,
            benefits: value.benefits.filter(Boolean),
            icon: value.icon.trim() || '📄',
            metaTitle: value.metaTitle || null,
            metaDescription: value.metaDescription || null,
            ogImageUrl: value.ogImageUrl || null,
          },
        })
        await invalidateCmsRoutes(router)
        await navigate({ to: '/admin/practice-areas' })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Save failed')
      } finally {
        setSaving(false)
      }
    },
  })

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">
          {isNew ? 'New practice area' : 'Edit practice area'}
        </h1>
        <Link to="/admin/practice-areas" className="text-accent text-sm hover:underline">
          Back to list
        </Link>
      </div>
      <form
        noValidate
        className="max-w-2xl space-y-6"
        onSubmit={(e) => {
          e.preventDefault()
          void form.handleSubmit()
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="slug">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Slug</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
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
          <form.Field name="icon">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Icon</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
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
        <form.Field name="title">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
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
        <form.Field name="short">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Short description</FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  rows={2}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                />
                {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
              </Field>
            )
          }}
        </form.Field>
        <form.Field name="description">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Full description</FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  rows={5}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                />
                {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
              </Field>
            )
          }}
        </form.Field>
        <form.Field name="benefits">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <div className="space-y-1">
                <StringListField
                  label="Benefits"
                  values={field.state.value}
                  onChange={(v) => field.handleChange(v)}
                />
                {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
              </div>
            )
          }}
        </form.Field>
        <div className="flex flex-wrap items-center gap-6">
          <form.Field name="published">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field orientation="horizontal" data-invalid={isInvalid}>
                  <Switch
                    id="admin-pa-published"
                    name={field.name}
                    checked={field.state.value}
                    onCheckedChange={(v) => field.handleChange(v)}
                    aria-invalid={isInvalid}
                  />
                  <FieldLabel htmlFor="admin-pa-published">Published</FieldLabel>
                  {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
                </Field>
              )
            }}
          </form.Field>
          <form.Field name="sortOrder">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Sort order</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
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
        <SeoFields form={form} />
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
                if (!confirm('Delete this practice area?')) return
                await adminDeletePracticeArea({ data: form.getFieldValue('slug') })
                await invalidateCmsRoutes(router)
                await navigate({ to: '/admin/practice-areas' })
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
