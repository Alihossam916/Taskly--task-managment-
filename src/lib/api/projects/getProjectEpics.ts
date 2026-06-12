"use server";
import { getAccessToken } from "../../utils/cookies";
import { Epic } from "@/src/types/projectType";

const baseUrl = process.env.SUPABASE_URL!;
const anonKey = process.env.SUPABASE_ANON_KEY!;

export async function getProjectEpics(
  projectId: string,
): Promise<Epic[] | null> {
  const token = await getAccessToken();
  try {
    const response = await fetch(
      `${baseUrl}/rest/v1/project_epics?project_id=eq.${projectId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          apikey: anonKey,
          "Content-Type": "application/json",
        },
      },
    );
    if (!response.ok) return null;
    const epics = await response.json();
    return epics;
  } catch {
    return null;
  }
}
