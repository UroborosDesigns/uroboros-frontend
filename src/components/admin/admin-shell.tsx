"use client";

import { usePathname } from "next/navigation";
import { AdminNav } from "./admin-nav";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="grid min-h-screen grid-cols-[220px_1fr]">
      <aside className="border-r">
        <AdminNav />
      </aside>
      <main className="p-6">{children}</main>
    </div>
  );
}
