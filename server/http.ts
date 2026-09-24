import "server-only";
import { unstable_rethrow } from "next/navigation";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError } from "./errors";
import type { ApiErrorBody } from "@/types";

export function json<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function errorResponse(error: unknown) {
  if (error instanceof ZodError) {
    const flat = error.flatten();
    const body: ApiErrorBody = {
      error: "Confira os campos destacados.",
      code: "VALIDATION",
      fieldErrors: flat.fieldErrors as Record<string, string[] | undefined>,
    };
    return NextResponse.json(body, { status: 400 });
  }
  if (error instanceof AppError) {
    return NextResponse.json<ApiErrorBody>({ error: error.message, code: error.code }, { status: error.status });
  }
  if (error instanceof SyntaxError) {
    return NextResponse.json<ApiErrorBody>({ error: "Requisição inválida.", code: "VALIDATION" }, { status: 400 });
  }
  console.error("[api] erro inesperado:", error);
  return NextResponse.json<ApiErrorBody>(
    { error: "Algo deu errado do nosso lado. Tente novamente em instantes." },
    { status: 500 },
  );
}

/** Envolve um handler de rota com tratamento padronizado de erros. */
export function route<Args extends unknown[]>(handler: (...args: Args) => Promise<Response>) {
  return async (...args: Args) => {
    try {
      return await handler(...args);
    } catch (error) {
      unstable_rethrow(error); // não engolir sinais internos do Next (dynamic usage, redirect, notFound)
      return errorResponse(error);
    }
  };
}

export function clientIp(req: Request) {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

export async function readJson(req: Request): Promise<unknown> {
  return req.json();
}
