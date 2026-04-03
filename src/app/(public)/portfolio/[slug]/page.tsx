import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, ExternalLink } from "lucide-react";
import { getProjectBySlug } from "@/server/queries/projects";
import { getContentBlock } from "@/server/queries/content";
import { TiptapRenderer } from "@/components/shared/tiptap-renderer";
import { CtaBanner } from "@/components/shared/cta-banner";
import { FadeIn } from "@/components/effects/fade-in";
import { formatDate } from "@/lib/utils";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.title} | Portfolio | Rooibok Technologies`,
    description: project.shortDescription,
    openGraph: {
      title: project.title,
      description: project.shortDescription,
      images: project.coverImage ? [project.coverImage] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  const [ctaHeadline, ctaButton] = await Promise.all([
    getContentBlock("cta.default.headline", "Have a similar project in mind?"),
    getContentBlock("cta.default.button", "Get in Touch"),
  ]);

  const testimonial = project.testimonial as {
    quote: string;
    author: string;
    role: string;
  } | null;

  const dateRange = [
    project.startDate ? formatDate(project.startDate) : null,
    project.endDate ? formatDate(project.endDate) : null,
  ]
    .filter(Boolean)
    .join(" — ");

  return (
    <>
      {/* Back link */}
      <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Portfolio
        </Link>
      </div>

      {/* Hero */}
      <FadeIn>
        <section className="mx-auto max-w-5xl px-4 pb-8 pt-6 sm:px-6 lg:px-8">
          {/* Cover image */}
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--accent)]/20 to-[var(--highlight)]/20">
            {project.coverImage &&
              !project.coverImage.includes("placeholder") && (
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="h-full w-full object-cover"
                />
              )}
          </div>

          {/* Title + meta */}
          <div className="mt-8">
            {project.client && (
              <p className="text-sm font-medium uppercase tracking-wider text-[var(--accent)]">
                {project.client}
              </p>
            )}
            <h1 className="mt-1 text-3xl font-bold text-[var(--foreground)] sm:text-4xl">
              {project.title}
            </h1>
            <p className="mt-3 text-lg text-[var(--foreground-muted)]">
              {project.shortDescription}
            </p>

            {/* Metadata bar */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-[var(--foreground-muted)]">
              {dateRange && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {dateRange}
                </span>
              )}
              {project.services.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {project.services.map((s) => (
                    <Link
                      key={s.id}
                      href={`/services/${s.slug}`}
                      className="rounded-full border border-[var(--border)] px-3 py-0.5 text-xs font-medium text-[var(--highlight)] transition-colors hover:bg-[var(--surface)]"
                    >
                      {s.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Main content */}
      <section className="mx-auto max-w-5xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="prose-wrapper">
          <TiptapRenderer
            content={project.description as Parameters<typeof TiptapRenderer>[0]["content"]}
          />
        </div>

        {/* Challenge / Solution / Result */}
        {project.challenge && (
          <FadeIn>
            <div className="mt-12 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
              <h2 className="text-xl font-bold text-[var(--foreground)]">
                The Challenge
              </h2>
              <div className="mt-4">
                <TiptapRenderer
                  content={project.challenge as Parameters<typeof TiptapRenderer>[0]["content"]}
                />
              </div>
            </div>
          </FadeIn>
        )}

        {project.solution && (
          <FadeIn>
            <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
              <h2 className="text-xl font-bold text-[var(--foreground)]">
                Our Solution
              </h2>
              <div className="mt-4">
                <TiptapRenderer
                  content={project.solution as Parameters<typeof TiptapRenderer>[0]["content"]}
                />
              </div>
            </div>
          </FadeIn>
        )}

        {project.result && (
          <FadeIn>
            <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
              <h2 className="text-xl font-bold text-[var(--foreground)]">
                The Result
              </h2>
              <div className="mt-4">
                <TiptapRenderer
                  content={project.result as Parameters<typeof TiptapRenderer>[0]["content"]}
                />
              </div>
            </div>
          </FadeIn>
        )}

        {/* Tech stack */}
        {project.techStack.length > 0 && (
          <FadeIn>
            <div className="mt-12">
              <h2 className="text-xl font-bold text-[var(--foreground)]">
                Tech Stack
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-[var(--surface)] px-4 py-1.5 text-sm font-medium text-[var(--foreground-muted)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </FadeIn>
        )}

        {/* Image gallery */}
        {project.images.length > 0 && (
          <FadeIn>
            <div className="mt-12">
              <h2 className="text-xl font-bold text-[var(--foreground)]">
                Screenshots
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {project.images.map((img, i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-xl border border-[var(--border)]"
                  >
                    <img
                      src={img}
                      alt={`${project.title} screenshot ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        )}

        {/* Testimonial */}
        {testimonial && (
          <FadeIn>
            <div className="mt-12 rounded-2xl bg-gradient-to-br from-[var(--accent)]/10 to-[var(--highlight)]/10 p-8 sm:p-10">
              <blockquote className="text-lg italic leading-relaxed text-[var(--foreground)]">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <div className="mt-4">
                <p className="font-semibold text-[var(--foreground)]">
                  {testimonial.author}
                </p>
                <p className="text-sm text-[var(--foreground-muted)]">
                  {testimonial.role}
                </p>
              </div>
            </div>
          </FadeIn>
        )}
      </section>

      <CtaBanner
        title={ctaHeadline}
        subtitle="Let's talk about your next project."
        buttonText={ctaButton}
        buttonHref="/contact"
      />
    </>
  );
}
