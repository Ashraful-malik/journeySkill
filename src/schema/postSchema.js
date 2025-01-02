import { z } from "zod";

export const postSchema = z.object({
  text: z.string().min(10, "Post must be at least 10 characters long"),
  selectChallenge: z.string().min(1, "You must select a challenge."),
  url: z.optional(z.string()),
  isPublic: z.boolean(),
  image: z.string().optional(),
});
// challengeId: z.string().uuid().optional(),
