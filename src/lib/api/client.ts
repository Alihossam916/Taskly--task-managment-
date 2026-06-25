"use server";
import { getAccessToken } from "../utils/cookies";

const baseUrl = process.env.SUPABASE_URL!;
const anonKey = process.env.SUPABASE_ANON_KEY!;

export async function apiClient(
  path: string,
  options?: RequestInit & { params?: Record<string, string> },
) {
  const token = await getAccessToken();
  if (!token) throw new Error("unauthorized");

  const url = new URL(`${baseUrl}${path}`);
  if (options?.params) {
    Object.entries(options.params).forEach(([key, value]) =>
      url.searchParams.set(key, value),
    );
  }

  return fetch(url.toString(), {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: anonKey,
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
}
