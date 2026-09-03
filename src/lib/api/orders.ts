import "server-only";
import type { CheckoutInput, Order } from "uroboros-types";
import { apiFetch } from "./client";

export function createOrder(input: CheckoutInput) {
  return apiFetch<Order>("/orders", { method: "POST", body: input });
}

export function getOrders(token: string) {
  return apiFetch<Order[]>("/orders", { token, cache: "no-store" });
}

export function getOrder(id: string, token: string) {
  return apiFetch<Order>(`/orders/${id}`, { token, cache: "no-store" });
}
