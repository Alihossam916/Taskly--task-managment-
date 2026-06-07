"use server";
import { LoginFormData } from "../../schemas/loginSchema";

const baseUrl = process.env.SUPABASE_URL!;
const anonKey = process.env.SUPABASE_ANON_KEY!;

// login handler
export async function loginApi(formData: LoginFormData) {
  const { email, password } = formData;
  try {
    const response = await fetch(
      `${baseUrl}/auth/v1/token?grant_type=password`,
      {
        method: "POST",
        headers: {
          apikey: anonKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok || data.error) {
      return {
        error: {
          message:
            data.error?.message || "Invalid credentials. Please try again.",
        },
      };
    }
    // Return the API response as-is with access_token, refresh_token, and user
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      token_type: data.token_type,
      expires_in: data.expires_in,
      expires_at: data.expires_at,
      user: data.user,
    };
  } catch (error) {
    return {
      error: {
        message: error instanceof Error ? error.message : "Login failed",
      },
    };
  }
}
