import "server-only";
import type { Category, CreateCategoryInput, UpdateCategoryInput } from "uroboros-types";
import { apiFetch } from "./client";

export function getCategories() {
  return apiFetch<Category[]>("/categories", { next: { revalidate: 60, tags: ["categories"] } });
}

export function getCategory(id: string, token: string) {
  return apiFetch<Category>(`/categories/${id}`, { token, cache: "no-store" });
}

export function createCategory(input: CreateCategoryInput, token: string) {
  return apiFetch<Category>("/categories", { method: "POST", body: input, token });
}

export function updateCategory(id: string, input: UpdateCategoryInput, token: string) {
  return apiFetch<Category>(`/categories/${id}`, { method: "PATCH", body: input, token });
}

export function deleteCategory(id: string, token: string) {
  return apiFetch<void>(`/categories/${id}`, { method: "DELETE", token });
}
