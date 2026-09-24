import "server-only";

/**
 * Mutex por chave dentro do processo Node. Serializa criações de reserva
 * para reduzir contenção; a garantia final contra double booking é a
 * verificação dentro da transação (veja server/bookings.ts).
 */
const chains = new Map<string, Promise<unknown>>();

export async function withLock<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const previous = chains.get(key) ?? Promise.resolve();
  let release!: () => void;
  const current = new Promise<void>((r) => (release = r));
  const chained = previous.then(() => current);
  chains.set(key, chained);
  try {
    await previous;
    return await fn();
  } finally {
    release();
    if (chains.get(key) === chained) chains.delete(key);
  }
}
