"use server";

import { db } from "@/lib/db";
import { saveFile } from "@/lib/storage";
import { applicationSchema } from "@/lib/validations/application";
import { revalidateTag } from "next/cache";

const ALLOWED_RESUME_EXTENSIONS = ["pdf", "doc", "docx"];
const MAX_RESUME_BYTES = 5 * 1024 * 1024; // 5MB

export async function submitApplication(
  jobId: string,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    // Verify job exists and is open
    const job = await db.job.findUnique({ where: { id: jobId } });
    if (!job || !job.published || job.closedAt) {
      return { success: false, error: "This position is no longer accepting applications." };
    }

    // Validate text fields
    const parsed = applicationSchema.safeParse({
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      coverLetter: formData.get("coverLetter") || undefined,
      portfolioUrl: formData.get("portfolioUrl") || undefined,
      linkedinUrl: formData.get("linkedinUrl") || undefined,
      referralSource: formData.get("referralSource") || undefined,
      honeypot: formData.get("honeypot") || undefined,
    });

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
    }

    // Honeypot — silently succeed
    if (parsed.data.honeypot) {
      return { success: true };
    }

    // Handle resume upload
    const resume = formData.get("resume");
    if (!(resume instanceof File) || resume.size === 0) {
      return { success: false, error: "Resume is required" };
    }

    const buffer = Buffer.from(await resume.arrayBuffer());
    let saved;
    try {
      saved = await saveFile({
        folder: "resumes",
        originalName: resume.name,
        buffer,
        allowedExtensions: ALLOWED_RESUME_EXTENSIONS,
        maxBytes: MAX_RESUME_BYTES,
      });
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Upload failed" };
    }

    await db.application.create({
      data: {
        jobId,
        fullName: parsed.data.fullName,
        email: parsed.data.email,
        phone: parsed.data.phone,
        resumeUrl: saved.url,
        coverLetter: parsed.data.coverLetter || null,
        portfolioUrl: parsed.data.portfolioUrl || null,
        linkedinUrl: parsed.data.linkedinUrl || null,
        referralSource: parsed.data.referralSource || null,
      },
    });

    revalidateTag("applications");
    return { success: true };
  } catch (err) {
    console.error("submitApplication error:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
