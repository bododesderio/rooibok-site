"use client";

import { useRouter } from "next/navigation";
import { deleteProject } from "@/server/actions/portfolio";

export function ProjectDeleteButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await deleteProject(id);
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      className="rounded-lg px-3 py-1 text-xs font-medium text-[var(--destructive)] hover:bg-[var(--destructive)]/10"
    >
      Delete
    </button>
  );
}
