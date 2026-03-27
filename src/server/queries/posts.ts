import { db } from "@/lib/db";
import { unstable_cache } from "next/cache";

export const getPublishedPosts = unstable_cache(
  async (options?: { page?: number; limit?: number; categorySlug?: string }) => {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 12;
    const skip = (page - 1) * limit;

    const where = {
      published: true,
      ...(options?.categorySlug
        ? { category: { slug: options.categorySlug } }
        : {}),
    };

    const [posts, total] = await Promise.all([
      db.post.findMany({
        where,
        include: {
          author: { select: { id: true, name: true, avatar: true } },
          category: { select: { id: true, slug: true, name: true } },
        },
        orderBy: { publishedAt: "desc" },
        skip,
        take: limit,
      }),
      db.post.count({ where }),
    ]);

    return { posts, total, pages: Math.ceil(total / limit) };
  },
  ["published-posts"],
  { tags: ["posts"], revalidate: 300 }
);

export const getPostBySlug = unstable_cache(
  async (slug: string) => {
    return db.post.findUnique({
      where: { slug, published: true },
      include: {
        author: {
          select: { id: true, name: true, avatar: true, bio: true, socialLinks: true },
        },
        category: true,
        tags: true,
      },
    });
  },
  ["post-by-slug"],
  { tags: ["posts"], revalidate: 300 }
);

export const getFeaturedPosts = unstable_cache(
  async (limit = 3) => {
    return db.post.findMany({
      where: { published: true, featured: true },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        category: { select: { id: true, slug: true, name: true } },
      },
      orderBy: { publishedAt: "desc" },
      take: limit,
    });
  },
  ["featured-posts"],
  { tags: ["posts"], revalidate: 300 }
);
