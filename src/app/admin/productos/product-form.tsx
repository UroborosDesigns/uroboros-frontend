"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import type { Category, ProductWithCategory } from "uroboros-types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "./image-uploader";
import { createProductAction, updateProductAction } from "./actions";

const ProductFormSchema = z.object({
  name: z.string().min(1, "Requerido"),
  slug: z
    .string()
    .min(1, "Requerido")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Solo minúsculas, números y guiones"),
  description: z.string().optional(),
  price: z.coerce.number().positive("El precio debe ser mayor a 0"),
  stock: z.coerce.number().int().nonnegative(),
  categoryId: z.string().min(1, "Elegí una categoría"),
  active: z.boolean(),
  images: z.array(z.string().url()),
});

type ProductFormValues = z.infer<typeof ProductFormSchema>;

export function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: ProductWithCategory;
}) {
  const [submitting, setSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: product
      ? {
          name: product.name,
          slug: product.slug,
          description: product.description ?? "",
          price: product.priceCents / 100,
          stock: product.stock,
          categoryId: product.categoryId,
          active: product.active,
          images: product.images,
        }
      : {
          name: "",
          slug: "",
          description: "",
          price: 0,
          stock: 0,
          categoryId: "",
          active: true,
          images: [],
        },
  });

  async function onSubmit(values: ProductFormValues) {
    setSubmitting(true);
    const input = {
      name: values.name,
      slug: values.slug,
      description: values.description || undefined,
      priceCents: Math.round(values.price * 100),
      currency: "ARS",
      stock: values.stock,
      categoryId: values.categoryId,
      active: values.active,
      images: values.images,
    };

    const result = product
      ? await updateProductAction(product.id, input)
      : await createProductAction(input);

    setSubmitting(false);
    if (result?.error) toast.error(result.error);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-lg space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio (ARS)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min={0}
                    {...field}
                    value={field.value as number}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input type="number" min={0} {...field} value={field.value as number} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Elegí una categoría" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imágenes</FormLabel>
              <ImageUploader images={field.value} onChange={field.onChange} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-2">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel className="!mt-0">Visible en la tienda</FormLabel>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={submitting}>
          {submitting ? "Guardando…" : product ? "Guardar cambios" : "Crear producto"}
        </Button>
      </form>
    </Form>
  );
}
