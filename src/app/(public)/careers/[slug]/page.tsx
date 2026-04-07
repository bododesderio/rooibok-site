import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Briefcase, MapPin, DollarSign } from "lucide-react";
import { getJobBySlug } from "@/server/queries/jobs";
import { TiptapRenderer } from "@/components/shared/tiptap-renderer";
import { ApplicationForm } from "@/components/shared/application-form";

const TYPE_LABELS: Record<string, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) return { title: "Job Not Found | Rooibok Technologies" };
  return {
    title: `${job.title} | Careers | Rooibok Technologies`,
    description: job.shortDescription,
  };
}

function formatSalary(min: number | null, max: number | null, currency: string | null) {
  if (!min && !max) return null;
  const cur = currency ?? "UGX";
  const fmt = (n: number) => n.toLocaleString();
  if (min && max) return `${cur} ${fmt(min)} – ${fmt(max)}`;
  if (min) return `${cur} ${fmt(min)}+`;
  return `Up to ${cur} ${fmt(max!)}`;
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job || job.closedAt) notFound();

  const salary = formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency);

  return (
    <article className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/careers"
          className="inline-flex items-center gap-1 text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Careers
        </Link>

        <header className="mt-6 border-b border-[var(--border)] pb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--accent)]">
            {job.department}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
            {job.title}
          </h1>
          <p className="mt-4 text-lg text-[var(--foreground-muted)]">
            {job.shortDescription}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-[var(--foreground-muted)]">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {job.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Briefcase className="h-4 w-4" />
              {TYPE_LABELS[job.type] ?? job.type}
            </span>
            {salary && (
              <span className="inline-flex items-center gap-1.5">
                <DollarSign className="h-4 w-4" />
                {salary}
              </span>
            )}
          </div>
        </header>

        <section className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <TiptapRenderer content={job.description as never} />
        </section>

        <section id="apply" className="mt-16 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-[var(--foreground)]">
            Apply for this position
          </h2>
          <p className="mt-2 text-sm text-[var(--foreground-muted)]">
            Tell us about yourself and attach your resume.
          </p>
          <div className="mt-6">
            <ApplicationForm jobId={job.id} jobTitle={job.title} />
          </div>
        </section>
      </div>
    </article>
  );
}
