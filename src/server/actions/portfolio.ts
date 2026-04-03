"use server";

import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth-guard";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function createProject(data: {
  title: string;
  slug: string;
  client?: string;
  shortDescription: string;
  description: unknown;
  coverImage: string;
  techStack: string[];
  published?: boolean;
  featured?: boolean;
}) {
  await requireAuth();

  await db.project.create({
    data: {
      title: data.title,
      slug: data.slug,
      client: data.client || null,
      shortDescription: data.shortDescription,
      description: (data.description as object) ?? { type: "doc", content: [] },
      coverImage: data.coverImage || "/images/placeholder-project.jpg",
      techStack: data.techStack,
      published: data.published ?? false,
      featured: data.featured ?? false,
    },
  });

  revalidateTag("projects");
  redirect("/admin/portfolio");
}

export async function updateProject(
  id: string,
  data: {
    title: string;
    slug: string;
    client?: string;
    shortDescription: string;
    description: unknown;
    coverImage: string;
    techStack: string[];
    published?: boolean;
    featured?: boolean;
  }
) {
  await requireAuth();

  await db.project.update({
    where: { id },
    data: {
      title: data.title,
      slug: data.slug,
      client: data.client || null,
      shortDescription: data.shortDescription,
      description: (data.description as object) ?? { type: "doc", content: [] },
      coverImage: data.coverImage,
      techStack: data.techStack,
      published: data.published ?? false,
      featured: data.featured ?? false,
    },
  });

  revalidateTag("projects");
  redirect("/admin/portfolio");
}

export async function deleteProject(id: string) {
  await requireAuth();
  await db.project.delete({ where: { id } });
  revalidateTag("projects");
}
