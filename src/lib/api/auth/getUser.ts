"use server";

const baseUrl = process.env.SUPABASE_URL!;
const anonKey = process.env.SUPABASE_ANON_KEY!;

export async function getUser() {
  try {
    const response = await fetch(`${baseUrl}/auth/v1/user`, {
      method: "GET",
      headers: {
        apikey: anonKey,
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const user = await response.json();
      return user;
    }
  } catch (error) {
    return {
      error: {
        message: error instanceof Error && error.message,
      },
    };
  }
}
