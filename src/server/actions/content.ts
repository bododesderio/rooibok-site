"use server";

import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";
import { revalidateTag } from "next/cache";
import type { ContentBlockType } from "@prisma/client";

export async function updateContentBlock(data: {
  key: string;
  content: unknown;
  type?: ContentBlockType;
}) {
  await requireAdmin();

  await db.contentBlock.upsert({
    where: { key: data.key },
    update: { content: data.content as object },
    create: {
      key: data.key,
      content: data.content as object,
      type: data.type ?? "TEXT",
    },
  });

  revalidateTag("content");
  return { success: true };
}

export async function deleteContentBlock(key: string) {
  await requireAdmin();

  await db.contentBlock.delete({ where: { key } });
  revalidateTag("content");
  return { success: true };
}
