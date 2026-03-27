import { db } from "@/lib/db";
import { unstable_cache } from "next/cache";

/**
 * Get all active popups that match the given route.
 * Checks: active, within date range, matches page pattern.
 */
export const getActivePopups = unstable_cache(
  async (route: string) => {
    const now = new Date();

    const popups = await db.popup.findMany({
      where: {
        active: true,
        OR: [{ startDate: null }, { startDate: { lte: now } }],
        AND: [
          { OR: [{ endDate: null }, { endDate: { gte: now } }] },
        ],
      },
      orderBy: { order: "asc" },
    });

    // Filter by page patterns
    return popups.filter((popup) => {
      if (popup.pages.length === 0 || popup.pages.includes("*")) return true;
      return popup.pages.some((pattern) => {
        if (pattern === route) return true;
        // Simple wildcard matching: /blog/* matches /blog/anything
        if (pattern.endsWith("/*")) {
          const prefix = pattern.slice(0, -2);
          return route.startsWith(prefix);
        }
        return false;
      });
    });
  },
  ["active-popups"],
  { tags: ["popups"], revalidate: 300 }
);
