import { z } from "zod";

export const contactSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(200),
  email: z.string().email("Please enter a valid email address").max(320),
  phone: z.string().max(30).optional(),
  service: z.string().max(200).optional(),
  budget: z.string().max(100).optional(),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
  honeypot: z.string().max(0).optional(), // spam protection
});

export type ContactFormData = z.infer<typeof contactSchema>;
