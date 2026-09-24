import { NextResponse } from "next/server";
import { changeAdminPassword, requireAdmin } from "@/server/auth/admin";
import { clientIp, readJson, route } from "@/server/http";
import { rateLimit } from "@/server/rate-limit";
import { ADMIN_COOKIE, ADMIN_SESSION_HOURS, getSessionSecret, signSession } from "@/lib/auth-token";
import { changePasswordSchema } from "@/lib/validation/settings";

export const dynamic = "force-dynamic";

/** Troca a senha do painel e renova a sessão atual (as demais são encerradas). */
export const POST = route(async (req: Request) => {
  await requireAdmin();
  rateLimit(`admin-password:${clientIp(req)}`, 5, 15 * 60_000);
  const { currentPassword, newPassword } = changePasswordSchema.parse(await readJson(req));
  const version = await changeAdminPassword(currentPassword, newPassword);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, await signSession(getSessionSecret()!, version), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_HOURS * 3600,
  });
  return res;
});
