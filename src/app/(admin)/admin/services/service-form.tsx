"use client";
import { useState } from "react";
import { createService, updateService } from "@/server/actions/services";
import { TiptapEditor } from "@/components/admin/tiptap-editor";

const EMPTY_DOC = { type: "doc", content: [{ type: "paragraph" }] };

type Props = {
  service?: { id: string; name: string; slug: string; icon: string; shortDescription: string; fullDescription: unknown; techStack: string[]; order: number; published: boolean };
};

export function ServiceForm({ service }: Props) {
  const [name, setName] = useState(service?.name ?? "");
  const [slug, setSlug] = useState(service?.slug ?? "");
  const [icon, setIcon] = useState(service?.icon ?? "");
  const [shortDescription, setShortDescription] = useState(service?.shortDescription ?? "");
  const [fullDescription, setFullDescription] = useState<unknown>(service?.fullDescription ?? EMPTY_DOC);
  const [techStack, setTechStack] = useState(service?.techStack.join(", ") ?? "");
  const [order, setOrder] = useState(service?.order ?? 0);
  const [published, setPublished] = useState(service?.published ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setSaving(true);
    try {
      const data = { name, slug, icon, shortDescription, fullDescription, techStack: techStack.split(",").map(s => s.trim()).filter(Boolean), order, published };
      if (service) await updateService(service.id, data);
      else await createService(data);
    } catch (err) { setError(String(err)); setSaving(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      {error && <div className="rounded-lg border border-[var(--destructive)]/20 bg-[var(--destructive)]/5 p-3 text-sm text-[var(--destructive)]">{error}</div>}
      <div><label className="block text-sm font-medium text-[var(--foreground)]">Name</label><input type="text" value={name} onChange={e => { setName(e.target.value); if (!service) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")); }} required className="mt-1 block w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]" /></div>
      <div className="grid grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium text-[var(--foreground)]">Slug</label><input type="text" value={slug} onChange={e => setSlug(e.target.value)} required className="mt-1 block w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]" /></div>
        <div><label className="block text-sm font-medium text-[var(--foreground)]">Icon (Lucide name)</label><input type="text" value={icon} onChange={e => setIcon(e.target.value)} required className="mt-1 block w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]" /></div>
        <div><label className="block text-sm font-medium text-[var(--foreground)]">Order</label><input type="number" value={order} onChange={e => setOrder(Number(e.target.value))} className="mt-1 block w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]" /></div>
      </div>
      <div><label className="block text-sm font-medium text-[var(--foreground)]">Short Description</label><textarea value={shortDescription} onChange={e => setShortDescription(e.target.value)} required rows={2} className="mt-1 block w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]" /></div>
      <div><label className="block text-sm font-medium text-[var(--foreground)]">Tech Stack (comma-separated)</label><input type="text" value={techStack} onChange={e => setTechStack(e.target.value)} className="mt-1 block w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]" /></div>
      <div><label className="mb-1 block text-sm font-medium text-[var(--foreground)]">Full Description</label><TiptapEditor value={fullDescription} onChange={setFullDescription} placeholder="Describe the service..." minHeight="280px" /></div>
      <label className="flex items-center gap-2 text-sm text-[var(--foreground)]"><input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} className="rounded border-[var(--border)]" /> Published</label>
      <button type="submit" disabled={saving} className="rounded-lg bg-[var(--accent)] px-6 py-2.5 text-sm font-medium text-[var(--accent-foreground)] hover:bg-[var(--accent-hover)] disabled:opacity-50">{saving ? "Saving..." : service ? "Update Service" : "Create Service"}</button>
    </form>
  );
}
