import { db } from "@/lib/db";
import { unstable_cache } from "next/cache";

export const getMilestones = unstable_cache(
  async () => {
    return db.milestone.findMany({
      orderBy: { date: "asc" },
    });
  },
  ["milestones"],
  { tags: ["milestones"], revalidate: 3600 }
);
