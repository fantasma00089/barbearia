import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, getSessionSecret, verifySession } from "@/lib/auth-token";

const PUBLIC_ADMIN_PATHS = ["/admin/login", "/api/admin/login"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (PUBLIC_ADMIN_PATHS.includes(pathname)) return NextResponse.next();

  const ok = await verifySession(req.cookies.get(ADMIN_COOKIE)?.value, getSessionSecret());
  if (ok) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Não autorizado.", code: "UNAUTHORIZED" }, { status: 401 });
  }
  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = pathname === "/admin" ? "" : `?next=${encodeURIComponent(pathname)}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};
