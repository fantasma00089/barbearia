import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, getSessionSecret, verifySession } from "@/lib/auth-token";
import { AppError } from "../errors";

export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length >= 8 && getSessionSecret());
}

export function checkAdminPassword(input: string) {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!expected) return false;
  // Compara digests de tamanho fixo em tempo constante.
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export async function isAdminRequest() {
  const store = await cookies();
  return verifySession(store.get(ADMIN_COOKIE)?.value, getSessionSecret());
}

/** Defesa em profundidade: além do middleware, cada rota admin verifica a sessão. */
export async function requireAdmin() {
  if (!(await isAdminRequest())) throw new AppError("UNAUTHORIZED", "Sessão expirada. Entre novamente.");
}
