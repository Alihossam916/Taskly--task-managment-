import * as z from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "invalid email address" }),
});

export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
