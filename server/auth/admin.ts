import "server-only";
import { createHash, randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, getEnvAdminPassword, getSessionSecret, readSessionVersion, verifySession } from "@/lib/auth-token";
import { prisma } from "../db";
import { AppError } from "../errors";

const scrypt = promisify(scryptCb) as (pwd: string, salt: Buffer, keylen: number) => Promise<Buffer>;
const SECURITY_KEY = "security";

interface SecurityData {
  /** scrypt da senha definida pelo painel; ausente = usa ADMIN_PASSWORD do .env */
  hash?: string;
  salt?: string;
  /** Incrementa a cada troca de senha → invalida sessões antigas. */
  version: number;
}

async function getSecurity(): Promise<SecurityData> {
  const row = await prisma.setting.findUnique({ where: { key: SECURITY_KEY } });
  if (!row) return { version: 0 };
  try {
    return { version: 0, ...JSON.parse(row.value) };
  } catch {
    return { version: 0 };
  }
}

/** Painel ativo se há segredo de sessão e alguma senha (definida no painel ou no .env). */
export async function isAdminConfigured() {
  if (!getSessionSecret()) return false;
  const sec = await getSecurity();
  return Boolean(sec.hash || getEnvAdminPassword());
}

export async function checkAdminPassword(input: string) {
  const sec = await getSecurity();
  if (sec.hash && sec.salt) {
    const derived = await scrypt(input, Buffer.from(sec.salt, "hex"), 64);
    return timingSafeEqual(derived, Buffer.from(sec.hash, "hex"));
  }
  const expected = getEnvAdminPassword();
  if (!expected) return false;
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export async function getSessionVersion() {
  return (await getSecurity()).version;
}

/** Troca a senha do painel. Retorna a nova versão de sessão. */
export async function changeAdminPassword(current: string, next: string) {
  if (!(await checkAdminPassword(current))) throw new AppError("UNAUTHORIZED", "Senha atual incorreta.");
  const sec = await getSecurity();
  const salt = randomBytes(16);
  const hash = await scrypt(next, salt, 64);
  const data: SecurityData = { hash: hash.toString("hex"), salt: salt.toString("hex"), version: sec.version + 1 };
  await prisma.setting.upsert({
    where: { key: SECURITY_KEY },
    update: { value: JSON.stringify(data) },
    create: { key: SECURITY_KEY, value: JSON.stringify(data) },
  });
  return data.version;
}

export async function isAdminRequest() {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  if (!(await verifySession(token, getSessionSecret()))) return false;
  // Sessões emitidas antes da última troca de senha deixam de valer.
  return readSessionVersion(token) === (await getSessionVersion());
}

/** Defesa em profundidade: além do middleware, cada rota admin verifica a sessão. */
export async function requireAdmin() {
  if (!(await isAdminRequest())) throw new AppError("UNAUTHORIZED", "Sessão expirada. Entre novamente.");
}
