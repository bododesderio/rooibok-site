"use client";

import { useRouter } from "next/navigation";
import { deletePost, togglePostPublish } from "@/server/actions/blog";

export function DeleteButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await deletePost(id);
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      className="rounded-lg px-3 py-1 text-xs font-medium text-[var(--destructive)] transition-colors hover:bg-[var(--destructive)]/10"
    >
      Delete
    </button>
  );
}

export function TogglePublishButton({
  id,
  published,
}: {
  id: string;
  published: boolean;
}) {
  const router = useRouter();

  async function handleToggle() {
    await togglePostPublish(id);
    router.refresh();
  }

  return (
    <button
      onClick={handleToggle}
      className="rounded-lg px-3 py-1 text-xs font-medium text-[var(--foreground-muted)] transition-colors hover:bg-[var(--surface)]"
    >
      {published ? "Unpublish" : "Publish"}
    </button>
  );
}
