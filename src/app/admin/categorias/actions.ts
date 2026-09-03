"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import type { CreateCategoryInput } from "uroboros-types";
import { createCategory, deleteCategory } from "@/lib/api/categories";
import { requireAdminToken } from "@/lib/auth";

export async function createCategoryAction(
  input: CreateCategoryInput,
): Promise<{ error: string } | undefined> {
  const token = await requireAdminToken();
  try {
    await createCategory(input, token);
  } catch {
    return { error: "No pudimos crear la categoría. Revisá que el slug no esté repetido." };
  }
  revalidateTag("categories", "max");
  revalidatePath("/admin/categorias");
}

export async function deleteCategoryAction(id: string): Promise<void> {
  const token = await requireAdminToken();
  await deleteCategory(id, token);
  revalidateTag("categories", "max");
  revalidatePath("/admin/categorias");
}
