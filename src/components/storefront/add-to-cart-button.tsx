"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { ProductWithCategory } from "uroboros-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/stores/cart.store";

export function AddToCartButton({ product }: { product: ProductWithCategory }) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const outOfStock = product.stock <= 0;

  return (
    <div className="flex items-center gap-3">
      <Input
        type="number"
        min={1}
        max={product.stock}
        value={quantity}
        onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
        className="w-20"
        disabled={outOfStock}
      />
      <Button
        disabled={outOfStock}
        onClick={() => {
          addItem(
            {
              productId: product.id,
              name: product.name,
              slug: product.slug,
              priceCents: product.priceCents,
              image: product.images[0] ?? null,
              stock: product.stock,
            },
            quantity,
          );
          toast.success(`${product.name} agregado al carrito`);
        }}
      >
        {outOfStock ? "Sin stock" : "Agregar al carrito"}
      </Button>
    </div>
  );
}
