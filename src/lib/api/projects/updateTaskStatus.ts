"use server";
import { apiClient } from "../client";

export async function updateTaskStatusApi(
  taskId: string,
  status: string,
): Promise<boolean> {
  try {
    const response = await apiClient(`/rest/v1/tasks?id=eq.${taskId}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    return response.ok;
  } catch {
    return false;
  }
}
