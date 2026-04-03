import { db } from "@/lib/db";
import { PostForm } from "../post-form";

export default async function NewPostPage() {
  const categories = await db.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--foreground)]">New Post</h1>
      <div className="mt-6">
        <PostForm categories={categories} />
      </div>
    </div>
  );
}
