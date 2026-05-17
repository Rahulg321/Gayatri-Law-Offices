import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Markdown } from "#/components/Markdown";
import { Badge } from "#/components/ui/badge";
import { Card, CardContent } from "#/components/ui/card";
import { Separator } from "#/components/ui/separator";
import {
  categoryBreadcrumb,
  displayAuthorName,
  socialImageUrl,
} from "#/lib/cms";
import { blogPostHeadMeta } from "#/lib/blog-head";
import { loadBlogPost } from "#/lib/cms-public";
import {
  PUBLIC_CMS_GC_MS,
  PUBLIC_CMS_STALE_MS,
  applyPublicCmsCacheHeaders,
} from "#/lib/cms-route-cache";

export const Route = createFileRoute("/blogs/$slug")({
  staleTime: PUBLIC_CMS_STALE_MS,
  gcTime: PUBLIC_CMS_GC_MS,
  loader: async ({ params }) => {
    applyPublicCmsCacheHeaders();
    const data = await loadBlogPost({ data: params.slug });
    if (!data) throw notFound();
    return data;
  },

  head: ({ loaderData }) => {
    const post = loaderData?.post;
    if (!post) return {};
    return blogPostHeadMeta(post);
  },

  component: BlogPostPage,
});

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function BlogPostPage() {
  const { post, related } = Route.useLoaderData();
  const heroImage = socialImageUrl(post);
  const authorName = displayAuthorName(post.author);
  const publishedLabel = formatDate(post.date);
  const updatedLabel = formatDate(post.updatedAt.toISOString());
  const showUpdated =
    post.updatedAt.getTime() >
    new Date(post.date).getTime() + 24 * 60 * 60 * 1000;

  return (
    <main className="page-wrap px-4 pb-16 pt-28 sm:pt-32">
      <article className="mx-auto max-w-3xl">
        <Badge
          variant="secondary"
          className="mb-4 rounded-full bg-[var(--gold-pale)] text-[11px] text-[var(--gold-deep)]"
        >
          {categoryBreadcrumb(post.category, post.categoryParent)}
        </Badge>
        <h1 className="display-title mb-4 text-4xl leading-[1.08] font-semibold tracking-tight text-[var(--charcoal)] sm:text-5xl">
          {post.title}
        </h1>

        <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-[var(--slate-soft)]">
          {post.author.imageUrl ? (
            <img
              src={post.author.imageUrl}
              alt=""
              className="size-10 rounded-full object-cover"
            />
          ) : null}
          <div>
            <p className="font-medium text-[var(--charcoal)]">{authorName}</p>
            <p>
              <time dateTime={post.date}>{publishedLabel}</time>
              {showUpdated ? (
                <>
                  {" "}
                  · Updated <time dateTime={post.updatedAt.toISOString()}>{updatedLabel}</time>
                </>
              ) : null}
              {" "}
              · {post.readTime}
            </p>
          </div>
        </div>

        {post.series.title ? (
          <p className="mb-4 text-sm text-[var(--charcoal-soft)]">
            Part of <span className="font-medium">{post.series.title}</span>
            {post.series.slug ? (
              <span className="text-muted-foreground"> ({post.series.slug})</span>
            ) : null}
          </p>
        ) : null}

        {post.author.bio ? (
          <p className="mb-6 text-sm leading-relaxed text-[var(--charcoal-soft)]">
            {post.author.bio}
          </p>
        ) : null}

        {heroImage ? (
          <img
            src={heroImage}
            alt=""
            className="mb-8 aspect-[16/9] w-full rounded-xl object-cover"
          />
        ) : null}

        <p className="lead mb-8 text-lg leading-relaxed text-[var(--charcoal-soft)]">
          {post.excerpt}
        </p>

        {post.tags.length > 0 ? (
          <div className="mb-8 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="rounded-full text-xs font-normal"
              >
                {tag}
              </Badge>
            ))}
          </div>
        ) : null}

        <Markdown
          content={post.bodyMarkdown}
          className="prose prose-lg max-w-none text-[var(--charcoal-soft)]"
        />
      </article>

      <Separator className="mx-auto my-14 max-w-3xl" />

      <section className="mx-auto max-w-3xl">
        <h2 className="display-title mb-8 text-center text-3xl font-semibold text-[var(--charcoal)]">
          Related Articles
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {related.map((relatedPost) => (
            <Link
              key={relatedPost.slug}
              to="/blogs/$slug"
              params={{ slug: relatedPost.slug }}
              className="no-underline"
            >
              <Card className="feature-card h-full border-[var(--line)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:border-[var(--gold)]/30">
                <CardContent className="py-5">
                  <Badge
                    variant="secondary"
                    className="mb-2 rounded-full bg-[var(--gold-pale)] text-[11px] text-[var(--gold-deep)]"
                  >
                    {categoryBreadcrumb(
                      relatedPost.category,
                      relatedPost.categoryParent,
                    )}
                  </Badge>
                  <h3 className="mb-1 text-base font-semibold text-[var(--charcoal)]">
                    {relatedPost.title}
                  </h3>
                  <p className="text-sm text-[var(--slate-soft)]">
                    {relatedPost.readTime}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
