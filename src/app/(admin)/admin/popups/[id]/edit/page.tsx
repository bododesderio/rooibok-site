import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { PopupForm } from "../../popup-form";

export default async function EditPopupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const popup = await db.popup.findUnique({ where: { id } });
  if (!popup) notFound();

  return (
    <div>
      <Link href="/admin/popups" className="inline-flex items-center gap-1 text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)]">
        <ArrowLeft className="h-4 w-4" /> Back to Popups
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-[var(--foreground)]">Edit Popup</h1>
      <div className="mt-6">
        <PopupForm popup={popup} />
      </div>
    </div>
  );
}
