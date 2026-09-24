import { NextResponse } from "next/server";
import { checkAdminPassword, isAdminConfigured } from "@/server/auth/admin";
import { AppError } from "@/server/errors";
import { clientIp, readJson, route } from "@/server/http";
import { rateLimit } from "@/server/rate-limit";
import { ADMIN_COOKIE, ADMIN_SESSION_HOURS, getSessionSecret, signSession } from "@/lib/auth-token";
import { adminLoginSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export const POST = route(async (req: Request) => {
  rateLimit(`admin-login:${clientIp(req)}`, 5, 15 * 60_000);
  if (!isAdminConfigured()) {
    throw new AppError(
      "UNAVAILABLE",
      "Painel desativado: defina ADMIN_PASSWORD (8+ caracteres) e ADMIN_SESSION_SECRET (32+ caracteres) no .env.",
    );
  }
  const { password } = adminLoginSchema.parse(await readJson(req));
  if (!checkAdminPassword(password)) throw new AppError("UNAUTHORIZED", "Senha incorreta.");

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, await signSession(getSessionSecret()!), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_HOURS * 3600,
  });
  return res;
});
