import * as z from "zod";

const nameRegex = /^(?!\s)(?!.*\s\s)[\p{L} ]+(?<!\s)$/u;

export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(3, "Username must be at least 3 characters ")
      .max(50, "Username must be at most 50 characters")
      .regex(
        nameRegex,
        "Name can only contain letters and single spaces between words (no numbers or special characters)",
      ),
    email: z.string().email({ message: "invalid email address" }),
    job: z.string().optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(64, "Password must be at least 64 characters")
      .refine((val) => !/\s/.test(val), "Password cannot contain spaces")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/~`';]/,
        "Password must contain at least one special character",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // attaches the error to the confirmPassword field in React Hook Form
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;
