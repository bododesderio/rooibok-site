import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PostForm } from "../../post-form";

type Props = { params: Promise<{ id: string }> };

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const [post, categories] = await Promise.all([
    db.post.findUnique({ where: { id } }),
    db.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!post) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Edit Post</h1>
      <div className="mt-6">
        <PostForm categories={categories} post={post} />
      </div>
    </div>
  );
}
