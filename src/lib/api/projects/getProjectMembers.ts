"use server";
import { getAccessToken } from "../../utils/cookies";
import { Member } from "@/src/types/projectType";

const baseUrl = process.env.SUPABASE_URL!;
const anonKey = process.env.SUPABASE_ANON_KEY!;

export async function getProjectMembers(
  projectId: string,
): Promise<Member[] | null> {
  const token = await getAccessToken();
  try {
    const response = await fetch(
      `${baseUrl}/rest/v1/get_project_members?project_id=eq.${projectId}`,
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
    const members = await response.json();
    return members;
  } catch {
    return null;
  }
}
