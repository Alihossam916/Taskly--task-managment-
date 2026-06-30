"use server";
import { apiClient } from "../client";

export async function acceptInviteApi(token: string): Promise<boolean> {
  try {
    const response = await apiClient(`/rest/v1/rpc/accept_invitation`, {
      method: "POST",
      body: JSON.stringify({
        p_token: token,
      }),
    });
    return response.ok;
  } catch {
    return false;
  }
}
