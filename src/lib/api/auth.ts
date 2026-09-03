import "server-only";
import type { LoginInput, LoginResponse } from "uroboros-types";
import { apiFetch } from "./client";

export function login(input: LoginInput) {
  return apiFetch<LoginResponse>("/auth/login", { method: "POST", body: input });
}
