import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getProducts } from "@/lib/api/products";
import { formatCents } from "@/lib/utils";
import { DeleteProductButton } from "./delete-product-button";

export const metadata: Metadata = { title: "Productos" };

export default async function AdminProductsPage() {
  const products = await getProducts({ includeInactive: true });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Productos</h1>
        <ButtonLink href="/admin/productos/nuevo">Nuevo producto</ButtonLink>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <Link href={`/admin/productos/${product.id}/editar`} className="hover:underline">
                  {product.name}
                </Link>
              </TableCell>
              <TableCell className="text-muted-foreground">{product.category.name}</TableCell>
              <TableCell>{formatCents(product.priceCents)}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>
                <Badge variant={product.active ? "default" : "outline"}>
                  {product.active ? "Visible" : "Oculto"}
                </Badge>
              </TableCell>
              <TableCell>
                <DeleteProductButton id={product.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {products.length === 0 && (
        <p className="text-muted-foreground text-sm">Todavía no hay productos.</p>
      )}
    </div>
  );
}
