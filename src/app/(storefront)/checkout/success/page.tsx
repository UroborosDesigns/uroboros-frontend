import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckoutSuccessPage() {
  return (
    <div className="space-y-4 py-16 text-center">
      <CheckCircle2 className="text-primary mx-auto size-12" />
      <h1 className="text-2xl font-semibold">¡Gracias por tu compra!</h1>
      <p className="text-muted-foreground">
        Tu pago fue aprobado. Te vamos a contactar por email con los detalles del envío.
      </p>
      <Button render={<Link href="/productos" />}>Seguir viendo productos</Button>
    </div>
  );
}
