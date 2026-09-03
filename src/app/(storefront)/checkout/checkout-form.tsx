"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CheckoutSchema } from "uroboros-types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cartTotalCents, useCartStore } from "@/stores/cart.store";
import { formatCents } from "@/lib/utils";
import { submitCheckout } from "./actions";

const CustomerInfoSchema = CheckoutSchema.omit({ items: true, shippingAddress: true });

export function CheckoutForm() {
  const [submitting, setSubmitting] = useState(false);
  const lines = useCartStore((state) => state.lines);
  const clear = useCartStore((state) => state.clear);

  const form = useForm({
    resolver: zodResolver(CustomerInfoSchema),
    defaultValues: { customerName: "", customerEmail: "", customerPhone: "" },
  });

  if (lines.length === 0) {
    return <p className="text-muted-foreground">Tu carrito está vacío.</p>;
  }

  async function onSubmit(values: { customerName: string; customerEmail: string; customerPhone?: string }) {
    setSubmitting(true);
    try {
      const { redirectUrl } = await submitCheckout({
        ...values,
        items: lines.map((l) => ({ productId: l.productId, quantity: l.quantity })),
      });
      clear();
      window.location.assign(redirectUrl);
    } catch {
      toast.error("No pudimos iniciar el pago. Probá de nuevo en unos minutos.");
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre y apellido</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="customerEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="customerPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono (opcional)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? "Redirigiendo a Mercado Pago…" : "Pagar con Mercado Pago"}
          </Button>
        </form>
      </Form>

      <div className="space-y-3">
        <h2 className="font-semibold">Resumen</h2>
        {lines.map((line) => (
          <div key={line.productId} className="flex justify-between text-sm">
            <span>
              {line.name} × {line.quantity}
            </span>
            <span>{formatCents(line.priceCents * line.quantity)}</span>
          </div>
        ))}
        <Separator />
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatCents(cartTotalCents(lines))}</span>
        </div>
      </div>
    </div>
  );
}
