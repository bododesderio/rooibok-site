import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/admin/status-badge";
import { Plus } from "lucide-react";
import { ProjectDeleteButton } from "./actions-client";

export default async function AdminPortfolioPage() {
  const projects = await db.project.findMany({
    include: { services: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Portfolio</h1>
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            {projects.length} project{projects.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/portfolio/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-foreground)] transition-colors hover:bg-[var(--accent-hover)]"
        >
          <Plus className="h-4 w-4" />
          New Project
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-[var(--border)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--surface)]">
              <th className="px-4 py-3 text-left font-medium text-[var(--foreground-muted)]">Title</th>
              <th className="px-4 py-3 text-left font-medium text-[var(--foreground-muted)]">Client</th>
              <th className="px-4 py-3 text-left font-medium text-[var(--foreground-muted)]">Status</th>
              <th className="px-4 py-3 text-left font-medium text-[var(--foreground-muted)]">Date</th>
              <th className="px-4 py-3 text-right font-medium text-[var(--foreground-muted)]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {projects.map((p) => (
              <tr key={p.id} className="hover:bg-[var(--surface)]/50">
                <td className="px-4 py-3">
                  <Link href={`/admin/portfolio/${p.id}/edit`} className="font-medium text-[var(--foreground)] hover:text-[var(--accent)]">
                    {p.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-[var(--foreground-muted)]">{p.client ?? "—"}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={p.published ? "published" : "draft"} />
                </td>
                <td className="px-4 py-3 text-[var(--foreground-muted)]">{formatDate(p.createdAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/portfolio/${p.id}/edit`} className="rounded-lg px-3 py-1 text-xs font-medium text-[var(--foreground-muted)] hover:bg-[var(--surface)]">Edit</Link>
                    <ProjectDeleteButton id={p.id} name={p.title} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
