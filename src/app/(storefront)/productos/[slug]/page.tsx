import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AddToCartButton } from "@/components/storefront/add-to-cart-button";
import { ApiError } from "@/lib/api/client";
import { getProductBySlug } from "@/lib/api/products";
import { formatCents } from "@/lib/utils";

async function loadProduct(slug: string) {
  try {
    return await getProductBySlug(slug);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function generateMetadata({
  params,
}: PageProps<"/productos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await loadProduct(slug);
  return { title: product?.name ?? "Producto" };
}

export default async function ProductPage({ params }: PageProps<"/productos/[slug]">) {
  const { slug } = await params;
  const product = await loadProduct(slug);
  if (!product) notFound();

  const image = product.images[0];

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="bg-muted relative aspect-square w-full overflow-hidden rounded-lg">
        {image ? (
          <Image src={image} alt={product.name} fill sizes="50vw" className="object-cover" />
        ) : (
          <div className="text-muted-foreground flex h-full w-full items-center justify-center text-sm">
            Sin imagen
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-muted-foreground text-sm">{product.category.name}</p>
          <h1 className="text-2xl font-semibold">{product.name}</h1>
        </div>
        <p className="text-2xl font-semibold">{formatCents(product.priceCents)}</p>
        {product.description && <p className="text-muted-foreground">{product.description}</p>}
        <AddToCartButton product={product} />
      </div>
    </div>
  );
}
