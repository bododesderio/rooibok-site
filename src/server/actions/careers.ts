"use server";

import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import type { ApplicationStatus } from "@prisma/client";

export async function createJob(data: {
  title: string;
  slug: string;
  department: string;
  location: string;
  type: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
  shortDescription: string;
  description: unknown;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  published?: boolean;
}) {
  await requireAdmin();

  await db.job.create({
    data: {
      title: data.title,
      slug: data.slug,
      department: data.department,
      location: data.location,
      type: data.type,
      shortDescription: data.shortDescription,
      description: (data.description as object) ?? { type: "doc", content: [] },
      salaryMin: data.salaryMin || null,
      salaryMax: data.salaryMax || null,
      salaryCurrency: data.salaryCurrency || "UGX",
      published: data.published ?? false,
      publishedAt: data.published ? new Date() : null,
    },
  });

  revalidateTag("jobs");
  redirect("/admin/careers");
}

export async function updateJob(
  id: string,
  data: {
    title: string;
    slug: string;
    department: string;
    location: string;
    type: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
    shortDescription: string;
    description: unknown;
    salaryMin?: number;
    salaryMax?: number;
    salaryCurrency?: string;
    published?: boolean;
  }
) {
  await requireAdmin();

  await db.job.update({
    where: { id },
    data: {
      title: data.title,
      slug: data.slug,
      department: data.department,
      location: data.location,
      type: data.type,
      shortDescription: data.shortDescription,
      description: (data.description as object) ?? { type: "doc", content: [] },
      salaryMin: data.salaryMin || null,
      salaryMax: data.salaryMax || null,
      salaryCurrency: data.salaryCurrency || "UGX",
      published: data.published ?? false,
    },
  });

  revalidateTag("jobs");
  redirect("/admin/careers");
}

export async function deleteJob(id: string) {
  await requireAdmin();
  await db.job.delete({ where: { id } });
  revalidateTag("jobs");
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus
) {
  await requireAdmin();
  await db.application.update({ where: { id }, data: { status } });
  revalidateTag("applications");
}
