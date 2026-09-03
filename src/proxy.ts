import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_TOKEN_COOKIE = "uroboros_admin_token";

/**
 * Redirects to /admin/login when the admin JWT cookie is missing. This is a
 * cheap presence check only — every admin API call still requires the
 * backend to independently verify the JWT itself (see JwtAuthGuard there).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  const hasToken = request.cookies.has(ADMIN_TOKEN_COOKIE);
  if (!hasToken) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
