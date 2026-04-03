"use client";
import { useRouter } from "next/navigation";
import { togglePopupActive, deletePopup } from "@/server/actions/popups";

export function PopupActions({ id, name, active }: { id: string; name: string; active: boolean }) {
  const router = useRouter();
  return (
    <>
      <button onClick={async () => { await togglePopupActive(id); router.refresh(); }} className="rounded-lg px-3 py-1 text-xs font-medium text-[var(--foreground-muted)] hover:bg-[var(--surface)]">
        {active ? "Deactivate" : "Activate"}
      </button>
      <button onClick={async () => { if (confirm(`Delete "${name}"?`)) { await deletePopup(id); router.refresh(); } }} className="rounded-lg px-3 py-1 text-xs font-medium text-[var(--destructive)] hover:bg-[var(--destructive)]/10">
        Delete
      </button>
    </>
  );
}
