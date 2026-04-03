"use client";

import { useState, useEffect } from "react";
import { updateContentBlock } from "@/server/actions/content";

export default function AdminLegalPage() {
  const [privacy, setPrivacy] = useState("");
  const [terms, setTerms] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/content-blocks")
      .then((r) => r.json())
      .then((blocks: { key: string; content: unknown }[]) => {
        const p = blocks.find((b) => b.key === "legal.privacy_policy");
        const t = blocks.find((b) => b.key === "legal.terms_of_service");
        if (p) setPrivacy(JSON.stringify(p.content, null, 2));
        if (t) setTerms(JSON.stringify(t.content, null, 2));
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await updateContentBlock({ key: "legal.privacy_policy", content: JSON.parse(privacy), type: "RICH_TEXT" });
      await updateContentBlock({ key: "legal.terms_of_service", content: JSON.parse(terms), type: "RICH_TEXT" });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch { alert("Invalid JSON"); }
    setSaving(false);
  }

  if (loading) return <p className="text-[var(--foreground-muted)]">Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Legal Pages</h1>
      <div className="mt-6 max-w-3xl space-y-8">
        <div>
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Privacy Policy</h2>
          <textarea value={privacy} onChange={(e) => setPrivacy(e.target.value)} rows={12} className="mt-2 block w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 font-mono text-xs text-[var(--foreground)] focus:border-[var(--ring)] focus:outline-none" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Terms of Service</h2>
          <textarea value={terms} onChange={(e) => setTerms(e.target.value)} rows={12} className="mt-2 block w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 font-mono text-xs text-[var(--foreground)] focus:border-[var(--ring)] focus:outline-none" />
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleSave} disabled={saving} className="rounded-lg bg-[var(--accent)] px-6 py-2.5 text-sm font-medium text-[var(--accent-foreground)] hover:bg-[var(--accent-hover)] disabled:opacity-50">
            {saving ? "Saving..." : "Save Legal Pages"}
          </button>
          {saved && <span className="text-sm text-green-600">Saved!</span>}
        </div>
      </div>
    </div>
  );
}
