import { z } from "zod";

export const newsLetterSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .regex(/^\S+@\S+$/i, "Invalid email address"),
});
