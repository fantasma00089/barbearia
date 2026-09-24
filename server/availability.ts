import "server-only";
import { prisma, type Db } from "./db";
import { getBusinessHours, toHourDTO } from "./catalog";
import { AppError } from "./errors";
import { getSettings } from "./settings";
import { effectiveHours } from "@/lib/hours-client";
import { computeBarberSlots, mergeSlots, type ComputedSlot, type Interval } from "@/lib/scheduling";
import { addDays, diffDays, SHOP_TZ, todayStr, weekdayOf, zonedToUtc } from "@/lib/time";
import { ACTIVE_BOOKING_STATUSES, type AvailabilityResult } from "@/types";
import type { SiteSettings } from "@/types/settings";

interface Options {
  db?: Db;
  now?: Date;
  /** Procura a próxima data livre quando o dia está vazio. */
  findNext?: boolean;
  /** Regras já carregadas (evita nova leitura dentro de transações). */
  rules?: SiteSettings["booking"];
}

/**
 * Horários disponíveis para um serviço, barbeiro (ou "sem preferência" = null)
 * e data ("YYYY-MM-DD" no fuso da barbearia).
 * Regras (intervalo, grade, antecedência, janela) vêm de /admin/configuracoes;
 * o horário de cada barbeiro é o próprio (se definido) ou o da barbearia.
 */
export async function getAvailableSlots(
  serviceId: string,
  barberId: string | null,
  date: string,
  { db = prisma, now = new Date(), findNext = false, rules }: Options = {},
): Promise<AvailabilityResult> {
  const booking = rules ?? (await getSettings()).booking;
  const base: AvailabilityResult = { date, timezone: SHOP_TZ, slots: [] };

  const service = await db.service.findFirst({ where: { id: serviceId, active: true } });
  if (!service) throw new AppError("NOT_FOUND", "Serviço não encontrado.");

  const barbers = await db.barber.findMany({
    where: {
      active: true,
      ...(barberId ? { id: barberId } : {}),
      services: { some: { serviceId } },
    },
    orderBy: { sortOrder: "asc" },
    select: { id: true, hours: true },
  });
  if (barberId && barbers.length === 0) {
    throw new AppError("NOT_FOUND", "Este barbeiro não realiza o serviço escolhido.");
  }
  if (barbers.length === 0) return { ...base, reason: "no_barber" };

  const today = todayStr(now);
  const offset = diffDays(today, date);
  if (offset < 0) return { ...base, reason: "past" };
  if (offset > booking.maxAdvanceDays) return { ...base, reason: "too_far" };

  const shopHours = await getBusinessHours(db);
  const hoursOf = (barber: (typeof barbers)[number], wd: number) => effectiveHours(shopHours, barber.hours.map(toHourDTO), wd)!;

  const compute = async (day: string): Promise<AvailabilityResult> => {
    const wd = weekdayOf(day);
    const working = barbers.filter((b) => hoursOf(b, wd).isOpen);
    if (working.length === 0) return { ...base, date: day, reason: "closed" };

    const dayStart = zonedToUtc(day, "00:00");
    const dayEnd = zonedToUtc(addDays(day, 1), "00:00");
    const bufferMs = booking.bufferMinutes * 60000;
    const ids = working.map((b) => b.id);

    const [bookings, blocks] = await Promise.all([
      db.booking.findMany({
        where: {
          barberId: { in: ids },
          status: { in: ACTIVE_BOOKING_STATUSES },
          startAt: { lt: new Date(dayEnd.getTime() + bufferMs) },
          endAt: { gt: new Date(dayStart.getTime() - bufferMs) },
        },
        select: { barberId: true, startAt: true, endAt: true },
      }),
      db.timeBlock.findMany({
        where: {
          OR: [{ barberId: null }, { barberId: { in: ids } }],
          startAt: { lt: dayEnd },
          endAt: { gt: dayStart },
        },
        select: { barberId: true, startAt: true, endAt: true },
      }),
    ]);

    const toInterval = (r: { startAt: Date; endAt: Date }): Interval => ({ start: r.startAt.getTime(), end: r.endAt.getTime() });
    const notBefore = now.getTime() + booking.minLeadMinutes * 60000;

    const perBarber = new Map<string, ComputedSlot[]>();
    for (const b of working) {
      perBarber.set(
        b.id,
        computeBarberSlots({
          dateStr: day,
          hours: hoursOf(b, wd),
          durationMin: service.durationMin,
          stepMin: booking.slotStepMinutes,
          bufferMin: booking.bufferMinutes,
          bookings: bookings.filter((x) => x.barberId === b.id).map(toInterval),
          blocks: blocks.filter((x) => x.barberId === null || x.barberId === b.id).map(toInterval),
          notBefore,
          tz: SHOP_TZ,
        }),
      );
    }

    const slots = mergeSlots(perBarber).map((s) => ({
      time: s.time,
      startAt: new Date(s.start).toISOString(),
      barberIds: s.barberIds,
    }));
    return { ...base, date: day, slots, ...(slots.length ? {} : { reason: "full" as const }) };
  };

  const result = await compute(date);

  if (findNext && result.slots.length === 0) {
    result.nextAvailableDate = null;
    for (let i = 1; i <= 14 && offset + i <= booking.maxAdvanceDays; i++) {
      const next = await compute(addDays(date, i));
      if (next.slots.length) {
        result.nextAvailableDate = next.date;
        break;
      }
    }
  }
  return result;
}
