import { z } from "zod";

export const postSchema = z.object({
  owner: z.string(),
  challengeId: z.string().optional(),
  text: z.string(),
  image: z.string().optional(),
});
