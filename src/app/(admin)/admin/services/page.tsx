import Link from "next/link";
import { db } from "@/lib/db";
import { StatusBadge } from "@/components/admin/status-badge";
import { Plus } from "lucide-react";
import { ServiceDeleteButton } from "./actions-client";

export default async function AdminServicesPage() {
  const services = await db.service.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Services</h1>
        <Link href="/admin/services/new" className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-foreground)] hover:bg-[var(--accent-hover)]">
          <Plus className="h-4 w-4" /> New Service
        </Link>
      </div>
      <div className="mt-6 overflow-x-auto rounded-xl border border-[var(--border)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--surface)]">
              <th className="px-4 py-3 text-left font-medium text-[var(--foreground-muted)]">Order</th>
              <th className="px-4 py-3 text-left font-medium text-[var(--foreground-muted)]">Name</th>
              <th className="px-4 py-3 text-left font-medium text-[var(--foreground-muted)]">Icon</th>
              <th className="px-4 py-3 text-left font-medium text-[var(--foreground-muted)]">Status</th>
              <th className="px-4 py-3 text-right font-medium text-[var(--foreground-muted)]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {services.map((s) => (
              <tr key={s.id} className="hover:bg-[var(--surface)]/50">
                <td className="px-4 py-3 text-[var(--foreground-muted)]">{s.order}</td>
                <td className="px-4 py-3 font-medium text-[var(--foreground)]">{s.name}</td>
                <td className="px-4 py-3 text-[var(--foreground-muted)]">{s.icon}</td>
                <td className="px-4 py-3"><StatusBadge status={s.published ? "published" : "draft"} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/services/${s.id}/edit`} className="rounded-lg px-3 py-1 text-xs font-medium text-[var(--foreground-muted)] hover:bg-[var(--surface)]">Edit</Link>
                    <ServiceDeleteButton id={s.id} name={s.name} />
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
