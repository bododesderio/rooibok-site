"use server";

import { db } from "@/lib/db";
import { contactSchema } from "@/lib/validations/contact";
import { revalidateTag } from "next/cache";

export async function submitInquiry(formData: FormData) {
  const raw = {
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    service: formData.get("service"),
    budget: formData.get("budget"),
    message: formData.get("message"),
    honeypot: formData.get("honeypot"),
  };

  const parsed = contactSchema.safeParse(raw);

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  // Honeypot check
  if (parsed.data.honeypot) {
    // Silently reject spam
    return { success: true };
  }

  await db.inquiry.create({
    data: {
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      service: parsed.data.service || null,
      budget: parsed.data.budget || null,
      message: parsed.data.message,
    },
  });

  revalidateTag("inquiries");

  // TODO: Send notification email to admin once email provider is configured

  return { success: true };
}
