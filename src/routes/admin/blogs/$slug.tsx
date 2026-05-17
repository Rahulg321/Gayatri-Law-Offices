import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import type { z } from "zod";
import { MarkdownEditor } from "#/components/admin/MarkdownEditor";
import { SeoFields } from "#/components/admin/SeoFields";
import { Button } from "#/components/ui/button";
import { Field, FieldError, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { Switch } from "#/components/ui/switch";
import { Textarea } from "#/components/ui/textarea";
import type { BlogPost } from "#/lib/cms";
import { adminBlogFormSchema } from "#/lib/cms-schemas";
import {
  adminDeleteBlogPost,
  adminGetBlogPost,
  adminSaveBlogPost,
} from "#/lib/cms-admin";

export const Route = createFileRoute("/admin/blogs/$slug")({
  loader: ({ params }) =>
    params.slug === "new" ? null : adminGetBlogPost({ data: params.slug }),
  component: AdminBlogEditPage,
});

type BlogFormValues = z.infer<typeof adminBlogFormSchema>;

function blogDefaults(initial: BlogPost | null): BlogFormValues {
  return {
    slug: initial?.slug ?? "",
    title: initial?.title ?? "",
    excerpt: initial?.excerpt ?? "",
    category: initial?.category ?? "LPO Insights",
    publishedAt: initial?.date ?? new Date().toISOString().slice(0, 10),
    readTime: initial?.readTime ?? "5 min read",
    bodyMarkdown: initial?.bodyMarkdown ?? "",
    published: initial?.published ?? true,
    metaTitle: initial?.metaTitle ?? "",
    metaDescription: initial?.metaDescription ?? "",
    ogImageUrl: initial?.ogImageUrl ?? "",
  };
}

function AdminBlogEditPage() {
  const { slug: slugParam } = Route.useParams();

  return (
    <div>
      <BlogEditForm key={slugParam} />
    </div>
  );
}

function BlogEditForm() {
  const navigate = useNavigate();
  const initial = Route.useLoaderData();
  const isNew = Route.useParams().slug === "new";
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const form = useForm({
    defaultValues: blogDefaults(initial),
    validators: {
      onSubmit: adminBlogFormSchema,
      onBlur: adminBlogFormSchema,
    },
    onSubmit: async ({ value }) => {
      setSaving(true);
      setError(null);
      try {
        await adminSaveBlogPost({
          data: {
            ...value,
            metaTitle: value.metaTitle || null,
            metaDescription: value.metaDescription || null,
            ogImageUrl: value.ogImageUrl || null,
          },
        });
        await navigate({ to: "/admin/blogs" });
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
          {isNew ? "New blog post" : "Edit blog post"}
        </h1>
        <Link to="/admin/blogs" className="text-sm text-[var(--gold)]">
          Back to list
        </Link>
      </div>
      <form
        noValidate
        className="max-w-3xl space-y-6"
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
          <form.Field name="publishedAt">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Published date</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="date"
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
                  rows={3}
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
          <form.Field name="readTime">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Read time</FieldLabel>
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
        <form.Field name="bodyMarkdown">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel>Body (Markdown)</FieldLabel>
                <MarkdownEditor
                  value={field.state.value}
                  onChange={(v) => field.handleChange(v)}
                />
                {isInvalid ? (
                  <FieldError errors={field.state.meta.errors} />
                ) : null}
              </Field>
            );
          }}
        </form.Field>
        <form.Field name="published">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field orientation="horizontal" data-invalid={isInvalid}>
                <Switch
                  id="admin-blog-published"
                  name={field.name}
                  checked={field.state.value}
                  onCheckedChange={(v) => field.handleChange(v)}
                  aria-invalid={isInvalid}
                />
                <FieldLabel htmlFor="admin-blog-published">
                  Published
                </FieldLabel>
                {isInvalid ? (
                  <FieldError errors={field.state.meta.errors} />
                ) : null}
              </Field>
            );
          }}
        </form.Field>
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
                if (!confirm("Delete this post?")) return;
                await adminDeleteBlogPost({ data: form.getFieldValue("slug") });
                await navigate({ to: "/admin/blogs" });
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
