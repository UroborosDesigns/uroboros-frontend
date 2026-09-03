import "server-only";
import type { CreateProductInput, ProductWithCategory, UpdateProductInput } from "uroboros-types";
import { apiFetch } from "./client";

export function getProducts(options: { categorySlug?: string; includeInactive?: boolean } = {}) {
  const params = new URLSearchParams();
  if (options.categorySlug) params.set("categorySlug", options.categorySlug);
  if (options.includeInactive) params.set("includeInactive", "true");
  const qs = params.toString();

  return apiFetch<ProductWithCategory[]>(`/products${qs ? `?${qs}` : ""}`, {
    next: { revalidate: 60, tags: ["products"] },
  });
}

export function getProductBySlug(slug: string) {
  return apiFetch<ProductWithCategory>(`/products/slug/${slug}`, {
    next: { revalidate: 60, tags: ["products"] },
  });
}

export function getProduct(id: string, token: string) {
  return apiFetch<ProductWithCategory>(`/products/${id}`, { token, cache: "no-store" });
}

export function createProduct(input: CreateProductInput, token: string) {
  return apiFetch<ProductWithCategory>("/products", { method: "POST", body: input, token });
}

export function updateProduct(id: string, input: UpdateProductInput, token: string) {
  return apiFetch<ProductWithCategory>(`/products/${id}`, { method: "PATCH", body: input, token });
}

export function deleteProduct(id: string, token: string) {
  return apiFetch<void>(`/products/${id}`, { method: "DELETE", token });
}
