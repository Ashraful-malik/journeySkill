import { z } from "zod";
import usernameSchema from "./usernameSchema";

const userSchema = z.object({
  fullName: z.string(),
  username: usernameSchema,
  email: z.string().email({ message: "invalid email address" }),
  password: z
    .string()
    .min(8, { message: "password must be at least 6 characters" }),
});

export default userSchema;
