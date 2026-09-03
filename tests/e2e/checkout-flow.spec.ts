import { expect, test } from "@playwright/test";

/**
 * Scoped smoke test for the single highest-value, highest-risk flow in the
 * app: browse -> add to cart -> checkout submit. Requires uroboros-backend
 * running locally (see README) with at least one seeded, active product.
 *
 * The Mercado Pago preference call is NOT mocked (this app routes all
 * backend calls server-side, so browser-level route interception can't
 * reach it) — the test accepts either outcome of that call (redirect to
 * Mercado Pago on real test credentials, or a visible error toast on
 * placeholder dev credentials) as proof the flow reached the network
 * boundary correctly.
 */
test("browse, add to cart, and submit checkout", async ({ page }) => {
  await page.goto("/productos");

  const firstProduct = page.locator("a[href^='/productos/']").first();
  await expect(firstProduct).toBeVisible();
  await firstProduct.click();

  await page.getByRole("button", { name: /Agregar al carrito/i }).click();
  await expect(page.getByText(/agregado al carrito/i)).toBeVisible();

  await page.goto("/carrito");
  await expect(page.getByRole("button", { name: /Finalizar compra/i })).toBeVisible();
  await page.getByRole("button", { name: /Finalizar compra/i }).click();

  await expect(page).toHaveURL(/\/checkout$/);
  await page.getByLabel(/Nombre y apellido/i).fill("Test Cliente");
  await page.getByLabel(/^Email$/i).fill("test@example.com");

  await page.getByRole("button", { name: /Pagar con Mercado Pago/i }).click();

  await Promise.race([
    page.waitForURL(/mercadopago\.com/, { timeout: 15_000 }),
    page.getByText(/no pudimos iniciar el pago/i).waitFor({ timeout: 15_000 }),
  ]);
});
