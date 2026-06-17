"use server";

// utils
import { getAccessToken } from "../../utils/cookies";

interface EditEpicApiProp {
  epicId: string;
  title: string;
  description: string | null;
  assignee_id: string | null;
  deadline: string | null;
}

const baseUrl = process.env.SUPABASE_URL!;
const anonKey = process.env.SUPABASE_ANON_KEY!;

export async function editEpicApi({
  epicId,
  title,
  description,
  assignee_id,
  deadline,
}: EditEpicApiProp) {
  const token: string | null = await getAccessToken();

  try {
    const response = await fetch(`${baseUrl}/rest/v1/epics?id=eq.${epicId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: anonKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description: description || null,
        assignee_id:
          assignee_id === "unassigned" || assignee_id === ""
            ? null
            : assignee_id,
        deadline: deadline || null,
      }),
    });
    if (response.ok) {
      const text = await response.text();
      const epic = text ? JSON.parse(text) : null;
      return { epic };
    }
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error("Supabase error:", response.status, err);

      throw new Error(err.message || "Failed to update epic");
    }
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to update epics",
    );
  }
}
