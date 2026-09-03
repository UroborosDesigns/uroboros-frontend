"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteCategoryAction } from "./actions";

export function DeleteCategoryButton({ id }: { id: string }) {
  const [pending, setPending] = useState(false);

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={pending}
      onClick={async () => {
        if (!confirm("¿Eliminar esta categoría?")) return;
        setPending(true);
        try {
          await deleteCategoryAction(id);
        } catch {
          toast.error("No se pudo eliminar (¿tiene productos asociados?)");
        } finally {
          setPending(false);
        }
      }}
    >
      Eliminar
    </Button>
  );
}
