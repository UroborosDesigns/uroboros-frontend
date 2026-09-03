import type { Metadata } from "next";
import { CheckoutForm } from "./checkout-form";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Finalizar compra</h1>
      <CheckoutForm />
    </div>
  );
}
