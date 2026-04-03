import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { MarkReadButton } from "./actions-client";

export default async function AdminInquiriesPage() {
  const inquiries = await db.inquiry.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Inquiries</h1>
      <p className="mt-1 text-sm text-[var(--foreground-muted)]">
        {inquiries.filter((i) => !i.read).length} unread of {inquiries.length} total
      </p>

      <div className="mt-6 space-y-4">
        {inquiries.map((inq) => (
          <div
            key={inq.id}
            className={`rounded-xl border bg-[var(--card)] p-5 ${
              inq.read ? "border-[var(--border)]" : "border-[var(--accent)]/30"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-[var(--foreground)]">{inq.fullName}</h3>
                  {!inq.read && <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />}
                </div>
                <p className="text-sm text-[var(--foreground-muted)]">
                  {inq.email} {inq.phone && `· ${inq.phone}`}
                </p>
                <div className="mt-1 flex gap-3 text-xs text-[var(--foreground-muted)]">
                  {inq.service && <span>Service: {inq.service}</span>}
                  {inq.budget && <span>Budget: {inq.budget}</span>}
                  <span>{formatDate(inq.createdAt)}</span>
                </div>
              </div>
              {!inq.read && <MarkReadButton id={inq.id} />}
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm text-[var(--foreground-muted)]">
              {inq.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
