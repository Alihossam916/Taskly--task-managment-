"use server";
import { ResetPasswordFormData } from "../../schemas/resetPasswordSchema";

const baseUrl = process.env.SUPABASE_URL!;
const anonKey = process.env.SUPABASE_ANON_KEY!;

// reset password handler
export async function resetPasswordApi(
  formData: ResetPasswordFormData,
  token: string,
) {
  const { password } = formData;
  try {
    const response = await fetch(`${baseUrl}/auth/v1/user`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: anonKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
      }),
    });
  } catch (error) {
    return {
      error: {
        message: error instanceof Error && error.message,
      },
    };
  }
}
