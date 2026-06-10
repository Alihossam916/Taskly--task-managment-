"use server";
// utils
import { getAccessToken } from "../../utils/cookies";

// types
import { Project } from "@/src/types/projectType";

const baseUrl = process.env.SUPABASE_URL!;
const anonKey = process.env.SUPABASE_ANON_KEY!;

export async function getProjects(
  limit: number,
  offset: number,
): Promise<{ projects: Project[]; total: number }> {
  const token: string | null = await getAccessToken();

  try {
    const response = await fetch(
      `${baseUrl}/rest/v1/rpc/get_projects?limit=${limit}&offset=${offset}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          apikey: anonKey,
          "Content-Type": "application/json",
          Prefer: "count=exact",
        },
      },
    );
    if (response.ok) {
      const projects = await response.json();
      const total =
        Number(response.headers.get("content-range")?.split("/")[1]) || 0;
      return { projects, total };
    }
    throw new Error("Failed to fetch projects");
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch projects",
    );
  }
}
