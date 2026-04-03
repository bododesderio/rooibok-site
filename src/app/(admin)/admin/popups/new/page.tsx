import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PopupForm } from "../popup-form";

export default function NewPopupPage() {
  return (
    <div>
      <Link href="/admin/popups" className="inline-flex items-center gap-1 text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)]">
        <ArrowLeft className="h-4 w-4" /> Back to Popups
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-[var(--foreground)]">New Popup</h1>
      <div className="mt-6">
        <PopupForm />
      </div>
    </div>
  );
}
