import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(12, "Password must be at least 12 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
