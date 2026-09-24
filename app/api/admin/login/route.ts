import { NextResponse } from "next/server";
import { checkAdminPassword, getSessionVersion, isAdminConfigured } from "@/server/auth/admin";
import { AppError } from "@/server/errors";
import { clientIp, readJson, route } from "@/server/http";
import { rateLimit, rateLimitReset } from "@/server/rate-limit";
import { ADMIN_COOKIE, ADMIN_SESSION_HOURS, getSessionSecret, signSession } from "@/lib/auth-token";
import { adminLoginSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export const POST = route(async (req: Request) => {
  const limitKey = `admin-login:${clientIp(req)}`;
  rateLimit(limitKey, 5, 15 * 60_000);
  if (!(await isAdminConfigured())) {
    throw new AppError(
      "UNAVAILABLE",
      "Painel desativado: defina ADMIN_PASSWORD (8+ caracteres) e ADMIN_SESSION_SECRET (32+ caracteres) no .env.",
    );
  }
  const { password } = adminLoginSchema.parse(await readJson(req));
  if (!(await checkAdminPassword(password))) throw new AppError("UNAUTHORIZED", "Senha incorreta.");
  rateLimitReset(limitKey);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, await signSession(getSessionSecret()!, await getSessionVersion()), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_HOURS * 3600,
  });
  return res;
});
