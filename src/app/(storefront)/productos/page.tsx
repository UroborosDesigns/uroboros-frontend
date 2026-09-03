import Link from "next/link";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/storefront/product-card";
import { getCategories } from "@/lib/api/categories";
import { getProducts } from "@/lib/api/products";

export const metadata: Metadata = { title: "Productos" };

export default async function ProductsPage({ searchParams }: PageProps<"/productos">) {
  const { categoria } = await searchParams;
  const categorySlug = typeof categoria === "string" ? categoria : undefined;

  const [products, categories] = await Promise.all([
    getProducts({ categorySlug }),
    getCategories(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Productos</h1>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/productos"
          className={cn(
            "rounded-full border px-3 py-1 text-sm",
            !categorySlug ? "bg-primary text-primary-foreground" : "hover:bg-muted",
          )}
        >
          Todos
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/productos?categoria=${category.slug}`}
            className={cn(
              "rounded-full border px-3 py-1 text-sm",
              categorySlug === category.slug
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted",
            )}
          >
            {category.name}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <p className="text-muted-foreground">Todavía no hay productos en esta categoría.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
