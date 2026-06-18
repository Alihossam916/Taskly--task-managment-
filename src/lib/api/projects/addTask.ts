"use server";
// utils
import { getAccessToken } from "../../utils/cookies";
// types
import { AddTaskFormData } from "../../schemas/addTaskSchema";

const baseUrl = process.env.SUPABASE_URL!;
const anonKey = process.env.SUPABASE_ANON_KEY!;

export async function addTaskApi(
  formData: AddTaskFormData,
  project_id: string,
) {
  const { title, description, assignee_id, due_date, epic_id, status } =
    formData;

  const token: string | null = await getAccessToken();
  if (!token) {
    throw new Error("unauthorized");
  }

  try {
    const response = await fetch(`${baseUrl}/rest/v1/tasks`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: anonKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        project_id,
        epic_id: epic_id || null,
        title,
        description: description || "",
        assignee_id: assignee_id || null,
        due_date: due_date || null,
        status: status || "TO_DO",
      }),
    });
    if (response.ok) {
      const epic = await response.json();
      console.log(epic);
      return epic;
    }
  } catch (error) {
    return {
      error: {
        message: error instanceof Error && error.message,
      },
    };
  }
}
