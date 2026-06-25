"use server";
import { apiClient } from "../client";
import { Epic } from "@/src/types/projectType";

export async function getProjectEpics(
  projectId: string,
  limit: number,
  offset: number,
  searchTerm?: string,
): Promise<{ epics: Epic[]; total: number } | null> {
  try {
    const params: Record<string, string> = {
      project_id: `eq.${projectId}`,
      limit: String(limit),
      offset: String(offset),
    };

    if (searchTerm && searchTerm.trim().length > 0) {
      params.title = `ilike.%${searchTerm}%`;
    }

    const response = await apiClient("/rest/v1/project_epics", {
      params,
      headers: {
        Prefer: "count=exact",
      },
    });

    if (response.ok) {
      const epics = await response.json();
      const total =
        Number(response.headers.get("content-range")?.split("/")[1]) || 0;
      return { epics, total };
    }
    return null;
  } catch {
    return null;
  }
}
