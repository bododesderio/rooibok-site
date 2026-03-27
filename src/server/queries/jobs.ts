import { db } from "@/lib/db";
import { unstable_cache } from "next/cache";

export const getOpenJobs = unstable_cache(
  async () => {
    return db.job.findMany({
      where: { published: true, closedAt: null },
      orderBy: { publishedAt: "desc" },
    });
  },
  ["open-jobs"],
  { tags: ["jobs"], revalidate: 300 }
);

export const getJobBySlug = unstable_cache(
  async (slug: string) => {
    return db.job.findUnique({
      where: { slug, published: true },
    });
  },
  ["job-by-slug"],
  { tags: ["jobs"], revalidate: 300 }
);
