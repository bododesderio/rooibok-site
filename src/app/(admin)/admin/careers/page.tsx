import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/admin/status-badge";
import { Plus } from "lucide-react";
import { JobDeleteButton } from "./actions-client";

export default async function AdminCareersPage() {
  const jobs = await db.job.findMany({
    include: { _count: { select: { applications: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Careers</h1>
        <Link href="/admin/careers/new" className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-foreground)] hover:bg-[var(--accent-hover)]">
          <Plus className="h-4 w-4" /> New Job
        </Link>
      </div>
      <div className="mt-6 overflow-x-auto rounded-xl border border-[var(--border)]">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-[var(--border)] bg-[var(--surface)]">
            <th className="px-4 py-3 text-left font-medium text-[var(--foreground-muted)]">Title</th>
            <th className="px-4 py-3 text-left font-medium text-[var(--foreground-muted)]">Department</th>
            <th className="px-4 py-3 text-left font-medium text-[var(--foreground-muted)]">Type</th>
            <th className="px-4 py-3 text-left font-medium text-[var(--foreground-muted)]">Applications</th>
            <th className="px-4 py-3 text-left font-medium text-[var(--foreground-muted)]">Status</th>
            <th className="px-4 py-3 text-right font-medium text-[var(--foreground-muted)]">Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-[var(--border)]">
            {jobs.map((j) => (
              <tr key={j.id} className="hover:bg-[var(--surface)]/50">
                <td className="px-4 py-3 font-medium text-[var(--foreground)]">{j.title}</td>
                <td className="px-4 py-3 text-[var(--foreground-muted)]">{j.department}</td>
                <td className="px-4 py-3 text-[var(--foreground-muted)]">{j.type.replace("_", " ")}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/careers/${j.id}/applications`} className="text-[var(--accent)] hover:underline">
                    {j._count.applications}
                  </Link>
                </td>
                <td className="px-4 py-3"><StatusBadge status={j.published ? "published" : "draft"} /></td>
                <td className="px-4 py-3"><div className="flex items-center justify-end gap-2">
                  <Link href={`/admin/careers/${j.id}/edit`} className="rounded-lg px-3 py-1 text-xs font-medium text-[var(--foreground-muted)] hover:bg-[var(--surface)]">Edit</Link>
                  <JobDeleteButton id={j.id} name={j.title} />
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
