import { z } from "zod";

const challengeSchema = z.object({
  challengeName: z
    .string()
    .min(3, "Challenge name must be at least 3 characters long"),
  challengeDescription: z
    .string()
    .min(5, "Challenge description must be at least 5 characters long"),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean(),
  dateRange: z.object({
    from: z.date(),
    to: z.date(),
  }),
  days: z.number().min(5, "Days must be at least 5"),
  banner: z
    .object({
      imageUrl: z.string().url().optional(),
      ImagePublicId: z.string().optional(),
    })
    .optional(),
});

export default challengeSchema;
