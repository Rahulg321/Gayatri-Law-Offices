import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Markdown } from "#/components/Markdown";
import { Card, CardContent } from "#/components/ui/card";
import { Badge } from "#/components/ui/badge";
import { Separator } from "#/components/ui/separator";
import { seoDescription, seoTitle } from "#/lib/cms";
import { loadBlogPost } from "#/lib/cms-public";

export const Route = createFileRoute("/blogs/$slug")({
  loader: async ({ params }) => {
    const data = await loadBlogPost({ data: params.slug });
    if (!data) throw notFound();
    return data;
  },

  head: ({ loaderData }) => {
    const post = loaderData?.post;
    if (!post) return {};
    const title = seoTitle(post.title, post.metaTitle);
    const description = seoDescription(post.excerpt, post.metaDescription);
    return {
      meta: [
        { title: `${title} — Gayatri Law Offices` },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        ...(post.ogImageUrl
          ? [{ property: "og:image", content: post.ogImageUrl }]
          : []),
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description,
            datePublished: post.date,
          }),
        },
      ],
    };
  },

  component: BlogPostPage,
});

function BlogPostPage() {
  const { post, related } = Route.useLoaderData();

  return (
    <main className="page-wrap px-4 pb-16 pt-28 sm:pt-32">
      <article className="mx-auto max-w-3xl">
        <Badge
          variant="secondary"
          className="mb-4 rounded-full bg-[var(--gold-pale)] text-[11px] text-[var(--gold-deep)]"
        >
          {post.category}
        </Badge>
        <h1 className="display-title mb-4 text-4xl leading-[1.08] font-semibold tracking-tight text-[var(--charcoal)] sm:text-5xl">
          {post.title}
        </h1>
        <div className="mb-8 flex items-center gap-3 text-sm text-[var(--slate-soft)]">
          <span>
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span>·</span>
          <span>{post.readTime}</span>
        </div>

        <p className="lead mb-8 text-lg leading-relaxed text-[var(--charcoal-soft)]">
          {post.excerpt}
        </p>

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
                    {relatedPost.category}
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
