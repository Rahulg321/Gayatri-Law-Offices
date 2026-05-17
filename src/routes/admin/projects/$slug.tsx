import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import type { z } from "zod";
import { SeoFields } from "#/components/admin/SeoFields";
import { StringListField } from "#/components/admin/StringListField";
import { Button } from "#/components/ui/button";
import { Field, FieldError, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { Switch } from "#/components/ui/switch";
import { Textarea } from "#/components/ui/textarea";
import type { PortfolioProject } from "#/lib/cms";
import {
  adminDeleteProject,
  adminGetProject,
  adminSaveProject,
} from "#/lib/cms-admin";
import { adminPortfolioProjectFormSchema } from "#/lib/cms-schemas";

export const Route = createFileRoute("/admin/projects/$slug")({
  loader: ({ params }) =>
    params.slug === "new" ? null : adminGetProject({ data: params.slug }),
  component: AdminProjectEditPage,
});

type ProjectFormValues = z.infer<typeof adminPortfolioProjectFormSchema>;

function projectDefaults(initial: PortfolioProject | null): ProjectFormValues {
  return {
    slug: initial?.slug ?? "",
    title: initial?.title ?? "",
    category: initial?.category ?? "",
    excerpt: initial?.excerpt ?? "",
    year: initial?.year ?? String(new Date().getFullYear()),
    duration: initial?.duration ?? "",
    role: initial?.role ?? "",
    summary: initial?.summary ?? "",
    scope: initial?.scope?.length ? initial.scope : [""],
    deliverables: initial?.deliverables?.length ? initial.deliverables : [""],
    outcomes: initial?.outcomes?.length ? initial.outcomes : [""],
    tools: initial?.tools?.length ? initial.tools : [""],
    published: initial?.published ?? true,
    sortOrder: initial?.sortOrder ?? 0,
    metaTitle: initial?.metaTitle ?? "",
    metaDescription: initial?.metaDescription ?? "",
    ogImageUrl: initial?.ogImageUrl ?? "",
  };
}

function AdminProjectEditPage() {
  const { slug: slugParam } = Route.useParams();
  return (
    <div>
      <ProjectEditForm key={slugParam} />
    </div>
  );
}

function ProjectEditForm() {
  const navigate = useNavigate();
  const initial = Route.useLoaderData();
  const isNew = Route.useParams().slug === "new";
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const form = useForm({
    defaultValues: projectDefaults(initial),
    validators: {
      onSubmit: adminPortfolioProjectFormSchema,
      onBlur: adminPortfolioProjectFormSchema,
    },
    onSubmit: async ({ value }) => {
      setSaving(true);
      setError(null);
      try {
        await adminSaveProject({
          data: {
            ...value,
            scope: value.scope.filter(Boolean),
            deliverables: value.deliverables.filter(Boolean),
            outcomes: value.outcomes.filter(Boolean),
            tools: value.tools.filter(Boolean),
            metaTitle: value.metaTitle || null,
            metaDescription: value.metaDescription || null,
            ogImageUrl: value.ogImageUrl || null,
          },
        });
        await navigate({ to: "/admin/projects" });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Save failed");
      } finally {
        setSaving(false);
      }
    },
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-[var(--charcoal)]">
          {isNew ? "New project" : "Edit project"}
        </h1>
        <Link to="/admin/projects" className="text-sm text-[var(--gold)]">
          Back to list
        </Link>
      </div>
      <form
        noValidate
        className="max-w-2xl space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          void form.handleSubmit();
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="slug">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
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
                  {isInvalid ? (
                    <FieldError errors={field.state.meta.errors} />
                  ) : null}
                </Field>
              );
            }}
          </form.Field>
          <form.Field name="year">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Year</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid ? (
                    <FieldError errors={field.state.meta.errors} />
                  ) : null}
                </Field>
              );
            }}
          </form.Field>
        </div>
        <form.Field name="title">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
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
                {isInvalid ? (
                  <FieldError errors={field.state.meta.errors} />
                ) : null}
              </Field>
            );
          }}
        </form.Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="category">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Category</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid ? (
                    <FieldError errors={field.state.meta.errors} />
                  ) : null}
                </Field>
              );
            }}
          </form.Field>
          <form.Field name="duration">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Duration</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid ? (
                    <FieldError errors={field.state.meta.errors} />
                  ) : null}
                </Field>
              );
            }}
          </form.Field>
        </div>
        <form.Field name="role">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Role</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                />
                {isInvalid ? (
                  <FieldError errors={field.state.meta.errors} />
                ) : null}
              </Field>
            );
          }}
        </form.Field>
        <form.Field name="excerpt">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Excerpt</FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  rows={2}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                />
                {isInvalid ? (
                  <FieldError errors={field.state.meta.errors} />
                ) : null}
              </Field>
            );
          }}
        </form.Field>
        <form.Field name="summary">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Summary</FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  rows={4}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                />
                {isInvalid ? (
                  <FieldError errors={field.state.meta.errors} />
                ) : null}
              </Field>
            );
          }}
        </form.Field>
        <form.Field name="scope">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <div className="space-y-1">
                <StringListField
                  label="Scope"
                  values={field.state.value}
                  onChange={(v) => field.handleChange(v)}
                />
                {isInvalid ? (
                  <FieldError errors={field.state.meta.errors} />
                ) : null}
              </div>
            );
          }}
        </form.Field>
        <form.Field name="deliverables">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <div className="space-y-1">
                <StringListField
                  label="Deliverables"
                  values={field.state.value}
                  onChange={(v) => field.handleChange(v)}
                />
                {isInvalid ? (
                  <FieldError errors={field.state.meta.errors} />
                ) : null}
              </div>
            );
          }}
        </form.Field>
        <form.Field name="outcomes">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <div className="space-y-1">
                <StringListField
                  label="Outcomes"
                  values={field.state.value}
                  onChange={(v) => field.handleChange(v)}
                />
                {isInvalid ? (
                  <FieldError errors={field.state.meta.errors} />
                ) : null}
              </div>
            );
          }}
        </form.Field>
        <form.Field name="tools">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <div className="space-y-1">
                <StringListField
                  label="Tools"
                  values={field.state.value}
                  onChange={(v) => field.handleChange(v)}
                />
                {isInvalid ? (
                  <FieldError errors={field.state.meta.errors} />
                ) : null}
              </div>
            );
          }}
        </form.Field>
        <div className="flex flex-wrap items-center gap-6">
          <form.Field name="published">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field orientation="horizontal" data-invalid={isInvalid}>
                  <Switch
                    id="admin-project-published"
                    name={field.name}
                    checked={field.state.value}
                    onCheckedChange={(v) => field.handleChange(v)}
                    aria-invalid={isInvalid}
                  />
                  <FieldLabel htmlFor="admin-project-published">
                    Published
                  </FieldLabel>
                  {isInvalid ? (
                    <FieldError errors={field.state.meta.errors} />
                  ) : null}
                </Field>
              );
            }}
          </form.Field>
          <form.Field name="sortOrder">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
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
                      const n = Number(e.target.value);
                      field.handleChange(Number.isNaN(n) ? 0 : n);
                    }}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid ? (
                    <FieldError errors={field.state.meta.errors} />
                  ) : null}
                </Field>
              );
            }}
          </form.Field>
        </div>
        <SeoFields form={form} />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={saving}
            className="bg-[var(--gold)] text-white"
          >
            {saving ? "Saving…" : "Save"}
          </Button>
          {!isNew ? (
            <Button
              type="button"
              variant="destructive"
              onClick={async () => {
                if (!confirm("Delete this project?")) return;
                await adminDeleteProject({ data: form.getFieldValue("slug") });
                await navigate({ to: "/admin/projects" });
              }}
            >
              Delete
            </Button>
          ) : null}
        </div>
      </form>
    </div>
  );
}
