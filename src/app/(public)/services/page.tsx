import type { Metadata } from "next";
import Link from "next/link";
import { getContentBlock } from "@/server/queries/content";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore our services — web development, mobile apps, UI/UX design, tech consulting, DevOps, and more.",
};
import { getPublishedServices } from "@/server/queries/services";
import { PageHero } from "@/components/shared/page-hero";
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

export default async function ServicesPage() {
  const [headline, subheadline, ctaHeadline, ctaSubtitle, ctaButtonText] =
    await Promise.all([
      getContentBlock("services.hero.headline", "What We Do"),
      getContentBlock(
        "services.hero.subheadline",
        "End-to-end digital services tailored to your business needs."
      ),
      getContentBlock(
        "cta.services.headline",
        "Ready to build something great?"
      ),
      getContentBlock(
        "cta.services.subtitle",
        "Let's talk about your next project."
      ),
      getContentBlock("cta.services.button", "Get in Touch"),
    ]);

  const services = await getPublishedServices();

  return (
    <div>
      <PageHero title={headline} subtitle={subheadline} />

      {/* ── Service Cards Grid ─────────────────────────────── */}
      {services.length > 0 && (
        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, i) => {
                const Icon = ICON_MAP[service.icon] || Code2;
                return (
                  <FadeIn key={service.id} delay={i * 0.1}>
                    <Link
                      href={`/services/${service.slug}`}
                      className="group flex h-full flex-col rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 transition-all hover:border-[var(--accent)] hover:shadow-lg hover:shadow-[var(--accent)]/5"
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
