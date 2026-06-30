"use server";
import { apiClient } from "../client";

interface InviteMembersProp {
  email: string;
  project_id: string;
}

const baseUrl = process.env.SUPABASE_URL!;
const P_APP_URL = process.env.P_APP_URL!;

export async function inviteMembersApi({
  email,
  project_id,
}: InviteMembersProp): Promise<boolean> {
  try {
    const response = await apiClient(`/rest/v1/rpc/invite_member`, {
      method: "POST",
      body: JSON.stringify({
        p_email: email,
        p_project_id: project_id,
        p_app_url: P_APP_URL,
        p_base_url: baseUrl,
      }),
    });
    return response.ok;
  } catch {
    return false;
  }
}
