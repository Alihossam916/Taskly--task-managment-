"use server";
import { apiClient } from "../client";
import { Task } from "@/src/types/projectType";

export async function getTaskDetails(task_id: string, projectId: string) {
  const res = await apiClient(
    `/rest/v1/project_tasks?project_id=eq.${projectId}&id=eq.${task_id}`,
  );
  if (!res.ok) return null;
  const task: Task[] = await res.json();
  return task[0];
}
