import { z } from "zod";
import { isValidDateStr } from "@/lib/time";
import { normalizeBrMobile } from "@/lib/phone";

export const dateStrSchema = z
  .string({ required_error: "Escolha uma data." })
  .refine(isValidDateStr, "Data inválida.");

export const timeStrSchema = z
  .string({ required_error: "Escolha um horário." })
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Horário inválido.");

export const phoneSchema = z
  .string({ required_error: "Informe seu WhatsApp." })
  .trim()
  .min(1, "Informe seu WhatsApp.")
  .transform((v, ctx) => {
    const n = normalizeBrMobile(v);
    if (!n) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Informe um celular válido com DDD, ex.: (69) 99999-0000." });
      return z.NEVER;
    }
    return n;
  });

export const nameSchema = z
  .string({ required_error: "Informe seu nome." })
  .trim()
  .min(2, "Informe seu nome.")
  .max(80, "Use no máximo 80 caracteres.")
  .regex(/^[\p{L}][\p{L}\p{M}' .-]*$/u, "Use apenas letras no nome.");

export const bookingCodeSchema = z
  .string({ required_error: "Informe o código da reserva." })
  .trim()
  .min(4, "Informe o código da reserva.")
  .max(20, "Código inválido.")
  .transform((v) => v.toUpperCase().replace(/\s+/g, ""));

export const idSchema = z.string().trim().min(1).max(64);
