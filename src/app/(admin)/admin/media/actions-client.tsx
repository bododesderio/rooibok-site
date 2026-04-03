"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createMedia } from "@/server/actions/media";

export function MediaActions() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [filename, setFilename] = useState("");
  const [adding, setAdding] = useState(false);

  async function handleAdd() {
    if (!url || !filename) return;
    setAdding(true);
    await createMedia({
      filename,
      url,
      mimeType: url.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i) ? "image/" + (url.match(/\.(\w+)$/)?.[1] ?? "png") : "application/octet-stream",
      size: 0,
    });
    setUrl("");
    setFilename("");
    setAdding(false);
    router.refresh();
  }

  return (
    <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <h2 className="text-sm font-semibold text-[var(--foreground)]">Add Media (URL)</h2>
      <div className="mt-3 flex flex-wrap gap-3">
        <input type="text" value={filename} onChange={(e) => setFilename(e.target.value)} placeholder="Filename" className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-sm text-[var(--foreground)] focus:border-[var(--ring)] focus:outline-none" />
        <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="URL" className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-sm text-[var(--foreground)] focus:border-[var(--ring)] focus:outline-none" />
        <button onClick={handleAdd} disabled={adding} className="rounded-lg bg-[var(--accent)] px-4 py-1.5 text-sm font-medium text-[var(--accent-foreground)] hover:bg-[var(--accent-hover)] disabled:opacity-50">
          {adding ? "Adding..." : "Add"}
        </button>
      </div>
    </div>
  );
}
