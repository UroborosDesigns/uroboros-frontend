import { ButtonLink } from "@/components/ui/button";
import { ProductCard } from "@/components/storefront/product-card";
import { getProducts } from "@/lib/api/products";

export default async function HomePage() {
  const products = await getProducts();
  const featured = products.slice(0, 8);

  return (
    <div className="space-y-10">
      <section className="space-y-3 py-8 text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Stickers, tarjetas y papelería con onda
        </h1>
        <p className="text-muted-foreground mx-auto max-w-md">
          Hecho a mano por una familia que ama el papel tanto como vos.
        </p>
        <ButtonLink href="/productos" size="lg" className="mt-2">
          Ver productos
        </ButtonLink>
      </section>

      {featured.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Destacados</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
