import type { Metadata } from "next";
import { getContentBlock } from "@/server/queries/content";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "The story of Rooibok Technologies — from a bold idea in Lira, Uganda to building digital solutions for the world.",
};
import { getMilestones } from "@/server/queries/milestones";
import { PageHero } from "@/components/shared/page-hero";
import { CtaBanner } from "@/components/shared/cta-banner";
import { FadeIn } from "@/components/effects/fade-in";
import { formatDate } from "@/lib/utils";

export default async function StoryPage() {
  const [heroHeadline, heroSubheadline, ctaHeadline, ctaSubtitle, ctaButton] =
    await Promise.all([
      getContentBlock("about.story.hero.headline", "Our Story"),
      getContentBlock(
        "about.story.hero.subheadline",
        "The journey of Rooibok Technologies — from idea to impact."
      ),
      getContentBlock("cta.default.headline", "Ready to build something great?"),
      getContentBlock("cta.default.subtitle", "Let's talk about your next project."),
      getContentBlock("cta.default.button", "Get in Touch"),
    ]);

  const milestones = await getMilestones();

  return (
    <div>
      <PageHero title={heroHeadline} subtitle={heroSubheadline} />

      {/* ── Timeline ─────────────────────────────────────── */}
      <section className="border-t border-[var(--border)] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {milestones.length > 0 ? (
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-4 top-0 hidden h-full w-px bg-[var(--border)] md:left-1/2 md:block" />

              <div className="space-y-12">
                {milestones.map((milestone, i) => {
                  const isLeft = i % 2 === 0;
                  return (
                    <FadeIn key={milestone.id} delay={i * 0.1}>
                      <div className="relative md:flex md:items-start">
                        {/* Dot on the timeline */}
                        <div className="absolute left-4 top-1 hidden h-3 w-3 -translate-x-1/2 rounded-full border-2 border-[var(--accent)] bg-[var(--card)] md:left-1/2 md:block" />

                        {/* Content — alternating sides on desktop */}
                        <div
                          className={`pl-10 md:w-1/2 md:pl-0 ${
                            isLeft
                              ? "md:pr-12 md:text-right"
                              : "md:ml-auto md:pl-12 md:text-left"
                          }`}
                        >
                          <time className="text-sm font-medium text-[var(--accent)]">
                            {formatDate(milestone.date)}
                          </time>
                          <h3 className="mt-1 text-lg font-semibold text-[var(--foreground)]">
                            {milestone.title}
                          </h3>
                          {milestone.description && (
                            <p className="mt-2 text-sm leading-relaxed text-[var(--foreground-muted)]">
                              {milestone.description}
                            </p>
                          )}
                          {milestone.image && (
                            <div className="mt-4 overflow-hidden rounded-lg">
                              <img
                                src={milestone.image}
                                alt={milestone.title}
                                className="w-full rounded-lg object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </FadeIn>
                  );
                })}
              </div>
            </div>
          ) : (
            <FadeIn>
              <p className="text-center text-[var(--foreground-muted)]">
                Our story is just beginning. Check back soon for milestones.
              </p>
            </FadeIn>
          )}
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
