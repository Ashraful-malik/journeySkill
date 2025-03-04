import { z } from "zod";

export const postSchema = z
  .object({
    challengeId: z.string().nonempty("Please select a challenge"),
    text: z
      .string()
      .min(10, "Post must be at least 10 characters long")
      .optional()
      .or(z.literal("")),
    link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    isPublic: z.boolean(),
    imageUrl: z
      .string()
      .url("Must be a valid URL")
      .optional()
      .or(z.literal("")),
  })
  .refine(
    (data) => data.text?.trim() || data.link?.trim() || data.imageUrl?.trim(),
    {
      message: "At least one of Text, Image, or Link is required.",
      path: ["text"], // The field to display the error message
    }
  );
