import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckoutFailurePage() {
  return (
    <div className="space-y-4 py-16 text-center">
      <XCircle className="text-destructive mx-auto size-12" />
      <h1 className="text-2xl font-semibold">El pago no se pudo completar</h1>
      <p className="text-muted-foreground">
        Podés intentar de nuevo con otro medio de pago desde tu carrito.
      </p>
      <Button render={<Link href="/carrito" />}>Volver al carrito</Button>
    </div>
  );
}
