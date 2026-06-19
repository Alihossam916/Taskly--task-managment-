"use server";
import { getAccessToken } from "../../utils/cookies";
import { Task } from "@/src/types/projectType";

const baseUrl = process.env.SUPABASE_URL!;
const anonKey = process.env.SUPABASE_ANON_KEY!;

export async function getTasksByEpicApi(
  epic_id: string,
): Promise<Task[] | null> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error("unauthorized");
  }

  try {
    const response = await fetch(
      `${baseUrl}/rest/v1/project_tasks?epic_id=eq.${epic_id}`,
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
      const tasks: Task[] = await response.json();
      return tasks;
    }
    return null;
  } catch {
    return null;
  }
}
