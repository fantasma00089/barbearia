import { z } from "zod";
import { ANY_BARBER } from "@/lib/constants";
import { bookingCodeSchema, dateStrSchema, idSchema, nameSchema, phoneSchema, timeStrSchema } from "./common";

export const availabilityQuerySchema = z.object({
  serviceId: idSchema,
  barberId: z.union([z.literal(ANY_BARBER), idSchema]).default(ANY_BARBER),
  date: dateStrSchema,
});

/** Campos do cliente — reutilizado no formulário (client) e na API (server). */
export const customerSchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
  notes: z.string().trim().max(300, "Use no máximo 300 caracteres.").optional().or(z.literal("")),
});

export const createBookingSchema = customerSchema.extend({
  serviceId: idSchema,
  barberId: z.union([z.literal(ANY_BARBER), idSchema]),
  date: dateStrSchema,
  time: timeStrSchema,
  acceptTerms: z.literal(true, { errorMap: () => ({ message: "É preciso aceitar os termos para continuar." }) }),
  /** Honeypot anti-spam: humanos não preenchem. */
  website: z.string().max(0).optional().or(z.literal("")),
});
export type CreateBookingInput = z.input<typeof createBookingSchema>;

export const lookupBookingSchema = z.object({
  code: bookingCodeSchema,
  phone: phoneSchema,
});

export const cancelBookingSchema = lookupBookingSchema.extend({
  reason: z.string().trim().max(200).optional(),
});

export const RESCHEDULE_PERIODS = ["qualquer", "manha", "tarde", "noite"] as const;

export const rescheduleRequestSchema = lookupBookingSchema.extend({
  preferredDate: dateStrSchema.optional().or(z.literal("")),
  preferredPeriod: z.enum(RESCHEDULE_PERIODS).default("qualquer"),
  note: z.string().trim().max(200, "Use no máximo 200 caracteres.").optional().or(z.literal("")),
});

export const contactMessageSchema = z.object({
  name: nameSchema,
  subject: z.enum(["agendamento", "duvida", "evento", "parceria", "outro"]),
  message: z.string().trim().min(10, "Escreva pelo menos 10 caracteres.").max(600, "Use no máximo 600 caracteres."),
});
