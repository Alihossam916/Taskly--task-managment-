import * as z from "zod";

export const inviteMemberSchema = z.object({
  email: z.string().email({ message: "invalid email address" }),
});

export type InviteMemberFormData = z.infer<typeof inviteMemberSchema>;
