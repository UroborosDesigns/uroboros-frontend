import "server-only";
import type { CreatePreferenceResponse } from "uroboros-types";
import { apiFetch } from "./client";

export function createPreference(orderId: string) {
  return apiFetch<CreatePreferenceResponse>("/payments/preference", {
    method: "POST",
    body: { orderId },
  });
}
