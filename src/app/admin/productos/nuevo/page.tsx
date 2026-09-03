import type { Metadata } from "next";
import { getCategories } from "@/lib/api/categories";
import { ProductForm } from "../product-form";

export const metadata: Metadata = { title: "Nuevo producto" };

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Nuevo producto</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
