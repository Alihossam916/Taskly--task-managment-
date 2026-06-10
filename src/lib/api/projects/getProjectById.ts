"use server";
import { getAccessToken } from "../../utils/cookies";
import { Project } from "@/src/types/projectType";

const baseUrl = process.env.SUPABASE_URL!;
const anonKey = process.env.SUPABASE_ANON_KEY!;

export async function getProjectById(
  projectId: string,
): Promise<Project | null> {
  const token = await getAccessToken();
  try {
    const response = await fetch(
      `${baseUrl}/rest/v1/projects?id=eq.${projectId}`,
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
    const projects = await response.json();
    return projects[0] || null;
  } catch {
    return null;
  }
}