import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Briefcase, MapPin } from "lucide-react";
import { getContentBlock } from "@/server/queries/content";
import { getOpenJobs } from "@/server/queries/jobs";
import { PageHero } from "@/components/shared/page-hero";
import { CtaBanner } from "@/components/shared/cta-banner";

export const metadata: Metadata = {
  title: "Careers | Rooibok Technologies",
  description: "Join our team. Build the future with us.",
};

const TYPE_LABELS: Record<string, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
};

export default async function CareersPage() {
  const [headline, subheadline, culture, emptyMessage, ctaHeadline, ctaButton, jobs] =
    await Promise.all([
      getContentBlock("careers.hero.headline", "Join Our Team"),
      getContentBlock(
        "careers.hero.subheadline",
        "We're building software that matters. Come help us do it."
      ),
      getContentBlock(
        "careers.culture",
        "We value craft, curiosity, and the kind of teamwork that makes hard problems fun."
      ),
      getContentBlock(
        "careers.empty",
        "No open positions right now — but we're always interested in great people. Drop us a line."
      ),
      getContentBlock("cta.default.headline", "Don't see a fit?"),
      getContentBlock("cta.default.button", "Get in Touch"),
      getOpenJobs(),
    ]);

  // Group by department
  const byDepartment = jobs.reduce<Record<string, typeof jobs>>((acc, job) => {
    (acc[job.department] ||= []).push(job);
    return acc;
  }, {});

  return (
    <>
      <PageHero title={headline} subtitle={subheadline} />

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[var(--foreground)]">
              Our culture
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[var(--foreground-muted)]">
              {culture}
            </p>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-[var(--foreground)]">
              Open positions
            </h2>

            {jobs.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)] p-10 text-center">
                <Briefcase className="mx-auto h-10 w-10 text-[var(--foreground-muted)]" />
                <p className="mt-4 text-base text-[var(--foreground-muted)]">
                  {emptyMessage}
                </p>
                <Link
                  href="/contact"
                  className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]"
                >
                  Contact us <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <div className="mt-6 space-y-10">
                {Object.entries(byDepartment).map(([department, deptJobs]) => (
                  <div key={department}>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
                      {department}
                    </h3>
                    <div className="mt-4 space-y-3">
                      {deptJobs.map((job) => (
                        <Link
                          key={job.id}
                          href={`/careers/${job.slug}`}
                          className="group flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 transition-colors hover:border-[var(--accent)] sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="min-w-0 flex-1">
                            <h4 className="text-lg font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)]">
                              {job.title}
                            </h4>
                            <p className="mt-1 text-sm text-[var(--foreground-muted)] line-clamp-2">
                              {job.shortDescription}
                            </p>
                            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[var(--foreground-muted)]">
                              <span className="inline-flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                {job.location}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <Briefcase className="h-3.5 w-3.5" />
                                {TYPE_LABELS[job.type] ?? job.type}
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="hidden h-5 w-5 shrink-0 text-[var(--foreground-muted)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--accent)] sm:block" />
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <CtaBanner
        title={ctaHeadline}
        buttonText={ctaButton}
        buttonHref="/contact"
      />
    </>
  );
}
