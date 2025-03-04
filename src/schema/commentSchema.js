import { z } from "zod";
export const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment must be at least 1 character long")
    .max(500, "Comment must be at most 500 characters long"),
  contentType: z.enum(["Post", "Challenge"]),
});
