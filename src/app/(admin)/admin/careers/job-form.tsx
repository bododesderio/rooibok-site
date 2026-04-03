"use client";
import { useState } from "react";
import { createJob, updateJob } from "@/server/actions/careers";

type Props = { job?: { id: string; title: string; slug: string; department: string; location: string; type: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP"; shortDescription: string; description: unknown; salaryMin: number | null; salaryMax: number | null; salaryCurrency: string | null; published: boolean } };

export function JobForm({ job }: Props) {
  const [title, setTitle] = useState(job?.title ?? "");
  const [slug, setSlug] = useState(job?.slug ?? "");
  const [department, setDepartment] = useState(job?.department ?? "");
  const [location, setLocation] = useState(job?.location ?? "");
  const [type, setType] = useState(job?.type ?? "FULL_TIME");
  const [shortDescription, setShortDescription] = useState(job?.shortDescription ?? "");
  const [description, setDescription] = useState(job?.description ? JSON.stringify(job.description, null, 2) : '{"type":"doc","content":[]}');
  const [salaryMin, setSalaryMin] = useState(job?.salaryMin ?? "");
  const [salaryMax, setSalaryMax] = useState(job?.salaryMax ?? "");
  const [published, setPublished] = useState(job?.published ?? false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError(""); setSaving(true);
    try {
      const data = { title, slug, department, location, type: type as "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP", shortDescription, description: JSON.parse(description), salaryMin: salaryMin ? Number(salaryMin) : undefined, salaryMax: salaryMax ? Number(salaryMax) : undefined, published };
      if (job) await updateJob(job.id, data); else await createJob(data);
    } catch (err) { setError(String(err)); setSaving(false); }
  }

  const inputClass = "mt-1 block w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]";

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      {error && <div className="rounded-lg border border-[var(--destructive)]/20 bg-[var(--destructive)]/5 p-3 text-sm text-[var(--destructive)]">{error}</div>}
      <div><label className="block text-sm font-medium text-[var(--foreground)]">Title</label><input type="text" value={title} onChange={e => { setTitle(e.target.value); if (!job) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")); }} required className={inputClass} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium text-[var(--foreground)]">Slug</label><input type="text" value={slug} onChange={e => setSlug(e.target.value)} required className={inputClass} /></div>
        <div><label className="block text-sm font-medium text-[var(--foreground)]">Department</label><input type="text" value={department} onChange={e => setDepartment(e.target.value)} required className={inputClass} /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium text-[var(--foreground)]">Location</label><input type="text" value={location} onChange={e => setLocation(e.target.value)} required className={inputClass} /></div>
        <div><label className="block text-sm font-medium text-[var(--foreground)]">Type</label><select value={type} onChange={e => setType(e.target.value as typeof type)} className={inputClass}><option value="FULL_TIME">Full Time</option><option value="PART_TIME">Part Time</option><option value="CONTRACT">Contract</option><option value="INTERNSHIP">Internship</option></select></div>
      </div>
      <div><label className="block text-sm font-medium text-[var(--foreground)]">Short Description</label><textarea value={shortDescription} onChange={e => setShortDescription(e.target.value)} required rows={2} className={inputClass} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium text-[var(--foreground)]">Salary Min</label><input type="number" value={salaryMin} onChange={e => setSalaryMin(e.target.value)} className={inputClass} /></div>
        <div><label className="block text-sm font-medium text-[var(--foreground)]">Salary Max</label><input type="number" value={salaryMax} onChange={e => setSalaryMax(e.target.value)} className={inputClass} /></div>
      </div>
      <div><label className="block text-sm font-medium text-[var(--foreground)]">Description (Tiptap JSON)</label><textarea value={description} onChange={e => setDescription(e.target.value)} rows={8} className={"mt-1 block w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 font-mono text-xs text-[var(--foreground)] focus:border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"} /></div>
      <label className="flex items-center gap-2 text-sm text-[var(--foreground)]"><input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} className="rounded border-[var(--border)]" /> Published</label>
      <button type="submit" disabled={saving} className="rounded-lg bg-[var(--accent)] px-6 py-2.5 text-sm font-medium text-[var(--accent-foreground)] hover:bg-[var(--accent-hover)] disabled:opacity-50">{saving ? "Saving..." : job ? "Update Job" : "Create Job"}</button>
    </form>
  );
}
