import { z } from "zod";

const verificationSchema = z.object({
  userId: z.string(),
  verificationCode: z.number(),
  verificationExpires: z.date(),
});

export default verificationSchema;
