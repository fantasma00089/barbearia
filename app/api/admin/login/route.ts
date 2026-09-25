import { NextResponse } from "next/server";
import { checkAdminPassword, getSessionVersion, isAdminConfigured } from "@/server/auth/admin";
import { AppError } from "@/server/errors";
import { clientIp, readJson, route } from "@/server/http";
import { assertNotLimited, rateLimitHit, rateLimitReset } from "@/server/rate-limit";
import { ADMIN_COOKIE, ADMIN_SESSION_HOURS, getSessionSecret, signSession } from "@/lib/auth-token";
import { adminLoginSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

const WINDOW = 15 * 60_000;
/** Senhas erradas por IP e no total (o total barra ataques que trocam de IP). */
const PER_IP_LIMIT = 5;
const GLOBAL_LIMIT = 30;

export const POST = route(async (req: Request) => {
  const ipKey = `admin-login:${clientIp(req)}`;
  assertNotLimited(ipKey, PER_IP_LIMIT, WINDOW);
  assertNotLimited("admin-login:*", GLOBAL_LIMIT, WINDOW);
  if (!(await isAdminConfigured())) {
    throw new AppError(
      "UNAVAILABLE",
      "Painel desativado: defina ADMIN_PASSWORD (8+ caracteres) e ADMIN_SESSION_SECRET (32+ caracteres) no .env. Em produção, os valores de exemplo não são aceitos.",
    );
  }
  const { password } = adminLoginSchema.parse(await readJson(req));
  if (!(await checkAdminPassword(password))) {
    rateLimitHit(ipKey, WINDOW);
    rateLimitHit("admin-login:*", WINDOW);
    throw new AppError("UNAUTHORIZED", "Senha incorreta.");
  }
  rateLimitReset(ipKey);

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
