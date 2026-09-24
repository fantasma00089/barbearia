import type { ApiErrorBody } from "@/types";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
    readonly fieldErrors?: Record<string, string[] | undefined>,
  ) {
    super(message);
  }
}

/** fetch JSON com erros padronizados (lança ApiError com a mensagem do servidor). */
export async function apiFetch<T>(input: string, init?: RequestInit & { json?: unknown }): Promise<T> {
  const { json, ...rest } = init ?? {};
  let res: Response;
  try {
    res = await fetch(input, {
      ...rest,
      headers: { ...(json !== undefined ? { "Content-Type": "application/json" } : {}), ...rest.headers },
      body: json !== undefined ? JSON.stringify(json) : rest.body,
    });
  } catch (e) {
    if ((e as Error).name === "AbortError") throw e;
    throw new ApiError("Sem conexão. Verifique sua internet e tente novamente.", 0);
  }
  const data = (await res.json().catch(() => ({}))) as T & Partial<ApiErrorBody>;
  if (!res.ok) {
    throw new ApiError(data.error ?? "Algo deu errado. Tente novamente.", res.status, data.code, data.fieldErrors);
  }
  return data;
}

/** Primeiro erro de cada campo vindo da API. */
export function firstFieldErrors(fe?: Record<string, string[] | undefined>) {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(fe ?? {})) if (v?.[0]) out[k] = v[0];
  return out;
}
