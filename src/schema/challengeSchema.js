import { z } from "zod";

const challengeSchema = z.object({
  challengeOwner: z.string(),
  challengeName: z.string().min(3),
  description: z.string(),
  tags: z.array(z.string()),
  days: z.number(),
});

export default challengeSchema;
