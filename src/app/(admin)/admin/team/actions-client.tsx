"use client";
import { useRouter } from "next/navigation";
import { deleteTeamMember } from "@/server/actions/team";
export function TeamDeleteButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  async function handleDelete() { if (!confirm(`Delete "${name}"?`)) return; await deleteTeamMember(id); router.refresh(); }
  return <button onClick={handleDelete} className="rounded-lg px-3 py-1 text-xs font-medium text-[var(--destructive)] hover:bg-[var(--destructive)]/10">Delete</button>;
}
