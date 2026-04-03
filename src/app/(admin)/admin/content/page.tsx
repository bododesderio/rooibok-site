"use client";

import { useState, useEffect } from "react";
import { updateContentBlock, deleteContentBlock } from "@/server/actions/content";

type ContentBlock = {
  id: string;
  key: string;
  content: unknown;
  type: string;
  order: number;
};

export default function AdminContentPage() {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [newKey, setNewKey] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newType, setNewType] = useState("TEXT");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/content-blocks")
      .then((r) => r.json())
      .then(setBlocks)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = blocks.filter((b) =>
    b.key.toLowerCase().includes(search.toLowerCase())
  );

  async function handleSave(key: string) {
    try {
      const parsed = JSON.parse(editValue);
      await updateContentBlock({ key, content: parsed });
      setBlocks((prev) =>
        prev.map((b) => (b.key === key ? { ...b, content: parsed } : b))
      );
      setEditing(null);
    } catch {
      alert("Invalid JSON");
    }
  }

  async function handleDelete(key: string) {
    if (!confirm(`Delete content block "${key}"?`)) return;
    await deleteContentBlock(key);
    setBlocks((prev) => prev.filter((b) => b.key !== key));
  }

  async function handleAdd() {
    if (!newKey.trim()) return;
    try {
      const parsed = JSON.parse(newContent || '{"value":""}');
      await updateContentBlock({
        key: newKey,
        content: parsed,
        type: newType as "TEXT" | "RICH_TEXT" | "IMAGE" | "LINK" | "GROUP",
      });
      setBlocks((prev) => [
        ...prev,
        { id: newKey, key: newKey, content: parsed, type: newType, order: 0 },
      ]);
      setNewKey("");
      setNewContent("");
    } catch {
      alert("Invalid JSON");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Content Blocks</h1>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by key..."
        className="mt-4 block w-full max-w-sm rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
      />

      {/* Add new */}
      <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <h2 className="text-sm font-semibold text-[var(--foreground)]">Add New Block</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          <input
            type="text"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            placeholder="Key (e.g. home.hero.title)"
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-sm text-[var(--foreground)] focus:border-[var(--ring)] focus:outline-none"
          />
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-sm text-[var(--foreground)]"
          >
            <option value="TEXT">TEXT</option>
            <option value="RICH_TEXT">RICH_TEXT</option>
            <option value="IMAGE">IMAGE</option>
            <option value="LINK">LINK</option>
            <option value="GROUP">GROUP</option>
          </select>
          <input
            type="text"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder='Content JSON (e.g. {"value":"Hello"})'
            className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-sm text-[var(--foreground)] focus:border-[var(--ring)] focus:outline-none"
          />
          <button
            onClick={handleAdd}
            className="rounded-lg bg-[var(--accent)] px-4 py-1.5 text-sm font-medium text-[var(--accent-foreground)] hover:bg-[var(--accent-hover)]"
          >
            Add
          </button>
        </div>
      </div>

      {/* Content blocks list */}
      <div className="mt-6 space-y-2">
        {loading ? (
          <p className="text-sm text-[var(--foreground-muted)]">Loading...</p>
        ) : (
          filtered.map((block) => (
            <div
              key={block.key}
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <code className="text-sm font-medium text-[var(--foreground)]">
                    {block.key}
                  </code>
                  <span className="ml-2 rounded-full bg-[var(--surface)] px-2 py-0.5 text-xs text-[var(--foreground-muted)]">
                    {block.type}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditing(block.key);
                      setEditValue(JSON.stringify(block.content, null, 2));
                    }}
                    className="text-xs text-[var(--accent)] hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(block.key)}
                    className="text-xs text-[var(--destructive)] hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {editing === block.key ? (
                <div className="mt-3">
                  <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    rows={5}
                    className="block w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 font-mono text-xs text-[var(--foreground)] focus:border-[var(--ring)] focus:outline-none"
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleSave(block.key)}
                      className="rounded-lg bg-[var(--accent)] px-3 py-1 text-xs font-medium text-[var(--accent-foreground)]"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="rounded-lg px-3 py-1 text-xs text-[var(--foreground-muted)] hover:bg-[var(--surface)]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <pre className="mt-2 max-h-20 overflow-hidden text-xs text-[var(--foreground-muted)]">
                  {JSON.stringify(block.content, null, 2)}
                </pre>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
