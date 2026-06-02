import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "invalid email address" }),
  password: z.string().min(1, "Password cannot be empty"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
