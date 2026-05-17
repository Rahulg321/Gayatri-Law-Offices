import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card";
import { Badge } from "#/components/ui/badge";
import { seoDescription, seoTitle } from "#/lib/cms";
import { loadPracticeArea } from "#/lib/cms-public";

export const Route = createFileRoute("/services/$slug")({
  head: ({ loaderData }) => {
    const svc = loaderData;
    if (!svc) return {};
    const title = seoTitle(svc.title, svc.metaTitle);
    const description = seoDescription(svc.short, svc.metaDescription);
    return {
      meta: [
        { title: `${title} — LPO Services | Gayatri Law Offices` },
        { name: "description", content: description },
        { property: "og:title", content: `${title} — Gayatri Law Offices` },
        { property: "og:description", content: description },
        ...(svc.ogImageUrl
          ? [{ property: "og:image", content: svc.ogImageUrl }]
          : []),
      ],
    };
  },
  loader: async ({ params }) => {
    const service = await loadPracticeArea({ data: params.slug });
    if (!service) throw notFound();
    return service;
  },
  component: ServiceDetailPage,
});

function ServiceDetailPage() {
  const service = Route.useLoaderData();

  return (
    <main className="page-wrap px-4 pb-16 pt-28 sm:pt-32">
      <section className="island-shell rise-in-blur relative overflow-hidden rounded-[2.5rem] px-6 py-12 sm:px-12 sm:py-20">
        <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(184,134,11,0.12),transparent_60%)]" />
        <span className="mb-4 text-4xl block">{service.icon}</span>
        <Badge
          variant="outline"
          className="mb-4 rounded-full border-[var(--gold)]/30 px-3 py-1 text-[10px] tracking-[0.2em] text-[var(--gold)] uppercase"
        >
          Practice Area
        </Badge>
        <h1 className="display-title mb-6 max-w-3xl text-4xl leading-[1.06] font-semibold tracking-tight text-[var(--charcoal)] sm:text-5xl">
          {service.title}
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-[var(--charcoal-soft)] sm:text-lg">
          {service.description}
        </p>
      </section>

      <section className="mt-14 sm:mt-20">
        <h2 className="display-title mb-8 text-3xl font-semibold tracking-tight text-[var(--charcoal)] sm:text-4xl">
          Key Benefits
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {service.benefits.map((b, i) => (
            <Card
              key={b}
              className="feature-card rise-in"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <CardContent className="flex items-center gap-3 py-5">
                <svg
                  className="h-5 w-5 shrink-0 text-[var(--gold)]"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="text-sm font-medium text-[var(--charcoal)]">
                  {b}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-14 sm:mt-20">
        <h2 className="display-title mb-8 text-3xl font-semibold tracking-tight text-[var(--charcoal)] sm:text-4xl">
          Our Process
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              step: "01",
              title: "Consultation",
              desc: "We understand your specific needs, volume, complexity, and timeline.",
            },
            {
              step: "02",
              title: "Expert Matching",
              desc: "We assign professionals with domain expertise relevant to your matter.",
            },
            {
              step: "03",
              title: "Execution & Review",
              desc: "Work is executed with multi-layer quality checks before delivery.",
            },
          ].map((s, i) => (
            <Card
              key={s.step}
              className="rise-in feature-card"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <CardHeader>
                <span className="text-3xl font-bold text-[var(--gold)]/20">
                  {s.step}
                </span>
                <CardTitle className="text-base font-semibold text-[var(--charcoal)]">
                  {s.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-[var(--charcoal-soft)]">
                  {s.desc}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="island-shell mt-14 rounded-[2.5rem] px-6 py-12 text-center sm:mt-20 sm:px-12 sm:py-16">
        <h2 className="display-title mb-4 text-3xl font-semibold tracking-tight text-[var(--charcoal)] sm:text-4xl">
          Interested in {service.title}?
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-[var(--charcoal-soft)] sm:text-base">
          Let&apos;s discuss your requirements and how we can deliver
          exceptional results for your practice.
        </p>
        <Link to="/contact">
          <Button className="rounded-full bg-[var(--gold)] px-8 py-3 text-base font-semibold text-white hover:bg-[var(--gold-deep)]">
            Get in Touch
          </Button>
        </Link>
      </section>
    </main>
  );
}
