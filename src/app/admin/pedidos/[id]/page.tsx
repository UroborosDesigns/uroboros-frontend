import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ApiError } from "@/lib/api/client";
import { getOrder } from "@/lib/api/orders";
import { requireAdminToken } from "@/lib/auth";
import { formatCents } from "@/lib/utils";

export const metadata: Metadata = { title: "Detalle del pedido" };

export default async function AdminOrderDetailPage({ params }: PageProps<"/admin/pedidos/[id]">) {
  const { id } = await params;
  const token = await requireAdminToken();

  const order = await getOrder(id, token).catch((error) => {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  });
  if (!order) notFound();

  return (
    <div className="max-w-xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Pedido</h1>
        <Badge variant="outline">{order.status}</Badge>
      </div>

      <div className="space-y-1 text-sm">
        <p>
          <span className="text-muted-foreground">Cliente: </span>
          {order.customerName}
        </p>
        <p>
          <span className="text-muted-foreground">Email: </span>
          {order.customerEmail}
        </p>
        {order.customerPhone && (
          <p>
            <span className="text-muted-foreground">Teléfono: </span>
            {order.customerPhone}
          </p>
        )}
        <p>
          <span className="text-muted-foreground">Fecha: </span>
          {new Date(order.createdAt).toLocaleString("es-AR")}
        </p>
      </div>

      <Separator />

      <div className="space-y-2">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>
              {item.productName} × {item.quantity}
            </span>
            <span>{formatCents(item.unitPriceCents * item.quantity)}</span>
          </div>
        ))}
      </div>

      <Separator />

      <div className="flex justify-between font-semibold">
        <span>Total</span>
        <span>{formatCents(order.totalCents)}</span>
      </div>
    </div>
  );
}
