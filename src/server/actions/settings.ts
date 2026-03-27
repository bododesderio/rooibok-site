"use server";

import { db } from "@/lib/db";
import { revalidateTag } from "next/cache";
import type { Prisma } from "@prisma/client";

export async function updateSiteSettings(data: {
  companyName?: string;
  tagline?: string;
  email?: string;
  phone?: string;
  address?: string;
  socialLinks?: Prisma.InputJsonValue;
  seoDefaults?: Prisma.InputJsonValue;
  footerConfig?: Prisma.InputJsonValue;
  navConfig?: Prisma.InputJsonValue;
}) {
  await db.siteSettings.upsert({
    where: { id: "default" },
    update: data,
    create: { id: "default", ...data },
  });

  revalidateTag("settings");
  return { success: true };
}
