"use server";
// utils
import { getAccessToken } from "../../utils/cookies";

// types
import { Epic } from "@/src/types/projectType";

const baseUrl = process.env.SUPABASE_URL!;
const anonKey = process.env.SUPABASE_ANON_KEY!;

export async function getEpicDetails(
  projectId: string,
  epicId: string,
): Promise<Epic[]> {
  const token: string | null = await getAccessToken();

  if (!token) {
    throw new Error("unauthorized");
  }

  try {
    const response = await fetch(
      `${baseUrl}/rest/v1/project_epics?project_id=eq.${projectId}&id=eq.${epicId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          apikey: anonKey,
        },
      },
    );
    if (response.ok) {
      const epic = await response.json();
      return epic;
    }
    throw new Error("Failed to fetch epic details");
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch epic details",
    );
  }
}
