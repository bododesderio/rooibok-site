"use client";
import { useRouter } from "next/navigation";
import { markInquiryRead } from "@/server/actions/inquiries";

export function MarkReadButton({ id }: { id: string }) {
  const router = useRouter();
  async function handleClick() {
    await markInquiryRead(id);
    router.refresh();
  }
  return (
    <button onClick={handleClick} className="rounded-lg px-3 py-1 text-xs font-medium text-[var(--accent)] hover:bg-[var(--accent)]/10">
      Mark read
    </button>
  );
}
