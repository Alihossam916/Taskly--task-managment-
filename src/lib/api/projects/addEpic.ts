"use server";
// utils
import { getAccessToken } from "../../utils/cookies";
// types
import { AddEpicFormData } from "../../schemas/addEpicSchema";

const baseUrl = process.env.SUPABASE_URL!;
const anonKey = process.env.SUPABASE_ANON_KEY!;

export async function addEpicApi(
  formData: AddEpicFormData,
  project_id: string,
) {
  const { title, description, assignee_id, deadline } = formData;
  const token: string | null = await getAccessToken();
  try {
    const response = await fetch(`${baseUrl}/rest/v1/epics`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: anonKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        assignee_id,
        project_id,
        deadline,
      }),
    });
    if (response.ok) {
      const project = await response.json();
      return project;
    }
  } catch (error) {
    return {
      error: {
        message: error instanceof Error && error.message,
      },
    };
  }
}
