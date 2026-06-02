"use server";

import { getRefreshToken, setAuthTokens, clearAuthTokens } from "./cookies";

const anonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlraW5sb3J5emxjaWNwdGdmaGdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzNDk5NDUsImV4cCI6MjA5NDkyNTk0NX0.4ZgCL5_mqy68v77T-UjXwnfSFKjooZ0kkqfhBKKISFE";
const baseUrl = "https://ykinloryzlcicptgfhgg.supabase.co";

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
      }
    );

    const data = await response.json();

    if (data.error) {
      // Refresh token expired, clear auth
      await clearAuthTokens();
      return null;
    }

    if (data.access_token && data.expires_at) {
      // Store the new access token with API-provided expiry
      await setAuthTokens(
        data.access_token,
        data.refresh_token || refreshToken, // Use new refresh_token if provided
        data.expires_at
      );
      return data.access_token;
    }

    return null;
  } catch (error) {
    console.error("Token refresh failed:", error);
    await clearAuthTokens();
    return null;
  }
}