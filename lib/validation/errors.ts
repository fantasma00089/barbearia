import type { ZodError } from "zod";

/** Converte erros do Zod para { campo: "mensagem" } (primeira mensagem de cada campo). */
export function flattenFieldErrors(error: ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
