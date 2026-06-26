"use server";
import { apiClient } from "../client";
import { Task } from "@/src/types/projectType";

export async function getAllTasksApi(
  projectId: string,
  limit: number,
  offset: number,
  searchTerm?: string,
  status?: string,
): Promise<{ tasks: Task[]; total: number } | null> {
  try {
    const params: Record<string, string> = {
      project_id: `eq.${projectId}`,
      limit: String(limit),
      offset: String(offset),
    };

    // load tasks by status
    if (status) {
      params.status = `eq.${status}`;
    }

    if (searchTerm && searchTerm.trim().length > 0) {
      params.title = `ilike.%${searchTerm}%`;
    }

    const response = await apiClient("/rest/v1/project_tasks", {
      params,
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
