import { z } from "zod";

export const applicationSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(200),
  email: z.string().email("Please enter a valid email address").max(320),
  phone: z.string().min(5, "Please enter a valid phone number").max(30),
  coverLetter: z.string().max(5000).optional(),
  portfolioUrl: z.string().url("Please enter a valid URL").max(500).optional().or(z.literal("")),
  linkedinUrl: z.string().url("Please enter a valid URL").max(500).optional().or(z.literal("")),
  referralSource: z.string().max(200).optional(),
  notes: z.string().max(2000).optional(),
  honeypot: z.string().max(0).optional(),
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;
