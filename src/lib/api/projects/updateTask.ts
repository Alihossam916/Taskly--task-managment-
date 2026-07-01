"use server";
import { UpdateTaskFormData } from "../../schemas/updateTaskSchema";
import { apiClient } from "../client";

export async function updateTaskApi(
  taskId: string,
  taskDetails: UpdateTaskFormData,
): Promise<boolean> {
  const { title, description, assignee_id, due_date, epic_id, status } =
    taskDetails;
  try {
    const response = await apiClient(`/rest/v1/tasks?id=eq.${taskId}`, {
      method: "PATCH",
      body: JSON.stringify({
        title: title,
        description: description || null,
        assignee_id: assignee_id === "unassigned" ? null : assignee_id,
        due_date: due_date || null,
        epic_id: epic_id || null,
        status: status,
      }),
    });
    return response.ok;
  } catch {
    return false;
  }
}
