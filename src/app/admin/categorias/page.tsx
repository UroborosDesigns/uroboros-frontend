import type { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import { getCategories } from "@/lib/api/categories";
import { CategoryForm } from "./category-form";
import { DeleteCategoryButton } from "./delete-category-button";

export const metadata: Metadata = { title: "Categorías" };

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-semibold">Categorías</h1>

      <CategoryForm />
      <Separator />

      <div className="divide-y rounded-md border">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center justify-between px-4 py-2">
            <div>
              <p className="font-medium">{category.name}</p>
              <p className="text-muted-foreground text-xs">{category.slug}</p>
            </div>
            <DeleteCategoryButton id={category.id} />
          </div>
        ))}
        {categories.length === 0 && (
          <p className="text-muted-foreground px-4 py-3 text-sm">Todavía no hay categorías.</p>
        )}
      </div>
    </div>
  );
}
