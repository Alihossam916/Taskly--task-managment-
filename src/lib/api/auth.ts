import { SignUpFormData } from "@/src/lib/schemas/signUpSchema";
import { LoginFormData } from "../schemas/loginSchema";
import { ForgotPasswordData } from "../schemas/forgotPasswordSchema";
import { ResetPasswordFormData } from "../schemas/resetPasswordSchema";

import { clearAuthTokens } from "../utils/cookies";

const anonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlraW5sb3J5emxjaWNwdGdmaGdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzNDk5NDUsImV4cCI6MjA5NDkyNTk0NX0.4ZgCL5_mqy68v77T-UjXwnfSFKjooZ0kkqfhBKKISFE";
const baseUrl = "https://ykinloryzlcicptgfhgg.supabase.co";

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

// forgot password handler
export async function forgotPasswordApi(formData: ForgotPasswordData) {
  const { email } = formData;
  try {
    const response = await fetch(`${baseUrl}/auth/v1/recover`, {
      method: "POST",
      headers: {
        apikey: anonKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
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
