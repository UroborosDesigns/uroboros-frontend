"use server";

import { redirect } from "next/navigation";
import type { LoginInput } from "uroboros-types";
import { login } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { parseExpiresIn, setAdminToken } from "@/lib/auth";

export async function loginAction(
  input: LoginInput,
): Promise<{ error: string } | undefined> {
  try {
    const { accessToken, expiresIn } = await login(input);
    await setAdminToken(accessToken, parseExpiresIn(expiresIn));
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return { error: "Email o contraseña incorrectos" };
    }
    return { error: "No pudimos iniciar sesión. Probá de nuevo." };
  }
  redirect("/admin");
}
