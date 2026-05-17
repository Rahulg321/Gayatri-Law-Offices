import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge } from "#/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card";
import { categoryBreadcrumb, socialImageUrl } from "#/lib/cms";
import { loadBlogPosts } from "#/lib/cms-public";
import {
  PUBLIC_CMS_GC_MS,
  PUBLIC_CMS_STALE_MS,
  applyPublicCmsCacheHeaders,
} from "#/lib/cms-route-cache";

export const Route = createFileRoute("/blogs/")({
  staleTime: PUBLIC_CMS_STALE_MS,
  gcTime: PUBLIC_CMS_GC_MS,
  loader: () => {
    applyPublicCmsCacheHeaders();
    return loadBlogPosts();
  },
  head: () => ({
    meta: [
      { title: "Blog — LPO Insights, Trends & Legal Tech" },
      {
        name: "description",
        content:
          "Insights on legal process outsourcing trends, practice area guides, and tips for law firms. Stay informed with Gayatri Law Offices.",
      },
    ],
  }),
  component: BlogsIndexPage,
});

function BlogsIndexPage() {
  const blogPosts = Route.useLoaderData();

  return (
    <main className="page-wrap px-4 pb-16 pt-28 sm:pt-32">
      <section className="text-center">
        <Badge
          variant="outline"
          className="mb-4 rounded-full border-[var(--gold)]/30 px-3 py-1 text-[10px] tracking-[0.2em] text-[var(--gold)] uppercase"
        >
          Blogs
        </Badge>
        <h1 className="display-title mb-6 text-4xl leading-[1.06] font-semibold tracking-tight text-[var(--charcoal)] sm:text-5xl">
          Insights & Knowledge Center
        </h1>
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-[var(--charcoal-soft)] sm:text-lg">
          Stay informed with the latest trends in legal process outsourcing,
          practice area guides, and practical tips for law firms.
        </p>
      </section>

      <section className="mt-12 grid gap-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post, i) => {
          const thumb = socialImageUrl(post);
          return (
            <Link
              key={post.slug}
              to="/blogs/$slug"
              params={{ slug: post.slug }}
              className="no-underline"
            >
              <Card
                className="feature-card rise-in group h-full overflow-hidden border-[var(--line)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:border-[var(--gold)]/30"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {thumb ? (
                  <img
                    src={thumb}
                    alt=""
                    className="aspect-[16/9] w-full object-cover"
                    loading="lazy"
                  />
                ) : null}
                <CardHeader>
                  <Badge
                    variant="secondary"
                    className="mb-2 w-fit rounded-full bg-[var(--gold-pale)] text-[11px] text-[var(--gold-deep)]"
                  >
                    {categoryBreadcrumb(post.category, post.categoryParent)}
                  </Badge>
                  <CardTitle className="text-lg font-semibold leading-snug text-[var(--charcoal)] transition-colors group-hover:text-[var(--gold)]">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 text-sm leading-relaxed text-[var(--charcoal-soft)]">
                    {post.excerpt}
                  </CardDescription>
                  {post.tags.length > 0 ? (
                    <div className="mb-3 flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-[10px] font-normal"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                  <div className="flex items-center gap-3 text-xs text-[var(--slate-soft)]">
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
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
