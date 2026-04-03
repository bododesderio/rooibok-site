"use client";
import { useRouter } from "next/navigation";
import { deleteService } from "@/server/actions/services";

export function ServiceDeleteButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  async function handleDelete() {
    if (!confirm(`Delete "${name}"?`)) return;
    await deleteService(id);
    router.refresh();
  }
  return (
    <button onClick={handleDelete} className="rounded-lg px-3 py-1 text-xs font-medium text-[var(--destructive)] hover:bg-[var(--destructive)]/10">Delete</button>
  );
}
