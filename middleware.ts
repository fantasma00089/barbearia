import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, getSessionSecret, verifySession } from "@/lib/auth-token";

const PUBLIC_ADMIN_PATHS = ["/admin/login", "/api/admin/login"];

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

/** Bloqueia requisições de escrita vindas de outros sites (defesa extra contra CSRF). */
function isCrossSite(req: NextRequest) {
  if (SAFE_METHODS.has(req.method)) return false;
  const origin = req.headers.get("origin");
  if (!origin) return req.headers.get("sec-fetch-site") === "cross-site";
  try {
    return new URL(origin).host !== req.headers.get("host");
  } catch {
    return true;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/api/") && isCrossSite(req)) {
    return NextResponse.json({ error: "Origem não permitida.", code: "FORBIDDEN" }, { status: 403 });
  }
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
