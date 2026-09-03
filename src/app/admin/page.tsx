import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrders } from "@/lib/api/orders";
import { requireAdminToken } from "@/lib/auth";
import { formatCents } from "@/lib/utils";

export const metadata: Metadata = { title: "Resumen" };

export default async function AdminDashboardPage() {
  const token = await requireAdminToken();
  const orders = await getOrders(token);
  const recent = orders.slice(0, 5);
  const pendingCount = orders.filter((o) => o.status === "PENDING").length;
  const paidCount = orders.filter((o) => o.status === "PAID").length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Resumen</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-muted-foreground text-sm font-normal">
              Pedidos totales
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{orders.length}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-muted-foreground text-sm font-normal">
              Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{pendingCount}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-muted-foreground text-sm font-normal">Pagados</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{paidCount}</CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <h2 className="font-semibold">Últimos pedidos</h2>
        {recent.length === 0 ? (
          <p className="text-muted-foreground text-sm">Todavía no hay pedidos.</p>
        ) : (
          <div className="divide-y rounded-md border">
            {recent.map((order) => (
              <Link
                key={order.id}
                href={`/admin/pedidos/${order.id}`}
                className="flex items-center justify-between px-4 py-3 text-sm hover:bg-muted"
              >
                <div>
                  <p className="font-medium">{order.customerName}</p>
                  <p className="text-muted-foreground">{order.customerEmail}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span>{formatCents(order.totalCents)}</span>
                  <Badge variant="outline">{order.status}</Badge>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
