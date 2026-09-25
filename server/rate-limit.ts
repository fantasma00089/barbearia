import "server-only";
import { AppError } from "./errors";

/**
 * Rate limit simples em memória (janela deslizante por chave).
 * Suficiente para uma instância única. Em produção com várias instâncias,
 * troque por Redis/Upstash mantendo a mesma assinatura.
 */
const buckets = new Map<string, number[]>();

function recent(key: string, windowMs: number, now: number) {
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  buckets.set(key, hits);
  return hits;
}

function cleanup(windowMs: number, now: number) {
  if (buckets.size <= 5000) return;
  for (const [k, v] of buckets) if (!v.some((t) => now - t < windowMs)) buckets.delete(k);
}

const TOO_MANY = "Muitas tentativas. Aguarde alguns minutos e tente novamente.";

/** Conta uma tentativa e bloqueia ao passar do limite. */
export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const hits = recent(key, windowMs, now);
  if (hits.length >= limit) throw new AppError("RATE_LIMITED", TOO_MANY);
  hits.push(now);
  cleanup(windowMs, now);
}

/** Só verifica (não conta). Use com `rateLimitHit` para contar apenas falhas. */
export function assertNotLimited(key: string, limit: number, windowMs: number) {
  if (recent(key, windowMs, Date.now()).length >= limit) throw new AppError("RATE_LIMITED", TOO_MANY);
}

export function rateLimitHit(key: string, windowMs: number) {
  const now = Date.now();
  recent(key, windowMs, now).push(now);
  cleanup(windowMs, now);
}

/** Zera o contador de uma chave. */
export function rateLimitReset(key: string) {
  buckets.delete(key);
}
