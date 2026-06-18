// addEpicSchema.ts
import * as z from "zod";

export const addTaskSchema = z
  .object({
    title: z.string().min(3, "Title is required (minimum 3 characters)"),
    status: z.string(),
    assignee_id: z.string().optional().nullable(),
    epic_id: z.string().nullable(),
    due_date: z.string().nullable(),
    description: z
      .string()
      .max(500, "Description must be at most 500 characters")
      .nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.due_date) {
      const selected = new Date(data.due_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Due date cannot be in the past",
          path: ["due_date"],
        });
      }
    }
  });

export type AddTaskFormData = z.infer<typeof addTaskSchema>;
