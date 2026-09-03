import Image from "next/image";
import Link from "next/link";
import type { ProductWithCategory } from "uroboros-types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatCents } from "@/lib/utils";

export function ProductCard({ product }: { product: ProductWithCategory }) {
  const image = product.images[0];

  return (
    <Link href={`/productos/${product.slug}`}>
      <Card className="h-full gap-3 overflow-hidden py-0 transition-shadow hover:shadow-md">
        <div className="bg-muted relative aspect-square w-full">
          {image ? (
            <Image
              src={image}
              alt={product.name}
              fill
              sizes="(min-width: 768px) 25vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="text-muted-foreground flex h-full w-full items-center justify-center text-sm">
              Sin imagen
            </div>
          )}
        </div>
        <CardContent className="px-4">
          <p className="text-muted-foreground text-xs">{product.category.name}</p>
          <p className="font-medium leading-tight">{product.name}</p>
        </CardContent>
        <CardFooter className="px-4 pb-4">
          <p className="font-semibold">{formatCents(product.priceCents)}</p>
        </CardFooter>
      </Card>
    </Link>
  );
}
