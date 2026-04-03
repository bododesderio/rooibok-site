import type { Metadata } from "next";
import Link from "next/link";
import { getContentBlock, getContentGroup } from "@/server/queries/content";

export const metadata: Metadata = {
  title: "Rooibok Technologies — We Build What's Next",
  description:
    "Innovative software solutions crafted in Lira, Uganda — for the world. Web apps, mobile apps, SaaS, consulting, and more.",
};
import { getPublishedServices } from "@/server/queries/services";
import { getFeaturedProjects } from "@/server/queries/projects";
import { getFeaturedPosts } from "@/server/queries/posts";
import { GradientOrbs } from "@/components/effects/gradient-orbs";
import { GradientText } from "@/components/effects/gradient-text";
import { FadeIn } from "@/components/effects/fade-in";
import { CountUp } from "@/components/effects/count-up";
import { CtaBanner } from "@/components/shared/cta-banner";
import { SectionHeader } from "@/components/shared/section-header";
import { formatDate } from "@/lib/utils";
import {
  Globe,
  Smartphone,
  Palette,
  MessageCircle,
  Cloud,
  Code2,
  Layers,
  Users,
  ArrowRight,
  Clock,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Globe,
  Smartphone,
  Palette,
  MessageCircle,
  Cloud,
  Code2,
  Layers,
  Users,
};

export default async function HomePage() {
  const [
    headline,
    subheadline,
    ctaPrimaryText,
    ctaSecondaryText,
    servicesHeadline,
    servicesSubheadline,
    projectsHeadline,
    metricsHeadline,
    testimonialsHeadline,
    blogHeadline,
    ctaHeadline,
    ctaSubtitle,
    ctaButtonText,
  ] = await Promise.all([
    getContentBlock("home.hero.headline", "We Build What's Next"),
    getContentBlock(
      "home.hero.subheadline",
      "Innovative software solutions crafted in Lira, Uganda — for the world."
    ),
    getContentBlock("home.hero.cta_primary", "Start a Project"),
    getContentBlock("home.hero.cta_secondary", "See Our Work"),
    getContentBlock("home.services.headline", "What We Do"),
    getContentBlock(
      "home.services.subheadline",
      "End-to-end digital services tailored to your business needs."
    ),
    getContentBlock("home.projects.headline", "Featured Work"),
    getContentBlock("home.metrics.headline", "By the Numbers"),
    getContentBlock("home.testimonials.headline", "What Our Clients Say"),
    getContentBlock("home.blog.headline", "From the Blog"),
    getContentBlock("cta.default.headline", "Ready to build something great?"),
    getContentBlock(
      "cta.default.subtitle",
      "Let's talk about your next project."
    ),
    getContentBlock("cta.default.button", "Get in Touch"),
  ]);

  const [services, projects, postsResult, metrics, testimonials] =
    await Promise.all([
      getPublishedServices(),
      getFeaturedProjects(3),
      getFeaturedPosts(3),
      getContentGroup("home.metrics"),
      getContentGroup("home.testimonials"),
    ]);

  const posts = postsResult;

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <GradientOrbs />
        <div className="relative mx-auto max-w-4xl text-center">
          <FadeIn>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              <GradientText>{headline}</GradientText>
            </h1>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--foreground-muted)]">
              {subheadline}
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex rounded-lg bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--accent-foreground)] transition-all hover:bg-[var(--accent-hover)] hover:shadow-lg hover:shadow-[var(--accent)]/25"
              >
                {ctaPrimaryText}
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex rounded-lg border border-[var(--border)] px-6 py-3 text-sm font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--surface)]"
              >
                {ctaSecondaryText}
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Services Overview ────────────────────────────── */}
      {services.length > 0 && (
        <section className="border-t border-[var(--border)] px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <FadeIn>
              <SectionHeader
                title={servicesHeadline}
                subtitle={servicesSubheadline}
              />
            </FadeIn>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.slice(0, 6).map((service, i) => {
                const Icon = ICON_MAP[service.icon] || Code2;
                return (
                  <FadeIn key={service.id} delay={i * 0.1}>
                    <Link
                      href={`/services/${service.slug}`}
                      className="group flex flex-col rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 transition-all hover:border-[var(--accent)] hover:shadow-lg hover:shadow-[var(--accent)]/5"
                    >
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)]/10">
                        <Icon className="h-5 w-5 text-[var(--accent)]" />
                      </div>
                      <h3 className="text-lg font-semibold text-[var(--foreground)]">
                        {service.name}
                      </h3>
                      <p className="mt-2 flex-1 text-sm text-[var(--foreground-muted)]">
                        {service.shortDescription}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)] transition-colors group-hover:text-[var(--accent-hover)]">
                        Learn more
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </Link>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Featured Projects ────────────────────────────── */}
      {projects.length > 0 && (
        <section className="border-t border-[var(--border)] bg-[var(--surface)] px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <FadeIn>
              <SectionHeader title={projectsHeadline} />
            </FadeIn>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, i) => (
                <FadeIn key={project.id} delay={i * 0.1}>
                  <Link
                    href={`/portfolio/${project.slug}`}
                    className="group overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] transition-all hover:shadow-lg"
                  >
                    {project.coverImage && (
                      <div className="aspect-video overflow-hidden bg-[var(--surface-raised)]">
                        <img
                          src={project.coverImage}
                          alt={project.title}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="font-semibold text-[var(--foreground)]">
                        {project.title}
                      </h3>
                      <p className="mt-1.5 text-sm text-[var(--foreground-muted)] line-clamp-2">
                        {project.shortDescription}
                      </p>
                      {project.techStack.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {project.techStack.slice(0, 4).map((tech) => (
                            <span
                              key={tech}
                              className="rounded-full bg-[var(--surface-raised)] px-2.5 py-0.5 text-xs text-[var(--foreground-muted)]"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
            <FadeIn>
              <div className="mt-10 text-center">
                <Link
                  href="/portfolio"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
                >
                  View all projects
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* ── Metrics / Value Props ────────────────────────── */}
      {metrics.length > 0 && (
        <section className="relative overflow-hidden border-t border-[var(--border)] px-4 py-20 sm:px-6 lg:px-8">
          <GradientOrbs />
          <div className="relative mx-auto max-w-7xl">
            <FadeIn>
              <SectionHeader title={metricsHeadline} />
            </FadeIn>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {metrics.map((metric, i) => {
                const data = metric.content as {
                  value?: number;
                  label?: string;
                  suffix?: string;
                  prefix?: string;
                };
                return (
                  <FadeIn key={metric.id} delay={i * 0.1}>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-[var(--foreground)]">
                        <CountUp
                          end={data.value ?? 0}
                          prefix={data.prefix}
                          suffix={data.suffix}
                        />
                      </div>
                      <p className="mt-2 text-sm text-[var(--foreground-muted)]">
                        {data.label}
                      </p>
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Testimonials ─────────────────────────────────── */}
      {testimonials.length > 0 && (
        <section className="border-t border-[var(--border)] bg-[var(--surface)] px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <FadeIn>
              <SectionHeader title={testimonialsHeadline} />
            </FadeIn>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, i) => {
                const data = testimonial.content as {
                  quote?: string;
                  name?: string;
                  role?: string;
                  company?: string;
                };
                return (
                  <FadeIn key={testimonial.id} delay={i * 0.1}>
                    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
                      <blockquote className="text-sm leading-relaxed text-[var(--foreground-muted)]">
                        &ldquo;{data.quote}&rdquo;
                      </blockquote>
                      <div className="mt-4 border-t border-[var(--border)] pt-4">
                        <p className="text-sm font-semibold text-[var(--foreground)]">
                          {data.name}
                        </p>
                        <p className="text-xs text-[var(--foreground-muted)]">
                          {data.role}
                          {data.company ? `, ${data.company}` : ""}
                        </p>
                      </div>
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Blog Preview ─────────────────────────────────── */}
      {posts.length > 0 && (
        <section className="border-t border-[var(--border)] px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <FadeIn>
              <SectionHeader title={blogHeadline} />
            </FadeIn>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <FadeIn key={post.id} delay={i * 0.1}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] transition-all hover:shadow-lg"
                  >
                    {post.coverImage && (
                      <div className="aspect-video overflow-hidden bg-[var(--surface-raised)]">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      {post.category && (
                        <span className="text-xs font-medium text-[var(--accent)]">
                          {post.category.name}
                        </span>
                      )}
                      <h3 className="mt-1 font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)]">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="mt-1.5 text-sm text-[var(--foreground-muted)] line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="mt-3 flex items-center gap-3 text-xs text-[var(--foreground-muted)]">
                        <span>{post.author.name}</span>
                        {post.publishedAt && (
                          <span>{formatDate(post.publishedAt)}</span>
                        )}
                        {post.readTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {post.readTime} min
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
            <FadeIn>
              <div className="mt-10 text-center">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
                >
                  View all posts
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* ── CTA Banner ───────────────────────────────────── */}
      <CtaBanner
        title={ctaHeadline}
        subtitle={ctaSubtitle}
        buttonText={ctaButtonText}
        buttonHref="/contact"
      />
    </div>
  );
}
