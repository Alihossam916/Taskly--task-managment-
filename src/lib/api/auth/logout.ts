"use server";
import { clearAuthTokens } from "../../utils/cookies";

const baseUrl = process.env.SUPABASE_URL!;
const anonKey = process.env.SUPABASE_ANON_KEY!;

// logout handler
export async function logoutApi(token: string) {
  try {
    const response = await fetch(`${baseUrl}/auth/v1/logout`, {
      method: "POST",
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      clearAuthTokens();
      return {};
    }
    const data = await response.json();

    return {
      error: {
        message: data.error?.message || "Logout failed",
      },
    };
  } catch (error) {
    return {
      error: {
        message: error instanceof Error ? error.message : "Login failed",
      },
    };
  }
}
