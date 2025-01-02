import { z } from "zod";

export const editProfileSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters.")
    .max(20, "Username must be at most 20 characters.")
    .optional()
    .or(z.literal("").transform(() => undefined)), // Allows empty strings

  name: z
    .string()
    .min(3, "Name must be at least 3 characters.")
    .max(20, "Name must be at most 20 characters.")
    .optional()
    .or(z.literal("").transform(() => undefined)),

  bio: z
    .string()
    .min(3, "Bio must be at least 3 characters.")
    .max(100, "Bio must be at most 100 characters.")
    .optional()
    .or(z.literal("").transform(() => undefined)),

  location: z
    .string()
    .optional()
    .or(z.literal("").transform(() => undefined)),

  dob: z.preprocess(
    (value) =>
      typeof value === "string" && value ? new Date(value) : undefined,
    z.date().optional()
  ),
});
