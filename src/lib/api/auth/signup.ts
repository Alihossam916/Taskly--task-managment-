"use server";
import { SignUpFormData } from "@/src/lib/schemas/signUpSchema";

const baseUrl = process.env.SUPABASE_URL!;
const anonKey = process.env.SUPABASE_ANON_KEY!;

// sign up handler
export async function signUpApi(formData: SignUpFormData) {
  const { email, password, name, job } = formData;
  try {
    const response = await fetch(`${baseUrl}/auth/v1/signup`, {
      method: "POST",
      headers: {
        apikey: anonKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        data: {
          name,
          job,
        },
      }),
    });
    const data = await response.json();
    if (!response.ok || data.error) {
      return {
        error: {
          message: data.error?.message || "Signup failed",
        },
      };
    }
    return data;
  } catch (error) {
    return {
      error: {
        message: error instanceof Error ? error.message : "Signup failed",
      },
    };
  }
}
