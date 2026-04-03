"use server";

import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";
import { revalidateTag } from "next/cache";

export async function createMedia(data: {
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  alt?: string;
}) {
  await requireAdmin();

  const media = await db.media.create({ data });
  revalidateTag("media");
  return media;
}

export async function deleteMedia(id: string) {
  await requireAdmin();
  await db.media.delete({ where: { id } });
  revalidateTag("media");
}
