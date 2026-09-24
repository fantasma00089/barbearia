import { z } from "zod";
import { isValidDateStr } from "@/lib/time";

const text = (max: number, min = 1, msg = "Campo obrigatório.") => z.string().trim().min(min, msg).max(max, `Use no máximo ${max} caracteres.`);
const optionalText = (max: number) => z.string().trim().max(max, `Use no máximo ${max} caracteres.`);
const int = (min: number, max: number) =>
  z.coerce.number({ invalid_type_error: "Informe um número." }).int("Use um número inteiro.").min(min, `Mínimo ${min}.`).max(max, `Máximo ${max}.`);
const imageUrl = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v.startsWith("/") || /^https:\/\//.test(v), "Use uma imagem enviada ou um endereço https://");

export const settingsSectionSchemas = {
  brand: z.object({
    name: text(80),
    shortName: text(40),
    logoPrimary: text(30),
    logoSecondary: optionalText(30),
    logoTagline: optionalText(40),
    logoUrl: imageUrl.nullable(),
    slogan: text(120),
    description: text(300, 20, "Escreva pelo menos 20 caracteres."),
    accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Use uma cor no formato #RRGGBB."),
  }),
  contact: z.object({
    phoneDisplay: text(30),
    whatsapp: z
      .string()
      .transform((v) => v.replace(/\D/g, ""))
      .transform((v) => (v.length === 11 ? `55${v}` : v))
      .refine((v) => /^55\d{10,11}$/.test(v), "Informe o WhatsApp com DDD, ex.: (69) 99000-0000."),
    email: z.string().trim().email("E-mail inválido."),
    instagramHandle: z
      .string()
      .trim()
      .transform((v) => v.replace(/^@/, "").replace(/^https?:\/\/(www\.)?instagram\.com\//, "").replace(/\/$/, ""))
      .pipe(z.string().max(60)),
  }),
  address: z.object({
    street: text(120),
    neighborhood: text(80),
    city: text(80),
    state: text(2, 2, "Use a sigla do estado (ex.: RO).").toUpperCase(),
    postalCode: text(12),
    reference: optionalText(160),
    lat: z.coerce.number().min(-90).max(90),
    lng: z.coerce.number().min(-180).max(180),
  }),
  stats: z.object({
    rating: z.coerce.number().min(0).max(5),
    reviewsCount: int(0, 10_000_000),
    clientsServed: int(0, 100_000_000),
    yearsExperience: int(0, 200),
    foundedYear: int(1800, 2200),
  }),
  legal: z.object({
    companyName: text(120),
    cnpj: text(20),
    privacyEmail: z.string().trim().email("E-mail inválido."),
    forum: text(160),
    lastUpdated: z.string().refine(isValidDateStr, "Data inválida."),
  }),
  booking: z.object({
    slotStepMinutes: z.coerce.number().refine((v) => [5, 10, 15, 20, 30, 60].includes(v), "Use 5, 10, 15, 20, 30 ou 60."),
    bufferMinutes: int(0, 120),
    minLeadMinutes: int(0, 60 * 72),
    maxAdvanceDays: int(1, 365),
    autoConfirm: z.boolean(),
    cancelMinHours: int(0, 168),
    lateToleranceMinutes: int(0, 60),
  }),
  content: z.object({
    hero: z.object({
      eyebrow: optionalText(60),
      titleLine1: text(60),
      titleLine2: optionalText(60),
      subtitle: text(300),
      badge: optionalText(60),
    }),
    finalCta: z.object({ title: text(100), description: optionalText(200) }),
    faq: z.array(z.object({ q: text(160), a: text(800) })).max(30),
    testimonials: z
      .array(z.object({ name: text(60), detail: optionalText(80), rating: int(1, 5), text: text(400) }))
      .max(30),
    gallery: z.array(z.object({ src: imageUrl, title: text(80), category: optionalText(40) })).max(40),
  }),
} as const;

export type SettingsSection = keyof typeof settingsSectionSchemas;
export const SETTINGS_SECTIONS = Object.keys(settingsSectionSchemas) as SettingsSection[];

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Informe a senha atual."),
    newPassword: z.string().min(8, "A nova senha precisa de pelo menos 8 caracteres.").max(200),
    confirmPassword: z.string(),
  })
  .refine((v) => v.newPassword === v.confirmPassword, { message: "As senhas não conferem.", path: ["confirmPassword"] });
