import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { MediaActions } from "./actions-client";

export default async function AdminMediaPage() {
  const media = await db.media.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Media Library</h1>
      <p className="mt-1 text-sm text-[var(--foreground-muted)]">
        {media.length} file{media.length !== 1 ? "s" : ""}
      </p>

      <MediaActions />

      {media.length === 0 ? (
        <p className="mt-8 text-center text-[var(--foreground-muted)]">
          No media files yet. Add one above.
        </p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {media.map((m) => (
            <div key={m.id} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
              {m.mimeType.startsWith("image/") && (
                <img src={m.url} alt={m.alt ?? m.filename} className="mb-3 h-32 w-full rounded-lg object-cover" />
              )}
              <p className="truncate text-sm font-medium text-[var(--foreground)]">{m.filename}</p>
              <p className="text-xs text-[var(--foreground-muted)]">
                {m.mimeType} &middot; {Math.round(m.size / 1024)}KB &middot; {formatDate(m.createdAt)}
              </p>
              <input value={m.url} readOnly className="mt-2 block w-full rounded border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-xs text-[var(--foreground-muted)]" onClick={(e) => (e.target as HTMLInputElement).select()} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
