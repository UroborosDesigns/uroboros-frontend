import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategories } from "@/lib/api/categories";
import { ApiError } from "@/lib/api/client";
import { getProduct } from "@/lib/api/products";
import { requireAdminToken } from "@/lib/auth";
import { ProductForm } from "../../product-form";

export const metadata: Metadata = { title: "Editar producto" };

export default async function EditProductPage({
  params,
}: PageProps<"/admin/productos/[id]/editar">) {
  const { id } = await params;
  const token = await requireAdminToken();

  const [product, categories] = await Promise.all([
    getProduct(id, token).catch((error) => {
      if (error instanceof ApiError && error.status === 404) return null;
      throw error;
    }),
    getCategories(),
  ]);
  if (!product) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Editar producto</h1>
      <ProductForm categories={categories} product={product} />
    </div>
  );
}
