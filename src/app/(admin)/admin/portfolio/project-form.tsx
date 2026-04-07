"use client";

import { useState } from "react";
import { createProject, updateProject } from "@/server/actions/portfolio";
import { TiptapEditor } from "@/components/admin/tiptap-editor";

const EMPTY_DOC = { type: "doc", content: [{ type: "paragraph" }] };

type ProjectFormProps = {
  project?: {
    id: string;
    title: string;
    slug: string;
    client: string | null;
    shortDescription: string;
    description: unknown;
    coverImage: string;
    techStack: string[];
    published: boolean;
    featured: boolean;
  };
};

export function ProjectForm({ project }: ProjectFormProps) {
  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [client, setClient] = useState(project?.client ?? "");
  const [shortDescription, setShortDescription] = useState(project?.shortDescription ?? "");
  const [description, setDescription] = useState<unknown>(project?.description ?? EMPTY_DOC);
  const [coverImage, setCoverImage] = useState(project?.coverImage ?? "");
  const [techStack, setTechStack] = useState(project?.techStack.join(", ") ?? "");
  const [published, setPublished] = useState(project?.published ?? false);
  const [featured, setFeatured] = useState(project?.featured ?? false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!project) {
      setSlug(value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const data = {
        title, slug, client: client || undefined, shortDescription,
        description, coverImage: coverImage || "/images/placeholder-project.jpg",
        techStack: techStack.split(",").map((s) => s.trim()).filter(Boolean),
        published, featured,
      };
      if (project) { await updateProject(project.id, data); }
      else { await createProject(data); }
    } catch (err) {
      setError(String(err));
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      {error && <div className="rounded-lg border border-[var(--destructive)]/20 bg-[var(--destructive)]/5 p-3 text-sm text-[var(--destructive)]">{error}</div>}
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)]">Title</label>
        <input type="text" value={title} onChange={(e) => handleTitleChange(e.target.value)} required className="mt-1 block w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]" />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)]">Slug</label>
        <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} required className="mt-1 block w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)]">Client</label>
          <input type="text" value={client} onChange={(e) => setClient(e.target.value)} className="mt-1 block w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)]">Cover Image URL</label>
          <input type="text" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} className="mt-1 block w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)]">Short Description</label>
        <textarea value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} required rows={2} className="mt-1 block w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]" />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)]">Tech Stack (comma-separated)</label>
        <input type="text" value={techStack} onChange={(e) => setTechStack(e.target.value)} className="mt-1 block w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">Description</label>
        <TiptapEditor value={description} onChange={setDescription} placeholder="Describe the project..." minHeight="280px" />
      </div>
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-[var(--foreground)]">
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="rounded border-[var(--border)]" /> Published
        </label>
        <label className="flex items-center gap-2 text-sm text-[var(--foreground)]">
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="rounded border-[var(--border)]" /> Featured
        </label>
      </div>
      <button type="submit" disabled={saving} className="rounded-lg bg-[var(--accent)] px-6 py-2.5 text-sm font-medium text-[var(--accent-foreground)] hover:bg-[var(--accent-hover)] disabled:opacity-50">
        {saving ? "Saving..." : project ? "Update Project" : "Create Project"}
      </button>
    </form>
  );
}
