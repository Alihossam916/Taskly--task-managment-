"use server";
// utils
import { getAccessToken } from "../../utils/cookies";
// types
import { AddProjectFormData as EditProjectFromData } from "../../schemas/addProjectSchema";

const baseUrl = process.env.SUPABASE_URL!;
const anonKey = process.env.SUPABASE_ANON_KEY!;

export async function editProjectApi(
  formData: EditProjectFromData,
  projectId: string,
) {
  const { name, description } = formData;
  const token: string | null = await getAccessToken();
  try {
    const response = await fetch(
      `${baseUrl}/rest/v1/projects?id=eq.${projectId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          apikey: anonKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
        }),
      },
    );
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
