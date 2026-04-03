import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { ApplicationStatusSelect } from "./status-select";

type Props = { params: Promise<{ id: string }> };

export default async function JobApplicationsPage({ params }: Props) {
  const { id } = await params;
  const job = await db.job.findUnique({
    where: { id },
    include: { applications: { orderBy: { createdAt: "desc" } } },
  });
  if (!job) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--foreground)]">
        Applications for {job.title}
      </h1>
      <p className="mt-1 text-sm text-[var(--foreground-muted)]">
        {job.applications.length} application{job.applications.length !== 1 ? "s" : ""}
      </p>

      <div className="mt-6 space-y-4">
        {job.applications.map((app) => (
          <div key={app.id} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-[var(--foreground)]">{app.fullName}</h3>
                <p className="text-sm text-[var(--foreground-muted)]">{app.email} &middot; {app.phone}</p>
                <p className="mt-1 text-xs text-[var(--foreground-muted)]">{formatDate(app.createdAt)}</p>
              </div>
              <ApplicationStatusSelect id={app.id} currentStatus={app.status} />
            </div>
            {app.coverLetter && (
              <p className="mt-3 text-sm text-[var(--foreground-muted)]">{app.coverLetter}</p>
            )}
            <div className="mt-3 flex gap-3 text-xs">
              {app.resumeUrl && <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">Resume</a>}
              {app.portfolioUrl && <a href={app.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">Portfolio</a>}
              {app.linkedinUrl && <a href={app.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">LinkedIn</a>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
