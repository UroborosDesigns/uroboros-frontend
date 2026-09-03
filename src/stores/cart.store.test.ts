import { beforeEach, describe, expect, it } from "vitest";
import { cartItemCount, cartTotalCents, useCartStore, type CartLine } from "./cart.store";

function makeLine(overrides: Partial<Omit<CartLine, "quantity">> = {}): Omit<CartLine, "quantity"> {
  return {
    productId: "p1",
    name: "Sticker Gato",
    slug: "sticker-gato",
    priceCents: 1500,
    image: null,
    stock: 10,
    ...overrides,
  };
}

describe("cart store", () => {
  beforeEach(() => {
    localStorage.clear();
    useCartStore.setState({ lines: [] });
  });

  it("adds a new line item", () => {
    useCartStore.getState().addItem(makeLine(), 2);
    const lines = useCartStore.getState().lines;
    expect(lines).toHaveLength(1);
    expect(lines[0]).toMatchObject({ productId: "p1", quantity: 2 });
  });

  it("merges quantities when adding the same product twice", () => {
    useCartStore.getState().addItem(makeLine(), 2);
    useCartStore.getState().addItem(makeLine(), 3);
    const lines = useCartStore.getState().lines;
    expect(lines).toHaveLength(1);
    expect(lines[0].quantity).toBe(5);
  });

  it("caps merged quantity at the line's known stock", () => {
    useCartStore.getState().addItem(makeLine({ stock: 4 }), 3);
    useCartStore.getState().addItem(makeLine({ stock: 4 }), 3);
    expect(useCartStore.getState().lines[0].quantity).toBe(4);
  });

  it("removes a line item", () => {
    useCartStore.getState().addItem(makeLine());
    useCartStore.getState().removeItem("p1");
    expect(useCartStore.getState().lines).toHaveLength(0);
  });

  it("setQuantity removes the line when quantity drops to 0", () => {
    useCartStore.getState().addItem(makeLine(), 2);
    useCartStore.getState().setQuantity("p1", 0);
    expect(useCartStore.getState().lines).toHaveLength(0);
  });

  it("clear empties the cart", () => {
    useCartStore.getState().addItem(makeLine());
    useCartStore.getState().clear();
    expect(useCartStore.getState().lines).toHaveLength(0);
  });

  it("computes total cents and item count across multiple lines", () => {
    useCartStore.getState().addItem(makeLine({ productId: "p1", priceCents: 1500 }), 2);
    useCartStore.getState().addItem(makeLine({ productId: "p2", priceCents: 800 }), 1);
    const lines = useCartStore.getState().lines;
    expect(cartTotalCents(lines)).toBe(1500 * 2 + 800);
    expect(cartItemCount(lines)).toBe(3);
  });
});
