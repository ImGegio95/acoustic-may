"use server";

import { signIn } from "@/auth";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/admin",
    });
  } catch (error: any) {
    if (error.type === "CredentialsSignin") {
      return { error: "Credenziali non valide" };
    }
    throw error;
  }
}
