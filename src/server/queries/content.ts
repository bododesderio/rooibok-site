import { db } from "@/lib/db";
import { unstable_cache } from "next/cache";

/**
 * Get a single content block by key.
 * Returns the content value, or a fallback if not found.
 */
export async function getContentBlock(
  key: string,
  fallback: string = ""
): Promise<string> {
  const block = await getCachedContentBlock(key);
  if (!block) return fallback;

  // TEXT type stores a simple string in JSON
  if (typeof block.content === "string") return block.content;
  // For JSON-wrapped strings
  if (
    typeof block.content === "object" &&
    block.content !== null &&
    "value" in (block.content as Record<string, unknown>)
  ) {
    return String((block.content as Record<string, unknown>).value);
  }
  return JSON.stringify(block.content);
}

/**
 * Get raw content block (for rich text, images, groups).
 */
export async function getContentBlockRaw(key: string) {
  return getCachedContentBlock(key);
}

/**
 * Get all content blocks matching a prefix (e.g., "home.hero" returns
 * "home.hero.headline", "home.hero.subheadline", etc.)
 */
export async function getContentGroup(prefix: string) {
  return getCachedContentGroup(prefix);
}

// ─── Cached queries ─────────────────────────────────────────

const getCachedContentBlock = unstable_cache(
  async (key: string) => {
    return db.contentBlock.findUnique({ where: { key } });
  },
  ["content-block"],
  { tags: ["content"], revalidate: 3600 }
);

const getCachedContentGroup = unstable_cache(
  async (prefix: string) => {
    return db.contentBlock.findMany({
      where: { key: { startsWith: prefix } },
      orderBy: { order: "asc" },
    });
  },
  ["content-group"],
  { tags: ["content"], revalidate: 3600 }
);
