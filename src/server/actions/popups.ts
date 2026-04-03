"use server";

import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import type { PopupType, PopupTrigger, PopupFrequency } from "@prisma/client";

export async function createPopup(data: {
  name: string;
  title?: string;
  content: unknown;
  type: PopupType;
  trigger: PopupTrigger;
  delay?: number;
  scrollThreshold?: number;
  pages: string[];
  frequency: PopupFrequency;
  frequencyDays?: number;
  active?: boolean;
  ctaText?: string;
  ctaLink?: string;
}) {
  await requireAdmin();

  await db.popup.create({
    data: {
      name: data.name,
      title: data.title || null,
      content: (data.content as object) ?? { type: "doc", content: [] },
      type: data.type,
      trigger: data.trigger,
      delay: data.delay || null,
      scrollThreshold: data.scrollThreshold || null,
      pages: data.pages,
      frequency: data.frequency,
      frequencyDays: data.frequencyDays || null,
      active: data.active ?? false,
      ctaText: data.ctaText || null,
      ctaLink: data.ctaLink || null,
    },
  });

  revalidateTag("popups");
  redirect("/admin/popups");
}

export async function updatePopup(
  id: string,
  data: {
    name: string;
    title?: string;
    content: unknown;
    type: PopupType;
    trigger: PopupTrigger;
    delay?: number;
    scrollThreshold?: number;
    pages: string[];
    frequency: PopupFrequency;
    frequencyDays?: number;
    active?: boolean;
    ctaText?: string;
    ctaLink?: string;
  }
) {
  await requireAdmin();

  await db.popup.update({
    where: { id },
    data: {
      name: data.name,
      title: data.title || null,
      content: (data.content as object) ?? { type: "doc", content: [] },
      type: data.type,
      trigger: data.trigger,
      delay: data.delay || null,
      scrollThreshold: data.scrollThreshold || null,
      pages: data.pages,
      frequency: data.frequency,
      frequencyDays: data.frequencyDays || null,
      active: data.active ?? false,
      ctaText: data.ctaText || null,
      ctaLink: data.ctaLink || null,
    },
  });

  revalidateTag("popups");
  redirect("/admin/popups");
}

export async function deletePopup(id: string) {
  await requireAdmin();
  await db.popup.delete({ where: { id } });
  revalidateTag("popups");
}

export async function togglePopupActive(id: string) {
  await requireAdmin();
  const popup = await db.popup.findUnique({ where: { id } });
  if (!popup) return;
  await db.popup.update({
    where: { id },
    data: { active: !popup.active },
  });
  revalidateTag("popups");
}
