"use client";
import { useState } from "react";
import { createTeamMember, updateTeamMember } from "@/server/actions/team";

type Props = { member?: { id: string; name: string; role: string; bio: string | null; photo: string | null; order: number; published: boolean } };

export function TeamForm({ member }: Props) {
  const [name, setName] = useState(member?.name ?? "");
  const [role, setRole] = useState(member?.role ?? "");
  const [bio, setBio] = useState(member?.bio ?? "");
  const [photo, setPhoto] = useState(member?.photo ?? "");
  const [order, setOrder] = useState(member?.order ?? 0);
  const [published, setPublished] = useState(member?.published ?? true);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    const data = { name, role, bio: bio || undefined, photo: photo || undefined, order, published };
    if (member) await updateTeamMember(member.id, data);
    else await createTeamMember(data);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <div><label className="block text-sm font-medium text-[var(--foreground)]">Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]" /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium text-[var(--foreground)]">Role</label><input type="text" value={role} onChange={e => setRole(e.target.value)} required className="mt-1 block w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]" /></div>
        <div><label className="block text-sm font-medium text-[var(--foreground)]">Photo URL</label><input type="text" value={photo} onChange={e => setPhoto(e.target.value)} className="mt-1 block w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]" /></div>
      </div>
      <div><label className="block text-sm font-medium text-[var(--foreground)]">Bio</label><textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} className="mt-1 block w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]" /></div>
      <div><label className="block text-sm font-medium text-[var(--foreground)]">Order</label><input type="number" value={order} onChange={e => setOrder(Number(e.target.value))} className="mt-1 block w-40 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]" /></div>
      <label className="flex items-center gap-2 text-sm text-[var(--foreground)]"><input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} className="rounded border-[var(--border)]" /> Published</label>
      <button type="submit" disabled={saving} className="rounded-lg bg-[var(--accent)] px-6 py-2.5 text-sm font-medium text-[var(--accent-foreground)] hover:bg-[var(--accent-hover)] disabled:opacity-50">{saving ? "Saving..." : member ? "Update Member" : "Add Member"}</button>
    </form>
  );
}
