import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getOrders } from "@/lib/api/orders";
import { requireAdminToken } from "@/lib/auth";
import { formatCents } from "@/lib/utils";

export const metadata: Metadata = { title: "Pedidos" };

export default async function AdminOrdersPage() {
  const token = await requireAdminToken();
  const orders = await getOrders(token);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Pedidos</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fecha</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="cursor-pointer">
              <TableCell>
                <Link href={`/admin/pedidos/${order.id}`} className="block hover:underline">
                  <span className="font-medium">{order.customerName}</span>
                  <span className="text-muted-foreground block text-xs">
                    {order.customerEmail}
                  </span>
                </Link>
              </TableCell>
              <TableCell>{formatCents(order.totalCents)}</TableCell>
              <TableCell>
                <Badge variant="outline">{order.status}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(order.createdAt).toLocaleDateString("es-AR")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {orders.length === 0 && (
        <p className="text-muted-foreground text-sm">Todavía no hay pedidos.</p>
      )}
    </div>
  );
}
