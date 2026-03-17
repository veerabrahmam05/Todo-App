import * as z from "zod";

export const UserLoginSchema = z.object({
  username: z.string().min(5, "username must be atleast 5 characters"),
  password: z.string().min(1, "password is required"),
});

export type UserLoginSchemaValues = z.infer<typeof UserLoginSchema>
