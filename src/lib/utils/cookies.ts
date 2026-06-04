"use server";

import { cookies } from "next/headers";

const REMEMBER_ME_EXPIRY = 30 * 24 * 60 * 60; // 30 days in seconds

export async function setAuthTokens(
  accessToken: string,
  refreshToken: string,
  expiresAt: number, // Unix timestamp in seconds from API
  rememberMe: boolean = false,
) {
  const cookieStore = await cookies();

  // Calculate max age in seconds
  const maxAge = expiresAt - Math.floor(Date.now() / 1000); // remaining time

  // If remember me is checked, extend the refresh token expiry to 30 days
  const refreshMaxAge = rememberMe ? REMEMBER_ME_EXPIRY : maxAge;

  // Store access token with API-provided expiry
  cookieStore.set("accessToken", accessToken, {
    httpOnly: true, // Prevent JavaScript access (secure against XSS)
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: maxAge > 0 ? maxAge : 3600, // fallback to 1 hour
    path: "/",
  });

  // Store refresh token (longer-lived)
  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: refreshMaxAge,
    path: "/",
  });
}

export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value ?? null;
}

export async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("refreshToken")?.value ?? null;
}

export async function clearAuthTokens() {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  cookieStore.delete("rememberMe");
}
