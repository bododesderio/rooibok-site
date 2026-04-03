import Link from "next/link";
import { db } from "@/lib/db";
import { StatusBadge } from "@/components/admin/status-badge";
import { Plus } from "lucide-react";
import { TeamDeleteButton } from "./actions-client";

export default async function AdminTeamPage() {
  const members = await db.teamMember.findMany({ orderBy: { order: "asc" } });
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Team Members</h1>
        <Link href="/admin/team/new" className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-foreground)] hover:bg-[var(--accent-hover)]"><Plus className="h-4 w-4" /> Add Member</Link>
      </div>
      <div className="mt-6 overflow-x-auto rounded-xl border border-[var(--border)]">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-[var(--border)] bg-[var(--surface)]">
            <th className="px-4 py-3 text-left font-medium text-[var(--foreground-muted)]">Order</th>
            <th className="px-4 py-3 text-left font-medium text-[var(--foreground-muted)]">Name</th>
            <th className="px-4 py-3 text-left font-medium text-[var(--foreground-muted)]">Role</th>
            <th className="px-4 py-3 text-left font-medium text-[var(--foreground-muted)]">Status</th>
            <th className="px-4 py-3 text-right font-medium text-[var(--foreground-muted)]">Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-[var(--border)]">
            {members.map((m) => (
              <tr key={m.id} className="hover:bg-[var(--surface)]/50">
                <td className="px-4 py-3 text-[var(--foreground-muted)]">{m.order}</td>
                <td className="px-4 py-3 font-medium text-[var(--foreground)]">{m.name}</td>
                <td className="px-4 py-3 text-[var(--foreground-muted)]">{m.role}</td>
                <td className="px-4 py-3"><StatusBadge status={m.published ? "published" : "draft"} /></td>
                <td className="px-4 py-3"><div className="flex items-center justify-end gap-2">
                  <Link href={`/admin/team/${m.id}/edit`} className="rounded-lg px-3 py-1 text-xs font-medium text-[var(--foreground-muted)] hover:bg-[var(--surface)]">Edit</Link>
                  <TeamDeleteButton id={m.id} name={m.name} />
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
