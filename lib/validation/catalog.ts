import { z } from "zod";
import { SERVICE_CATEGORIES } from "@/types";
import { hourRowSchema } from "./admin";

const imageUrl = z
  .string()
  .trim()
  .min(1, "Envie uma foto.")
  .max(500)
  .refine((v) => v.startsWith("/") || /^https:\/\//.test(v), "Use uma imagem enviada ou um endereço https://");

export const barberInputSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome.").max(80),
  nickname: z.string().trim().max(30).optional().or(z.literal("")),
  specialty: z.string().trim().min(3, "Informe a especialidade.").max(120),
  bio: z.string().trim().min(10, "Escreva uma bio com pelo menos 10 caracteres.").max(600),
  yearsExperience: z.coerce.number().int().min(0).max(80),
  rating: z.coerce.number().min(0).max(5),
  reviewsCount: z.coerce.number().int().min(0).max(1_000_000),
  photo: imageUrl,
  instagram: z
    .string()
    .trim()
    .transform((v) => v.replace(/^@/, ""))
    .pipe(z.string().max(60))
    .optional(),
  active: z.boolean(),
  serviceIds: z.array(z.string().min(1)).min(1, "Selecione pelo menos um serviço."),
  customHours: z
    .array(hourRowSchema)
    .max(7)
    .refine((rows) => new Set(rows.map((r) => r.dayOfWeek)).size === rows.length, "Dia repetido."),
});
export type BarberInput = z.infer<typeof barberInputSchema>;

export const serviceInputSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome.").max(80),
  description: z.string().trim().min(10, "Descreva o serviço (mínimo 10 caracteres).").max(300),
  category: z.enum(SERVICE_CATEGORIES),
  durationMin: z.coerce
    .number({ invalid_type_error: "Informe a duração." })
    .int()
    .min(5, "Mínimo 5 minutos.")
    .max(480, "Máximo 8 horas.")
    .refine((v) => v % 5 === 0, "Use múltiplos de 5 minutos."),
  price: z.coerce.number({ invalid_type_error: "Informe o preço." }).min(0).max(100_000),
  priceFrom: z.boolean(),
  featured: z.boolean(),
  active: z.boolean(),
  barberIds: z.array(z.string().min(1)),
});
export type ServiceInput = z.infer<typeof serviceInputSchema>;

export const reorderSchema = z.object({ direction: z.enum(["up", "down"]) });
