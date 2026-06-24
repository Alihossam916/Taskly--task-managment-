"use server";
import { apiClient } from "../client";
import { Task } from "@/src/types/projectType";

export async function getAllTasksApi(
  projectId: string,
  limit: number,
  offset: number,
): Promise<{ tasks: Task[]; total: number } | null> {
  try {
    const response = await apiClient("/rest/v1/project_tasks", {
      params: {
        project_id: `eq.${projectId}`,
        limit: String(limit),
        offset: String(offset),
      },
      headers: {
        Prefer: "count=exact",
      },
    });
    if (response.ok) {
      const tasks: Task[] = await response.json();
      const total =
        Number(response.headers.get("content-range")?.split("/")[1]) || 0;
      return { tasks, total };
    }
    return null;
  } catch {
    return null;
  }
}
