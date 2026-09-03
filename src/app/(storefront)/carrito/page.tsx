"use client";

import Image from "next/image";
import Link from "next/link";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cartTotalCents, useCartStore } from "@/stores/cart.store";
import { formatCents } from "@/lib/utils";

export default function CartPage() {
  const lines = useCartStore((state) => state.lines);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  if (lines.length === 0) {
    return (
      <div className="space-y-4 py-12 text-center">
        <p className="text-muted-foreground">Tu carrito está vacío.</p>
        <ButtonLink href="/productos">Ver productos</ButtonLink>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Tu carrito</h1>

      <div className="space-y-4">
        {lines.map((line) => (
          <div key={line.productId} className="flex items-center gap-4">
            <div className="bg-muted relative size-16 shrink-0 overflow-hidden rounded-md">
              {line.image && (
                <Image src={line.image} alt={line.name} fill className="object-cover" />
              )}
            </div>
            <div className="flex-1">
              <Link href={`/productos/${line.slug}`} className="font-medium hover:underline">
                {line.name}
              </Link>
              <p className="text-muted-foreground text-sm">{formatCents(line.priceCents)}</p>
            </div>
            <Input
              type="number"
              min={1}
              max={line.stock}
              value={line.quantity}
              onChange={(e) => setQuantity(line.productId, Number(e.target.value) || 1)}
              className="w-20"
            />
            <p className="w-24 text-right font-medium">
              {formatCents(line.priceCents * line.quantity)}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeItem(line.productId)}
              aria-label="Quitar"
            >
              Quitar
            </Button>
          </div>
        ))}
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Total</p>
        <p className="text-lg font-semibold">{formatCents(cartTotalCents(lines))}</p>
      </div>

      <ButtonLink href="/checkout" size="lg" className="w-full">
        Finalizar compra
      </ButtonLink>
    </div>
  );
}
