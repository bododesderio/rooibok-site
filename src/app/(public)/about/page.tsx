import type { Metadata } from "next";
import Link from "next/link";
import { getContentBlock, getContentBlockRaw } from "@/server/queries/content";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Rooibok Technologies — our mission, team, and story. A passionate team building innovative software from Lira, Uganda.",
};
import { PageHero } from "@/components/shared/page-hero";
import { CtaBanner } from "@/components/shared/cta-banner";
import { FadeIn } from "@/components/effects/fade-in";
import { ArrowRight, Compass, Users, BookOpen } from "lucide-react";

// ─── Simple Tiptap JSON renderer ──────────────────────────────
type TiptapNode = {
  type: string;
  content?: TiptapNode[];
  text?: string;
};

function extractParagraphs(doc: TiptapNode): string[] {
  if (!doc?.content) return [];
  return doc.content
    .filter((node) => node.type === "paragraph" && node.content)
    .map((node) =>
      (node.content ?? [])
        .filter((child) => child.type === "text")
        .map((child) => child.text ?? "")
        .join("")
    )
    .filter(Boolean);
}

// ─── Quick link cards ──────────────────────────────────────────
const quickLinks = [
  {
    href: "/about/mission",
    icon: Compass,
    title: "Mission & Vision",
    description: "What drives us and where we're heading.",
  },
  {
    href: "/about/team",
    icon: Users,
    title: "Meet the Team",
    description: "The people behind Rooibok Technologies.",
  },
  {
    href: "/about/story",
    icon: BookOpen,
    title: "Our Story",
    description: "How we got here and the milestones along the way.",
  },
];

export default async function AboutPage() {
  const [headline, subheadline, overviewRaw, ctaHeadline, ctaSubtitle, ctaButton] =
    await Promise.all([
      getContentBlock("about.hero.headline", "Who We Are"),
      getContentBlock(
        "about.hero.subheadline",
        "Learn more about Rooibok Technologies — our mission, our team, and our story."
      ),
      getContentBlockRaw("about.overview"),
      getContentBlock("cta.default.headline", "Ready to build something great?"),
      getContentBlock("cta.default.subtitle", "Let's talk about your next project."),
      getContentBlock("cta.default.button", "Get in Touch"),
    ]);

  const paragraphs = overviewRaw?.content
    ? extractParagraphs(overviewRaw.content as TiptapNode)
    : [];

  return (
    <div>
      <PageHero title={headline} subtitle={subheadline} />

      {/* ── Overview ─────────────────────────────────────── */}
      {paragraphs.length > 0 && (
        <section className="border-t border-[var(--border)] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <FadeIn>
              <div className="prose prose-lg max-w-none">
                {paragraphs.map((text, i) => (
                  <p
                    key={i}
                    className="text-[var(--foreground-muted)] leading-relaxed [&+p]:mt-4"
                  >
                    {text}
                  </p>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* ── Quick Links Grid ────────────────────────────── */}
      <section className="border-t border-[var(--border)] bg-[var(--surface)] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {quickLinks.map((link, i) => {
              const Icon = link.icon;
              return (
                <FadeIn key={link.href} delay={i * 0.1}>
                  <Link
                    href={link.href}
                    className="group flex flex-col rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 transition-all hover:border-[var(--accent)] hover:shadow-lg hover:shadow-[var(--accent)]/5"
                  >
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)]/10">
                      <Icon className="h-5 w-5 text-[var(--accent)]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--foreground)]">
                      {link.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm text-[var(--foreground-muted)]">
                      {link.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)] transition-colors group-hover:text-[var(--accent-hover)]">
                      Explore
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────── */}
      <CtaBanner
        title={ctaHeadline}
        subtitle={ctaSubtitle}
        buttonText={ctaButton}
        buttonHref="/contact"
      />
    </div>
  );
}
