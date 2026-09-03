"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { cartItemCount, useCartStore } from "@/stores/cart.store";

export function SiteHeader() {
  const count = useCartStore((state) => cartItemCount(state.lines));

  return (
    <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Uroboros
        </Link>
        <nav className="flex items-center gap-1">
          <ButtonLink variant="ghost" href="/productos">
            Productos
          </ButtonLink>
          <ButtonLink
            variant="ghost"
            size="icon"
            className="relative"
            href="/carrito"
            aria-label="Carrito"
          >
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <Badge className="absolute -top-1 -right-1 size-5 justify-center rounded-full p-0 text-xs">
                {count}
              </Badge>
            )}
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
}
