"use server";

import type { CheckoutInput } from "uroboros-types";
import { createOrder } from "@/lib/api/orders";
import { createPreference } from "@/lib/api/payments";

export async function submitCheckout(input: CheckoutInput): Promise<{ redirectUrl: string }> {
  const order = await createOrder(input);
  const preference = await createPreference(order.id);
  return { redirectUrl: preference.initPoint };
}
