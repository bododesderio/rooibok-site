"use server";

import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth-guard";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function createPost(data: {
  title: string;
  slug: string;
  excerpt?: string;
  content: unknown;
  coverImage?: string;
  categoryId?: string;
  readTime?: number;
  published?: boolean;
  featured?: boolean;
}) {
  const session = await requireAuth();
  const userId = (session.user as { id: string }).id;

  await db.post.create({
    data: {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt || null,
      content: (data.content as object) ?? { type: "doc", content: [] },
      coverImage: data.coverImage || null,
      categoryId: data.categoryId || null,
      authorId: userId,
      readTime: data.readTime || null,
      published: data.published ?? false,
      featured: data.featured ?? false,
      publishedAt: data.published ? new Date() : null,
    },
  });

  revalidateTag("posts");
  redirect("/admin/blog");
}

export async function updatePost(
  id: string,
  data: {
    title: string;
    slug: string;
    excerpt?: string;
    content: unknown;
    coverImage?: string;
    categoryId?: string;
    readTime?: number;
    published?: boolean;
    featured?: boolean;
  }
) {
  await requireAuth();

  const existing = await db.post.findUnique({ where: { id } });

  await db.post.update({
    where: { id },
    data: {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt || null,
      content: (data.content as object) ?? { type: "doc", content: [] },
      coverImage: data.coverImage || null,
      categoryId: data.categoryId || null,
      readTime: data.readTime || null,
      published: data.published ?? false,
      featured: data.featured ?? false,
      publishedAt:
        data.published && !existing?.published ? new Date() : existing?.publishedAt,
    },
  });

  revalidateTag("posts");
  redirect("/admin/blog");
}

export async function deletePost(id: string) {
  await requireAuth();
  await db.post.delete({ where: { id } });
  revalidateTag("posts");
}

export async function togglePostPublish(id: string) {
  await requireAuth();
  const post = await db.post.findUnique({ where: { id } });
  if (!post) return;

  await db.post.update({
    where: { id },
    data: {
      published: !post.published,
      publishedAt: !post.published ? new Date() : post.publishedAt,
    },
  });
  revalidateTag("posts");
}

export async function createCategory(data: { name: string; slug: string }) {
  await requireAuth();
  await db.category.create({ data });
  revalidateTag("posts");
}

export async function deleteCategory(id: string) {
  await requireAuth();
  await db.category.delete({ where: { id } });
  revalidateTag("posts");
}
