"use server";
import { cookies } from "next/headers";
import { getRefreshToken, setAuthTokens, clearAuthTokens } from "./cookies";

const baseUrl = process.env.SUPABASE_URL!;
const anonKey = process.env.SUPABASE_ANON_KEY!;

export async function refreshAccessToken(): Promise<string | null> {
  try {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      await clearAuthTokens();
      return null;
    }

    // Use the actual refresh_token from API to get new access token
    const response = await fetch(
      `${baseUrl}/auth/v1/token?grant_type=refresh_token`,
      {
        method: "POST",
        headers: {
          apikey: anonKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      },
    );

    const data = await response.json();

    if (data.error) {
      // Refresh token expired, clear auth
      await clearAuthTokens();
      return null;
    }

    const accessToken = data.access_token;
    const newRefreshToken = data.refresh_token || refreshToken;
    const expiresAt =
      data.expires_at || Math.floor(Date.now() / 1000) + data.expires_in;

    if (accessToken) {
      const cookieStore = await cookies();
      const wasRemembered = cookieStore.get("rememberMe")?.value === "true";

      await setAuthTokens(
        accessToken,
        newRefreshToken,
        expiresAt,
        wasRemembered,
      );
      return accessToken;
    }
    return null;
  } catch (error) {
    console.error("Token refresh failed:", error);
    await clearAuthTokens();
    return null;
  }
}
