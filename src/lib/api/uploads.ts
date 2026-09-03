import "server-only";
import type { UploadSignatureResponse } from "uroboros-types";
import { apiFetch } from "./client";

export function getUploadSignature(token: string) {
  return apiFetch<UploadSignatureResponse>("/uploads/signature", { token, cache: "no-store" });
}
