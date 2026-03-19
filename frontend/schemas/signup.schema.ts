import * as z from "zod";

export const SignupSchema = z
  .object({
    userName: z.string().min(1, "first name is required"),
    email: z.email(),
    password: z.string().min(5, "password is required"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password don't match",
    path: ["confirmPassword"]
  });

export type SignupSchemaValues = z.infer<typeof SignupSchema>;
