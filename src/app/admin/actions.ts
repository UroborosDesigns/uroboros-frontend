"use server";

import { redirect } from "next/navigation";
import { clearAdminToken } from "@/lib/auth";

export async function logoutAction(): Promise<void> {
  await clearAdminToken();
  redirect("/admin/login");
}
