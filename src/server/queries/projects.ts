import { db } from "@/lib/db";
import { unstable_cache } from "next/cache";

export const getPublishedProjects = unstable_cache(
  async () => {
    return db.project.findMany({
      where: { published: true },
      include: { services: { select: { id: true, slug: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });
  },
  ["published-projects"],
  { tags: ["projects"], revalidate: 300 }
);

export const getProjectBySlug = unstable_cache(
  async (slug: string) => {
    return db.project.findUnique({
      where: { slug, published: true },
      include: { services: true },
    });
  },
  ["project-by-slug"],
  { tags: ["projects"], revalidate: 300 }
);

export const getFeaturedProjects = unstable_cache(
  async (limit = 3) => {
    return db.project.findMany({
      where: { published: true, featured: true },
      include: { services: { select: { id: true, slug: true, name: true } } },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  },
  ["featured-projects"],
  { tags: ["projects"], revalidate: 300 }
);
