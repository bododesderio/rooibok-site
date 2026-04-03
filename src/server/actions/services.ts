"use server";

import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function createService(data: {
  name: string;
  slug: string;
  icon: string;
  shortDescription: string;
  fullDescription: unknown;
  techStack: string[];
  order?: number;
  published?: boolean;
}) {
  await requireAdmin();

  await db.service.create({
    data: {
      name: data.name,
      slug: data.slug,
      icon: data.icon,
      shortDescription: data.shortDescription,
      fullDescription: (data.fullDescription as object) ?? {
        type: "doc",
        content: [],
      },
      techStack: data.techStack,
      order: data.order ?? 0,
      published: data.published ?? true,
    },
  });

  revalidateTag("services");
  redirect("/admin/services");
}

export async function updateService(
  id: string,
  data: {
    name: string;
    slug: string;
    icon: string;
    shortDescription: string;
    fullDescription: unknown;
    techStack: string[];
    order?: number;
    published?: boolean;
  }
) {
  await requireAdmin();

  await db.service.update({
    where: { id },
    data: {
      name: data.name,
      slug: data.slug,
      icon: data.icon,
      shortDescription: data.shortDescription,
      fullDescription: (data.fullDescription as object) ?? {
        type: "doc",
        content: [],
      },
      techStack: data.techStack,
      order: data.order ?? 0,
      published: data.published ?? true,
    },
  });

  revalidateTag("services");
  redirect("/admin/services");
}

export async function deleteService(id: string) {
  await requireAdmin();
  await db.service.delete({ where: { id } });
  revalidateTag("services");
}
