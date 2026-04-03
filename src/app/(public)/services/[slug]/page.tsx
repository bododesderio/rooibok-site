import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContentBlock } from "@/server/queries/content";
import { getServiceBySlug } from "@/server/queries/services";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "Service Not Found" };
  return {
    title: service.name,
    description: service.shortDescription,
  };
}
import { SectionHeader } from "@/components/shared/section-header";
import { CtaBanner } from "@/components/shared/cta-banner";
import { FadeIn } from "@/components/effects/fade-in";
import {
  Globe,
  Smartphone,
  Palette,
  MessageCircle,
  Cloud,
  Code2,
  Layers,
  Users,
  Wrench,
  Zap,
  Shield,
  Database,
  Server,
  Monitor,
  ArrowRight,
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
  Wrench,
  Zap,
  Shield,
  Database,
  Server,
  Monitor,
};

// ─── Tiptap JSON Renderer ───────────────────────────────────

type TiptapNode = {
  type: string;
  content?: TiptapNode[];
  text?: string;
  attrs?: Record<string, unknown>;
};

function extractText(node: TiptapNode): string {
  if (node.text) return node.text;
  if (!node.content) return "";
  return node.content.map(extractText).join("");
}

function renderTiptapContent(doc: unknown): React.ReactNode[] {
  const typedDoc = doc as TiptapNode;
  if (!typedDoc || typedDoc.type !== "doc" || !typedDoc.content) return [];

  return typedDoc.content.map((node, i) => {
    const text = extractText(node);
    if (!text) return null;

    if (node.type === "heading") {
      const level = (node.attrs?.level as number) || 2;
      if (level === 2) {
        return (
          <h2
            key={i}
            className="mt-8 mb-4 text-2xl font-bold text-[var(--foreground)]"
          >
            {text}
          </h2>
        );
      }
      if (level === 3) {
        return (
          <h3
            key={i}
            className="mt-6 mb-3 text-xl font-semibold text-[var(--foreground)]"
          >
            {text}
          </h3>
        );
      }
      return (
        <h4
          key={i}
          className="mt-4 mb-2 text-lg font-semibold text-[var(--foreground)]"
        >
          {text}
        </h4>
      );
    }

    return (
      <p key={i} className="mb-4 leading-relaxed text-[var(--foreground-muted)]">
        {text}
      </p>
    );
  });
}

// ─── Page Component ─────────────────────────────────────────

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const [ctaHeadline, ctaSubtitle, ctaButtonText, faqsHeadline, relatedHeadline] =
    await Promise.all([
      getContentBlock("cta.service.headline", "Need this service?"),
      getContentBlock(
        "cta.service.subtitle",
        "Let's discuss how we can help your business."
      ),
      getContentBlock("cta.service.button", "Get in Touch"),
      getContentBlock("services.faqs.headline", "Frequently Asked Questions"),
      getContentBlock("services.related.headline", "Related Projects"),
    ]);

  const Icon = ICON_MAP[service.icon] || Code2;

  const faqs = service.faqs as
    | { question: string; answer: string }[]
    | null;

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-[var(--border)] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[var(--accent)] opacity-5 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl">
          <FadeIn>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--accent)]/10">
                <Icon className="h-7 w-7 text-[var(--accent)]" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
                {service.name}
              </h1>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="mt-4 max-w-2xl text-lg text-[var(--foreground-muted)]">
              {service.shortDescription}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── Full Description ─────────────────────────────── */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <div>{renderTiptapContent(service.fullDescription)}</div>
          </FadeIn>
        </div>
      </section>

      {/* ── Tech Stack ───────────────────────────────────── */}
      {service.techStack.length > 0 && (
        <section className="border-t border-[var(--border)] bg-[var(--surface)] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <FadeIn>
              <SectionHeader title="Tech Stack" centered={false} />
              <div className="mt-6 flex flex-wrap gap-2">
                {service.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-1.5 text-sm font-medium text-[var(--foreground)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* ── FAQs ─────────────────────────────────────────── */}
      {faqs && faqs.length > 0 && (
        <section className="border-t border-[var(--border)] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <FadeIn>
              <SectionHeader title={faqsHeadline} centered={false} />
            </FadeIn>
            <div className="mt-8 space-y-3">
              {faqs.map((faq, i) => (
                <FadeIn key={i} delay={i * 0.05}>
                  <details className="group rounded-xl border border-[var(--border)] bg-[var(--card)]">
                    <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-[var(--foreground)] font-medium [&::-webkit-details-marker]:hidden">
                      {faq.question}
                      <span className="ml-4 shrink-0 text-[var(--foreground-muted)] transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <div className="border-t border-[var(--border)] px-6 py-4">
                      <p className="text-sm leading-relaxed text-[var(--foreground-muted)]">
                        {faq.answer}
                      </p>
                    </div>
                  </details>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Related Projects ─────────────────────────────── */}
      {service.projects.length > 0 && (
        <section className="border-t border-[var(--border)] bg-[var(--surface)] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <FadeIn>
              <SectionHeader title={relatedHeadline} />
            </FadeIn>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {service.projects.map((project, i) => (
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
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)] transition-colors group-hover:text-[var(--accent-hover)]">
                        View project
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
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
