import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Card, CardContent } from "#/components/ui/card";
import { Badge } from "#/components/ui/badge";
import { Separator } from "#/components/ui/separator";
import { blogPosts } from "#/lib/data";

export const Route = createFileRoute("/blogs/$slug")({
  head: ({ params }) => {
    const post = blogPosts.find((p) => p.slug === params.slug);
    if (!post) return {};
    return {
      meta: [
        { title: `${post.title} — Gayatri Law Offices` },
        { name: "description", content: post.excerpt },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.excerpt },
        { property: "og:type", content: "article" },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
          }),
        },
      ],
    };
  },
  loader: ({ params }) => {
    const post = blogPosts.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    return { post };
  },
  component: BlogPostPage,
});

function BlogPostPage() {
  const data = Route.useLoaderData() as unknown as {
    post: (typeof blogPosts)[number];
  };
  const { post } = data;

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

        <div className="prose prose-lg max-w-none text-[var(--charcoal-soft)]">
          <p className="lead text-lg leading-relaxed">{post.excerpt}</p>
          <p>
            Legal process outsourcing continues to evolve rapidly. As law firms
            face increasing pressure to deliver more value at lower costs, the
            role of LPO providers has never been more critical. This article
            explores key considerations and best practices for law firms
            evaluating or expanding their outsourcing relationships.
          </p>
          <h2 className="display-title text-2xl font-semibold text-[var(--charcoal)]">
            Key Trends Shaping the Industry
          </h2>
          <p>
            The LPO landscape is being reshaped by several powerful forces. AI
            and machine learning tools are augmenting human review capabilities,
            enabling faster and more accurate document analysis. Meanwhile, the
            growing acceptance of remote work has normalized distributed legal
            teams, making offshore partnerships more seamless than ever.
          </p>
          <p>
            At Gayatri Law Offices, we have integrated these trends into our
            service delivery model while maintaining the rigorous human
            oversight that legal work demands. Technology enhances our
            efficiency; it never replaces the judgment of a qualified legal
            professional.
          </p>
          <h2 className="display-title text-2xl font-semibold text-[var(--charcoal)]">
            Practical Takeaways
          </h2>
          <ul>
            <li>
              Start with a clearly defined scope and pilot project to establish
              trust and workflow alignment.
            </li>
            <li>
              Prioritize providers with demonstrated expertise in your specific
              practice area — not generalists.
            </li>
            <li>
              Insist on ISO-certified security practices and comprehensive NDAs
              from day one.
            </li>
            <li>
              Build regular feedback loops into your engagement to ensure
              continuous improvement.
            </li>
          </ul>
          <p>
            The future of legal services delivery is collaborative, global, and
            technology-enabled. Firms that embrace this reality will be best
            positioned to serve their clients effectively in the years ahead.
          </p>
        </div>
      </article>

      <Separator className="mx-auto my-14 max-w-3xl" />

      <section className="mx-auto max-w-3xl">
        <h2 className="display-title mb-8 text-center text-3xl font-semibold text-[var(--charcoal)]">
          Related Articles
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {blogPosts
            .filter((p) => p.slug !== post.slug)
            .slice(0, 2)
            .map((related) => (
              <Link
                key={related.slug}
                to="/blogs/$slug"
                params={{ slug: related.slug }}
                className="no-underline"
              >
                <Card className="feature-card h-full border-[var(--line)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:border-[var(--gold)]/30">
                  <CardContent className="py-5">
                    <Badge
                      variant="secondary"
                      className="mb-2 rounded-full bg-[var(--gold-pale)] text-[11px] text-[var(--gold-deep)]"
                    >
                      {related.category}
                    </Badge>
                    <h3 className="mb-1 text-base font-semibold text-[var(--charcoal)]">
                      {related.title}
                    </h3>
                    <p className="text-sm text-[var(--slate-soft)]">
                      {related.readTime}
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
