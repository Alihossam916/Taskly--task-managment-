"use server";
import { getAccessToken } from "../../utils/cookies";
import { Task } from "@/src/types/projectType";

const baseUrl = process.env.SUPABASE_URL!;
const anonKey = process.env.SUPABASE_ANON_KEY!;

export async function getTasksByStatusApi(
  task_id: string,
  projectId: string,
): Promise<Task | null> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error("unauthorized");
  }

  try {
    const response = await fetch(
      `${baseUrl}/rest/v1/project_tasks?project_id=eq.${projectId}&id=eq.${task_id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          apikey: anonKey,
          "Content-Type": "application/json",
        },
      },
    );
    if (response.ok) {
      const task: Task[] = await response.json();
      return task[0];
    }
    return null;
  } catch {
    return null;
  }
}
