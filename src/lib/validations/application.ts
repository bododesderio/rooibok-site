import { z } from "zod";

export const applicationSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(5, "Please enter a valid phone number"),
  coverLetter: z.string().optional(),
  portfolioUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  linkedinUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  referralSource: z.string().optional(),
  notes: z.string().optional(),
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;
