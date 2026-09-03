"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartLine {
  productId: string;
  name: string;
  slug: string;
  priceCents: number;
  image: string | null;
  quantity: number;
  /** Current known stock, used only for a client-side max-quantity hint. */
  stock: number;
}

interface CartState {
  lines: CartLine[];
  addItem: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      addItem: (line, quantity = 1) =>
        set((state) => {
          const existing = state.lines.find((l) => l.productId === line.productId);
          if (existing) {
            const nextQuantity = Math.min(existing.quantity + quantity, existing.stock || 99);
            return {
              lines: state.lines.map((l) =>
                l.productId === line.productId ? { ...l, quantity: nextQuantity } : l,
              ),
            };
          }
          return { lines: [...state.lines, { ...line, quantity }] };
        }),
      removeItem: (productId) =>
        set((state) => ({ lines: state.lines.filter((l) => l.productId !== productId) })),
      setQuantity: (productId, quantity) =>
        set((state) => ({
          lines:
            quantity <= 0
              ? state.lines.filter((l) => l.productId !== productId)
              : state.lines.map((l) => (l.productId === productId ? { ...l, quantity } : l)),
        })),
      clear: () => set({ lines: [] }),
    }),
    { name: "uroboros-cart" },
  ),
);

export function cartTotalCents(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.priceCents * line.quantity, 0);
}

export function cartItemCount(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}
