"use server";

import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function createTeamMember(data: {
  name: string;
  role: string;
  bio?: string;
  photo?: string;
  order?: number;
  published?: boolean;
}) {
  await requireAdmin();

  await db.teamMember.create({
    data: {
      name: data.name,
      role: data.role,
      bio: data.bio || null,
      photo: data.photo || null,
      order: data.order ?? 0,
      published: data.published ?? true,
    },
  });

  revalidateTag("team");
  redirect("/admin/team");
}

export async function updateTeamMember(
  id: string,
  data: {
    name: string;
    role: string;
    bio?: string;
    photo?: string;
    order?: number;
    published?: boolean;
  }
) {
  await requireAdmin();

  await db.teamMember.update({
    where: { id },
    data: {
      name: data.name,
      role: data.role,
      bio: data.bio || null,
      photo: data.photo || null,
      order: data.order ?? 0,
      published: data.published ?? true,
    },
  });

  revalidateTag("team");
  redirect("/admin/team");
}

export async function deleteTeamMember(id: string) {
  await requireAdmin();
  await db.teamMember.delete({ where: { id } });
  revalidateTag("team");
}
