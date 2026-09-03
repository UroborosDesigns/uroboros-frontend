import { Clock } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

export default function CheckoutPendingPage() {
  return (
    <div className="space-y-4 py-16 text-center">
      <Clock className="text-muted-foreground mx-auto size-12" />
      <h1 className="text-2xl font-semibold">Tu pago está pendiente</h1>
      <p className="text-muted-foreground">
        Mercado Pago todavía está procesando tu pago. Te vamos a avisar por email en cuanto se
        confirme.
      </p>
      <ButtonLink href="/productos">Volver a la tienda</ButtonLink>
    </div>
  );
}
