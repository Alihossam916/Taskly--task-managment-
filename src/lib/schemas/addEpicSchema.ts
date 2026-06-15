// addEpicSchema.ts
import * as z from "zod";

export const addEpicSchema = z
  .object({
    title: z.string().min(3, "Title is required (minimum 3 characters)"),
    description: z
      .string()
      .max(500, "Description must be at most 500 characters")
      .nullable(),
    assignee_id: z.string().optional().nullable(),
    deadline: z.string().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.deadline) {
      const selected = new Date(data.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Deadline cannot be in the past",
          path: ["deadline"],
        });
      }
    }
  });

export type AddEpicFormData = z.infer<typeof addEpicSchema>;
