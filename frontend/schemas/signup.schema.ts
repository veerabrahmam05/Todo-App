import * as z from "zod";

export const SignupSchema = z.object({
  firstName: z.string().min(1, "first name is required"),
  lastName: z.string().min(1, "first name is required"),
  email: z.email().min(5),
  password: z.string().min(5, "password is required"),
  confirPassword: z.string().min(5, "confirm your password"),
});

export type SignupSchemaValues = z.infer<typeof SignupSchema>;
