"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { apiFetch, ApiError } from "@/lib/api-client";
import type { AvailabilityResult } from "@/types";

export function useAvailability(serviceId: string | null, barberId: string | null, date: string | null, enabled: boolean) {
  const [data, setData] = useState<{ key: string; result: AvailabilityResult } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);
  const cache = useRef(new Map<string, AvailabilityResult>());

  const key = serviceId && barberId && date ? `${serviceId}|${barberId}|${date}` : null;

  useEffect(() => {
    if (!enabled || !key) return;
    const cached = cache.current.get(key);
    if (cached && nonce === 0) {
      setData({ key, result: cached });
      setError(null);
      return;
    }
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);
    const qs = new URLSearchParams({ serviceId: serviceId!, barberId: barberId!, date: date! });
    apiFetch<AvailabilityResult>(`/api/availability?${qs}`, { signal: ctrl.signal })
      .then((res) => {
        cache.current.set(key, res);
        setData({ key, result: res });
      })
      .catch((e: unknown) => {
        if ((e as Error).name === "AbortError") return;
        setError(e instanceof ApiError ? e.message : "Não foi possível carregar os horários.");
        setData(null);
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setLoading(false);
      });
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled, nonce]);

  /** Força nova consulta (ex.: após conflito de horário). */
  const reload = useCallback(() => {
    if (key) cache.current.delete(key);
    setNonce((n) => n + 1);
  }, [key]);

  return { data: data && data.key === key ? data.result : null, loading, error, reload };
}
