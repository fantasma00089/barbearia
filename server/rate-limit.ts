import "server-only";
import { AppError } from "./errors";

/**
 * Rate limit simples em memória (janela deslizante por chave).
 * Suficiente para uma instância única. Em produção com várias instâncias,
 * troque por Redis/Upstash mantendo a mesma assinatura.
 */
const buckets = new Map<string, number[]>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    throw new AppError("RATE_LIMITED", "Muitas tentativas. Aguarde alguns minutos e tente novamente.");
  }
  hits.push(now);
  buckets.set(key, hits);

  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (!v.some((t) => now - t < windowMs)) buckets.delete(k);
  }
}
