"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteProductAction } from "./actions";

export function DeleteProductButton({ id }: { id: string }) {
  const [pending, setPending] = useState(false);

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={pending}
      onClick={async () => {
        if (!confirm("¿Eliminar este producto?")) return;
        setPending(true);
        try {
          await deleteProductAction(id);
        } catch {
          toast.error("No se pudo eliminar el producto");
        } finally {
          setPending(false);
        }
      }}
    >
      Eliminar
    </Button>
  );
}
