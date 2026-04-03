"use client";
import { useRouter } from "next/navigation";
import { updateApplicationStatus } from "@/server/actions/careers";
import type { ApplicationStatus } from "@prisma/client";

const statuses: ApplicationStatus[] = ["NEW", "REVIEWING", "INTERVIEW", "OFFERED", "REJECTED", "HIRED"];

export function ApplicationStatusSelect({ id, currentStatus }: { id: string; currentStatus: ApplicationStatus }) {
  const router = useRouter();
  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    await updateApplicationStatus(id, e.target.value as ApplicationStatus);
    router.refresh();
  }
  return (
    <select value={currentStatus} onChange={handleChange} className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2 py-1 text-xs text-[var(--foreground)] focus:border-[var(--ring)] focus:outline-none">
      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
    </select>
  );
}
