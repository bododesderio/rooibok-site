import type { Metadata } from "next";
import { getContentBlock, getContentGroup } from "@/server/queries/content";

export const metadata: Metadata = {
  title: "Mission & Vision",
  description:
    "Discover the mission, vision, and core values that drive Rooibok Technologies.",
};
import { PageHero } from "@/components/shared/page-hero";
import { CtaBanner } from "@/components/shared/cta-banner";
import { SectionHeader } from "@/components/shared/section-header";
import { FadeIn } from "@/components/effects/fade-in";
import {
  Heart,
  Lightbulb,
  Shield,
  Users,
  Zap,
  Globe,
  Target,
  Rocket,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Heart,
  Lightbulb,
  Shield,
  Users,
  Zap,
  Globe,
  Target,
  Rocket,
};

export default async function MissionPage() {
  const [
    heroHeadline,
    heroSubheadline,
    mission,
    vision,
    ctaHeadline,
    ctaSubtitle,
    ctaButton,
  ] = await Promise.all([
    getContentBlock("about.mission.hero.headline", "Mission & Vision"),
    getContentBlock(
      "about.mission.hero.subheadline",
      "What drives us forward and the future we are building."
    ),
    getContentBlock(
      "about.mission",
      "To empower businesses with innovative, reliable, and accessible technology solutions — built from the heart of Uganda for the world."
    ),
    getContentBlock(
      "about.vision",
      "A world where geography is no barrier to world-class technology."
    ),
    getContentBlock("cta.default.headline", "Ready to build something great?"),
    getContentBlock("cta.default.subtitle", "Let's talk about your next project."),
    getContentBlock("cta.default.button", "Get in Touch"),
  ]);

  const valuesBlocks = await getContentGroup("about.values");

  return (
    <div>
      <PageHero title={heroHeadline} subtitle={heroSubheadline} />

      {/* ── Mission Statement ────────────────────────────── */}
      <section className="border-t border-[var(--border)] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <SectionHeader title="Our Mission" />
            <p className="mt-6 text-center text-lg leading-relaxed text-[var(--foreground-muted)]">
              {mission}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── Vision Statement ─────────────────────────────── */}
      <section className="border-t border-[var(--border)] bg-[var(--surface)] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <SectionHeader title="Our Vision" />
            <p className="mt-6 text-center text-lg leading-relaxed text-[var(--foreground-muted)]">
              {vision}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── Values Grid ──────────────────────────────────── */}
      {valuesBlocks.length > 0 && (
        <section className="border-t border-[var(--border)] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <FadeIn>
              <SectionHeader
                title="Our Values"
                subtitle="The principles that guide everything we do."
              />
            </FadeIn>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {valuesBlocks.map((block, i) => {
                const data = block.content as {
                  title?: string;
                  description?: string;
                  icon?: string;
                };
                const Icon = ICON_MAP[data.icon ?? ""] || Heart;
                return (
                  <FadeIn key={block.id} delay={i * 0.1}>
                    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)]/10">
                        <Icon className="h-5 w-5 text-[var(--accent)]" />
                      </div>
                      <h3 className="text-lg font-semibold text-[var(--foreground)]">
                        {data.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--foreground-muted)]">
                        {data.description}
                      </p>
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>
      )}

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
