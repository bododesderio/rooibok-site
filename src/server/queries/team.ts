import { db } from "@/lib/db";
import { unstable_cache } from "next/cache";

export const getTeamMembers = unstable_cache(
  async () => {
    return db.teamMember.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
  },
  ["team-members"],
  { tags: ["team"], revalidate: 3600 }
);
