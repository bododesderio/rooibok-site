import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/admin/status-badge";
import { Plus } from "lucide-react";
import { DeleteButton, TogglePublishButton } from "./actions-client";

export default async function AdminBlogPage() {
  const posts = await db.post.findMany({
    include: {
      author: { select: { name: true } },
      category: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const categories = await db.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Blog Posts</h1>
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            {posts.length} post{posts.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-foreground)] transition-colors hover:bg-[var(--accent-hover)]"
        >
          <Plus className="h-4 w-4" />
          New Post
        </Link>
      </div>

      {/* Categories */}
      <div className="mt-6 flex flex-wrap gap-2">
        <span className="text-sm text-[var(--foreground-muted)]">Categories:</span>
        {categories.map((cat) => (
          <span
            key={cat.id}
            className="rounded-full bg-[var(--surface)] px-3 py-0.5 text-xs text-[var(--foreground-muted)]"
          >
            {cat.name}
          </span>
        ))}
      </div>

      {/* Posts table */}
      <div className="mt-6 overflow-x-auto rounded-xl border border-[var(--border)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--surface)]">
              <th className="px-4 py-3 text-left font-medium text-[var(--foreground-muted)]">
                Title
              </th>
              <th className="px-4 py-3 text-left font-medium text-[var(--foreground-muted)]">
                Category
              </th>
              <th className="px-4 py-3 text-left font-medium text-[var(--foreground-muted)]">
                Author
              </th>
              <th className="px-4 py-3 text-left font-medium text-[var(--foreground-muted)]">
                Status
              </th>
              <th className="px-4 py-3 text-left font-medium text-[var(--foreground-muted)]">
                Date
              </th>
              <th className="px-4 py-3 text-right font-medium text-[var(--foreground-muted)]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-[var(--surface)]/50">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/blog/${post.id}/edit`}
                    className="font-medium text-[var(--foreground)] hover:text-[var(--accent)]"
                  >
                    {post.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-[var(--foreground-muted)]">
                  {post.category?.name ?? "—"}
                </td>
                <td className="px-4 py-3 text-[var(--foreground-muted)]">
                  {post.author.name}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={post.published ? "published" : "draft"} />
                </td>
                <td className="px-4 py-3 text-[var(--foreground-muted)]">
                  {formatDate(post.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <TogglePublishButton id={post.id} published={post.published} />
                    <Link
                      href={`/admin/blog/${post.id}/edit`}
                      className="rounded-lg px-3 py-1 text-xs font-medium text-[var(--foreground-muted)] transition-colors hover:bg-[var(--surface)]"
                    >
                      Edit
                    </Link>
                    <DeleteButton id={post.id} name={post.title} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
