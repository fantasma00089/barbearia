import { z } from "zod";
import { timeToMinutes } from "@/lib/time";
import { dateStrSchema, idSchema, timeStrSchema } from "./common";

export const adminLoginSchema = z.object({
  password: z.string().min(1, "Informe a senha.").max(200),
});

export const ADMIN_BOOKING_ACTIONS = ["confirm", "cancel", "complete", "no_show", "clear_reschedule"] as const;

export const adminBookingActionSchema = z.object({
  action: z.enum(ADMIN_BOOKING_ACTIONS),
  reason: z.string().trim().max(200).optional(),
});

export const adminBookingsQuerySchema = z.object({
  date: dateStrSchema.optional(),
  status: z.enum(["ALL", "ACTIVE", "PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "NO_SHOW", "RESCHEDULE"]).default("ACTIVE"),
  barberId: idSchema.optional(),
});

export const timeBlockSchema = z
  .object({
    barberId: idSchema.nullable(),
    date: dateStrSchema,
    startTime: timeStrSchema,
    endTime: timeStrSchema,
    reason: z.string().trim().max(120).optional().or(z.literal("")),
  })
  .refine((v) => timeToMinutes(v.endTime) > timeToMinutes(v.startTime), {
    message: "O fim deve ser depois do início.",
    path: ["endTime"],
  });

export const hourRowSchema = z
  .object({
    dayOfWeek: z.number().int().min(0).max(6),
    isOpen: z.boolean(),
    openTime: timeStrSchema,
    closeTime: timeStrSchema,
    breakStart: timeStrSchema.nullable(),
    breakEnd: timeStrSchema.nullable(),
  })
  .superRefine((v, ctx) => {
    if (!v.isOpen) return;
    if (timeToMinutes(v.closeTime) <= timeToMinutes(v.openTime)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Fechamento deve ser depois da abertura.", path: ["closeTime"] });
    }
    if ((v.breakStart === null) !== (v.breakEnd === null)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Informe início e fim da pausa.", path: ["breakEnd"] });
    } else if (v.breakStart && v.breakEnd) {
      const bs = timeToMinutes(v.breakStart);
      const be = timeToMinutes(v.breakEnd);
      if (be <= bs || bs < timeToMinutes(v.openTime) || be > timeToMinutes(v.closeTime)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Pausa deve estar dentro do expediente.", path: ["breakEnd"] });
      }
    }
  });

export const businessHoursSchema = z.array(hourRowSchema).length(7);
