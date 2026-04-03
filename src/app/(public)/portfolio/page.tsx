import type { Metadata } from "next";
import { getContentBlock } from "@/server/queries/content";
import { getPublishedProjects } from "@/server/queries/projects";
import { getPublishedServices } from "@/server/queries/services";
import { PageHero } from "@/components/shared/page-hero";
import { CtaBanner } from "@/components/shared/cta-banner";
import { PortfolioFilter } from "@/components/shared/portfolio-filter";

export const metadata: Metadata = {
  title: "Portfolio | Rooibok Technologies",
  description: "Projects we're proud of — and the stories behind them.",
};

export default async function PortfolioPage() {
  const [headline, subheadline, ctaHeadline, ctaButton, projects, services] =
    await Promise.all([
      getContentBlock("portfolio.hero.headline", "Our Work"),
      getContentBlock("portfolio.hero.subheadline", "Projects we're proud of."),
      getContentBlock("cta.default.headline", "Ready to build something great?"),
      getContentBlock("cta.default.button", "Get in Touch"),
      getPublishedProjects(),
      getPublishedServices(),
    ]);

  // Serialize dates for client component
  const serializedProjects = projects.map((p) => ({
    ...p,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  }));

  const serviceOptions = services.map((s) => ({
    id: s.id,
    slug: s.slug,
    name: s.name,
  }));

  return (
    <>
      <PageHero title={headline} subtitle={subheadline} />

      <PortfolioFilter
        projects={serializedProjects}
        services={serviceOptions}
      />

      <CtaBanner
        title={ctaHeadline}
        subtitle="Let's talk about your next project."
        buttonText={ctaButton}
        buttonHref="/contact"
      />
    </>
  );
}
