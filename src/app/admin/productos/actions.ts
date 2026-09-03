"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import type { CreateProductInput, UpdateProductInput } from "uroboros-types";
import { createProduct, deleteProduct, updateProduct } from "@/lib/api/products";
import { getUploadSignature } from "@/lib/api/uploads";
import { requireAdminToken } from "@/lib/auth";

export async function getUploadSignatureAction() {
  const token = await requireAdminToken();
  return getUploadSignature(token);
}

export async function createProductAction(
  input: CreateProductInput,
): Promise<{ error: string } | undefined> {
  const token = await requireAdminToken();
  try {
    await createProduct(input, token);
  } catch {
    return { error: "No pudimos crear el producto. Revisá que el slug no esté repetido." };
  }
  revalidateTag("products", "max");
  redirect("/admin/productos");
}

export async function updateProductAction(
  id: string,
  input: UpdateProductInput,
): Promise<{ error: string } | undefined> {
  const token = await requireAdminToken();
  try {
    await updateProduct(id, input, token);
  } catch {
    return { error: "No pudimos guardar los cambios." };
  }
  revalidateTag("products", "max");
  redirect("/admin/productos");
}

export async function deleteProductAction(id: string): Promise<void> {
  const token = await requireAdminToken();
  await deleteProduct(id, token);
  revalidateTag("products", "max");
  revalidatePath("/admin/productos");
}
