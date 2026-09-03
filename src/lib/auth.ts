import "server-only";
import { cookies } from "next/headers";

const ADMIN_TOKEN_COOKIE = "uroboros_admin_token";

/** Reads the admin JWT from an httpOnly cookie — never exposed to client JS. */
export async function getAdminToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(ADMIN_TOKEN_COOKIE)?.value;
}

export async function setAdminToken(token: string, expiresInSeconds: number): Promise<void> {
  const store = await cookies();
  store.set(ADMIN_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: expiresInSeconds,
  });
}

export async function clearAdminToken(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_TOKEN_COOKIE);
}

export async function requireAdminToken(): Promise<string> {
  const token = await getAdminToken();
  if (!token) throw new Error("Not authenticated");
  return token;
}

const UNIT_SECONDS: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400 };

/** Parses backend's JWT_EXPIRES_IN-style strings ("2h", "30m", "3600") into seconds. */
export function parseExpiresIn(value: string): number {
  const match = /^(\d+)\s*([smhd])?$/.exec(value.trim());
  if (!match) return 3600;
  const amount = Number(match[1]);
  const unit = match[2] ? UNIT_SECONDS[match[2]] : 1;
  return amount * (unit ?? 1);
}
