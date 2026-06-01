import { SignUpFormData } from "@/src/lib/schemas/signUpSchema";

export default async function signUpApi(formData: SignUpFormData) {
  const { email, password, name, job } = formData;
  const anonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlraW5sb3J5emxjaWNwdGdmaGdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzNDk5NDUsImV4cCI6MjA5NDkyNTk0NX0.4ZgCL5_mqy68v77T-UjXwnfSFKjooZ0kkqfhBKKISFE";
  const baseUrl = "https://ykinloryzlcicptgfhgg.supabase.co";

  const user = await fetch(`${baseUrl}/auth/v1/signup`, {
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
  const response = await user.json();
  return response;
}
