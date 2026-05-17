import { Link, createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import type { z } from "zod";
import { ImageField } from "#/components/admin/ImageField";
import { MarkdownEditor } from "#/components/admin/MarkdownEditor";
import { SeoFields } from "#/components/admin/SeoFields";
import { StringListField } from "#/components/admin/StringListField";
import { Button } from "#/components/ui/button";
import { Field, FieldError, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { Textarea } from "#/components/ui/textarea";
import { blogPostStatuses } from "#/db/schema";
import type { BlogPost } from "#/lib/cms";
import { adminBlogFormSchema } from "#/lib/cms-schemas";
import {
  adminDeleteBlogPost,
  adminGetBlogPost,
  adminSaveBlogPost,
} from "#/lib/cms-admin";
import { invalidateCmsRoutes } from "#/lib/cms-route-cache";
import { estimateReadTime } from "#/lib/read-time";
import { syncSlugFromTitle } from "#/lib/sync-slug-from-title";

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
    categoryParent: initial?.categoryParent ?? "",
    publishedAt: initial?.date ?? new Date().toISOString().slice(0, 10),
    readTime: initial?.readTime ?? "5 min read",
    bodyMarkdown: initial?.bodyMarkdown ?? "",
    status: initial?.status ?? "draft",
    tags: initial?.tags?.length ? initial.tags : [""],
    seriesSlug: initial?.series.slug ?? "",
    seriesTitle: initial?.series.title ?? "",
    authorName: initial?.author.name ?? "",
    authorImageUrl: initial?.author.imageUrl ?? "",
    authorBio: initial?.author.bio ?? "",
    featuredImageUrl: initial?.featuredImageUrl ?? "",
    metaTitle: initial?.metaTitle ?? "",
    metaDescription: initial?.metaDescription ?? "",
    ogImageUrl: initial?.ogImageUrl ?? "",
    canonicalUrl: initial?.canonicalUrl ?? "",
    twitterCard:
      initial?.twitterCard === "summary" ? "summary" : "summary_large_image",
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
  const router = useRouter();
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
            slug: value.slug,
            title: value.title,
            excerpt: value.excerpt,
            category: value.category,
            categoryParent: value.categoryParent || null,
            publishedAt: value.publishedAt,
            readTime: value.readTime,
            bodyMarkdown: value.bodyMarkdown,
            status: value.status,
            tags: value.tags.filter(Boolean),
            seriesSlug: value.seriesSlug || null,
            seriesTitle: value.seriesTitle || null,
            authorName: value.authorName || null,
            authorImageUrl: value.authorImageUrl || null,
            authorBio: value.authorBio || null,
            featuredImageUrl: value.featuredImageUrl || null,
            metaTitle: value.metaTitle || null,
            metaDescription: value.metaDescription || null,
            ogImageUrl: value.ogImageUrl || null,
            canonicalUrl: value.canonicalUrl || null,
            twitterCard: value.twitterCard,
          },
        });
        await invalidateCmsRoutes(router);
        await navigate({ to: "/admin/blogs" });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Save failed");
      } finally {
        setSaving(false);
      }
    },
  });

  const postSlug = form.state.values.slug || "draft";

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">
          {isNew ? "New blog post" : "Edit blog post"}
        </h1>
        <Link to="/admin/blogs" className="text-accent text-sm hover:underline">
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
        <Tabs defaultValue="content" className="w-full gap-4">
          <TabsList
            variant="line"
            className="flex h-auto min-h-9 w-full flex-wrap justify-start gap-1"
          >
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="media">Author & assets</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>
          <TabsContent value="content" className="mt-6 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="title">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="sm:col-span-2">
                  <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      const title = e.target.value;
                      field.handleChange(title);
                      syncSlugFromTitle(form, title);
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

          <form.Field name="status">
            {(field) => (
              <Field>
                <FieldLabel>Status</FieldLabel>
                <Select
                  value={field.state.value}
                  onValueChange={(v) =>
                    field.handleChange(v as BlogFormValues["status"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {blogPostStatuses.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          </form.Field>

          <form.Field name="publishedAt">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Publish date</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="date"
                    value={field.state.value.slice(0, 10)}
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
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Read time</FieldLabel>
                <div className="flex gap-2">
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                    onClick={() => {
                      const body = form.getFieldValue("bodyMarkdown");
                      field.handleChange(estimateReadTime(body));
                    }}
                  >
                    Estimate
                  </Button>
                </div>
              </Field>
            )}
          </form.Field>
        </div>

        <form.Field name="excerpt">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>
                  Excerpt / meta description teaser
                </FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  rows={3}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="1–2 sentences, ~150–160 characters"
                />
                {isInvalid ? (
                  <FieldError errors={field.state.meta.errors} />
                ) : null}
              </Field>
            );
          }}
        </form.Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="categoryParent">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Category parent</FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g. Technology"
                />
              </Field>
            )}
          </form.Field>
          <form.Field name="category">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
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
                  {isInvalid ? (
                    <FieldError errors={field.state.meta.errors} />
                  ) : null}
                </Field>
              );
            }}
          </form.Field>
        </div>

        <form.Field name="tags">
          {(field) => (
            <StringListField
              label="Tags"
              values={field.state.value}
              onChange={(v) => field.handleChange(v)}
            />
          )}
        </form.Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="seriesTitle">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Series title</FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Optional multi-part series"
                />
              </Field>
            )}
          </form.Field>
          <form.Field name="seriesSlug">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Series slug</FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Field>
            )}
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

          </TabsContent>
          <TabsContent value="media" className="mt-6 space-y-6">

        <fieldset className="border-border space-y-4 rounded-xl border p-4">
          <legend className="px-1 text-sm font-semibold">Author</legend>
          <form.Field name="authorName">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Field>
            )}
          </form.Field>
          <form.Field name="authorImageUrl">
            {(field) => (
              <ImageField
                label="Avatar"
                value={field.state.value}
                onChange={(url) => field.handleChange(url)}
                uploadTarget={{ kind: 'blog', postSlug }}
              />
            )}
          </form.Field>
          <form.Field name="authorBio">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Bio</FieldLabel>
                <Textarea
                  id={field.name}
                  value={field.state.value}
                  rows={3}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Field>
            )}
          </form.Field>
        </fieldset>

        <form.Field name="featuredImageUrl">
          {(field) => (
            <ImageField
              label="Featured image"
              hint="1200×675 or larger recommended for hero and social sharing."
              value={field.state.value}
              onChange={(url) => field.handleChange(url)}
              uploadTarget={{ kind: 'blog', postSlug }}
            />
          )}
        </form.Field>

        <form.Field name="ogImageUrl">
          {(field) => (
            <ImageField
              label="OG / social image"
              hint="Overrides featured image for Open Graph when set."
              value={field.state.value}
              onChange={(url) => field.handleChange(url)}
              uploadTarget={{ kind: 'blog', postSlug }}
            />
          )}
        </form.Field>

          </TabsContent>
          <TabsContent value="seo" className="mt-6 space-y-6">

        <SeoFields form={form} showCanonical showTwitterCard showOgImage={false} />

          </TabsContent>
        </Tabs>

        {error ? <p className="text-destructive text-sm">{error}</p> : null}
        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={saving}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
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
                await invalidateCmsRoutes(router);
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
