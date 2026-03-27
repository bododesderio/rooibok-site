import { db } from "@/lib/db";
import { unstable_cache } from "next/cache";

export const getPublishedServices = unstable_cache(
  async () => {
    return db.service.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
  },
  ["published-services"],
  { tags: ["services"], revalidate: 3600 }
);

export const getServiceBySlug = unstable_cache(
  async (slug: string) => {
    return db.service.findUnique({
      where: { slug, published: true },
      include: { projects: { where: { published: true }, take: 3 } },
    });
  },
  ["service-by-slug"],
  { tags: ["services"], revalidate: 3600 }
);
