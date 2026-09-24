import "server-only";
import { randomInt } from "node:crypto";
import { Prisma, type Booking } from "@prisma/client";
import { prisma, type Db } from "./db";
import { getAvailableSlots } from "./availability";
import { AppError } from "./errors";
import { withLock } from "./lock";
import { getSettings } from "./settings";
import { businessConfig } from "@/config/business";
import { ANY_BARBER } from "@/lib/constants";
import { addDays, formatDateLong, formatDateStr, todayStr, toTimeStr, zonedToUtc } from "@/lib/time";
import type { createBookingSchema, rescheduleRequestSchema } from "@/lib/validation";
import type { z } from "zod";
import {
  ACTIVE_BOOKING_STATUSES,
  type AdminBookingDTO,
  type BookingPublicDTO,
  type BookingStatus,
} from "@/types";

type BookingWithRelations = Booking & {
  service: { name: string; priceFrom: boolean };
  barber: { name: string; nickname: string | null };
};

const CODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

function generateCode() {
  let s = "";
  for (let i = 0; i < 6; i++) s += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
  return `${businessConfig.booking.codePrefix}-${s}`;
}

/** Aceita "na7k3f9q", "NA 7K3F9Q", "7K3F9Q"… */
export function normalizeCode(input: string) {
  const raw = input.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const prefix = businessConfig.booking.codePrefix.toUpperCase();
  const body = raw.startsWith(prefix) ? raw.slice(prefix.length) : raw;
  return `${prefix}-${body}`;
}

function cancelDeadline(b: Pick<Booking, "startAt">, cancelMinHours: number) {
  return new Date(b.startAt.getTime() - cancelMinHours * 3600_000);
}

function isActive(status: string) {
  return (ACTIVE_BOOKING_STATUSES as string[]).includes(status);
}

export function toPublicDTO(b: BookingWithRelations, cancelMinHours: number, now = new Date()): BookingPublicDTO {
  const deadline = cancelDeadline(b, cancelMinHours);
  const active = isActive(b.status);
  const future = b.startAt.getTime() > now.getTime();
  return {
    code: b.code,
    status: b.status as BookingStatus,
    serviceName: b.service.name,
    barberName: b.barber.nickname ? `${b.barber.name} (${b.barber.nickname})` : b.barber.name,
    customerName: b.customerName,
    customerPhone: b.customerPhone,
    notes: b.notes,
    startAt: b.startAt.toISOString(),
    endAt: b.endAt.toISOString(),
    dateLabel: formatDateLong(b.startAt),
    timeLabel: toTimeStr(b.startAt),
    durationMin: b.durationMin,
    priceCents: b.priceCents,
    priceFrom: b.service.priceFrom,
    canCancel: active && now < deadline,
    cancelDeadline: deadline.toISOString(),
    canRequestReschedule: active && future && !b.rescheduleRequested,
    rescheduleRequested: b.rescheduleRequested,
  };
}

export function toAdminDTO(b: BookingWithRelations, cancelMinHours: number, now = new Date()): AdminBookingDTO {
  return {
    ...toPublicDTO(b, cancelMinHours, now),
    id: b.id,
    barberId: b.barberId,
    serviceId: b.serviceId,
    anyBarber: b.anyBarber,
    rescheduleNote: b.rescheduleNote,
    cancelReason: b.cancelReason,
    cancelledBy: b.cancelledBy,
    createdAt: b.createdAt.toISOString(),
  };
}

const withRelations = {
  service: { select: { name: true, priceFrom: true } },
  barber: { select: { name: true, nickname: true } },
} as const;

/* ───────────────────────── Criação ───────────────────────── */

type CreateInput = z.output<typeof createBookingSchema>;

/**
 * Cria uma reserva com proteção contra double booking:
 *  1. mutex em processo (serializa pedidos simultâneos nesta instância);
 *  2. transação SERIALIZABLE que recalcula a disponibilidade e só então grava;
 *  3. retry em caso de conflito de serialização (PostgreSQL: P2034).
 */
export async function createBooking(input: CreateInput, now = new Date()) {
  const barberId = input.barberId === ANY_BARBER ? null : input.barberId;
  const startAt = zonedToUtc(input.date, input.time);
  const { booking: rules } = await getSettings();

  return withLock("booking:create", async () => {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        return await prisma.$transaction(
          async (tx) => {
            const availability = await getAvailableSlots(input.serviceId, barberId, input.date, { db: tx, now, rules });
            const slot = availability.slots.find((s) => s.time === input.time);
            if (!slot || slot.startAt !== startAt.toISOString()) {
              throw new AppError(
                "CONFLICT",
                "Esse horário acabou de ficar indisponível. Escolha outro, por favor.",
              );
            }

            const chosenBarberId = barberId ?? (await pickLeastBusyBarber(tx, slot.barberIds, startAt));
            const service = await tx.service.findUniqueOrThrow({ where: { id: input.serviceId } });

            let code = generateCode();
            while (await tx.booking.findUnique({ where: { code }, select: { id: true } })) code = generateCode();

            const autoConfirm = rules.autoConfirm;
            const created = await tx.booking.create({
              data: {
                code,
                serviceId: service.id,
                barberId: chosenBarberId,
                customerName: input.name,
                customerPhone: input.phone,
                notes: input.notes || null,
                startAt,
                endAt: new Date(startAt.getTime() + service.durationMin * 60000),
                status: autoConfirm ? "CONFIRMED" : "PENDING",
                confirmedAt: autoConfirm ? now : null,
                priceCents: service.priceCents,
                durationMin: service.durationMin,
                anyBarber: barberId === null,
              },
              include: withRelations,
            });
            return toPublicDTO(created, rules.cancelMinHours, now);
          },
          { isolationLevel: Prisma.TransactionIsolationLevel.Serializable, timeout: 10_000 },
        );
      } catch (error) {
        const retryable =
          error instanceof Prisma.PrismaClientKnownRequestError && (error.code === "P2034" || error.code === "P2002");
        if (retryable && attempt < 2) continue;
        if (retryable) throw new AppError("CONFLICT", "Esse horário acabou de ser reservado. Escolha outro, por favor.");
        throw error;
      }
    }
    throw new AppError("CONFLICT", "Não foi possível concluir a reserva. Tente novamente.");
  });
}

/** Para "sem preferência": escolhe o barbeiro livre com menos atendimentos no dia. */
async function pickLeastBusyBarber(db: Db, barberIds: string[], startAt: Date) {
  if (barberIds.length === 1) return barberIds[0]!;
  const day = todayStr(startAt);
  const dayStart = zonedToUtc(day, "00:00");
  const dayEnd = zonedToUtc(addDays(day, 1), "00:00");
  const counts = await db.booking.groupBy({
    by: ["barberId"],
    where: { barberId: { in: barberIds }, status: { in: ACTIVE_BOOKING_STATUSES }, startAt: { gte: dayStart, lt: dayEnd } },
    _count: { _all: true },
  });
  const load = new Map(counts.map((c) => [c.barberId, c._count._all]));
  return [...barberIds].sort((a, b) => (load.get(a) ?? 0) - (load.get(b) ?? 0))[0]!;
}

/* ─────────────────── Consulta / cancelamento (cliente) ─────────────────── */

async function findOwned(code: string, phone: string) {
  const booking = await prisma.booking.findUnique({ where: { code: normalizeCode(code) }, include: withRelations });
  // Mesma mensagem para "não existe" e "telefone não confere" (evita enumeração).
  if (!booking || booking.customerPhone !== phone) {
    throw new AppError("NOT_FOUND", "Não encontramos uma reserva com esse código e WhatsApp.");
  }
  return booking;
}

export async function lookupBooking(code: string, phone: string) {
  const { booking: rules } = await getSettings();
  return toPublicDTO(await findOwned(code, phone), rules.cancelMinHours);
}

export async function cancelBookingByCustomer(code: string, phone: string, reason?: string, now = new Date()) {
  const booking = await findOwned(code, phone);
  const { booking: rules } = await getSettings();
  if (!isActive(booking.status)) {
    throw new AppError("POLICY", "Esta reserva não pode mais ser cancelada.");
  }
  if (now >= cancelDeadline(booking, rules.cancelMinHours)) {
    throw new AppError(
      "POLICY",
      `Cancelamentos online são aceitos até ${rules.cancelMinHours}h antes do horário. Fale com a gente pelo WhatsApp.`,
    );
  }
  const updated = await prisma.booking.update({
    where: { id: booking.id },
    data: { status: "CANCELLED", cancelledAt: now, cancelledBy: "CUSTOMER", cancelReason: reason || null },
    include: withRelations,
  });
  return toPublicDTO(updated, rules.cancelMinHours, now);
}

const PERIOD_LABEL = { qualquer: "qualquer horário", manha: "manhã", tarde: "tarde", noite: "noite" } as const;

export async function requestReschedule(input: z.output<typeof rescheduleRequestSchema>, now = new Date()) {
  const booking = await findOwned(input.code, input.phone);
  if (!isActive(booking.status) || booking.startAt <= now) {
    throw new AppError("POLICY", "Esta reserva não pode mais ser reagendada online.");
  }
  const parts = [
    input.preferredDate ? `Data preferida: ${formatDateStr(input.preferredDate)}` : "Data: flexível",
    `Período: ${PERIOD_LABEL[input.preferredPeriod]}`,
    input.note ? `Obs.: ${input.note}` : null,
  ].filter(Boolean);
  const updated = await prisma.booking.update({
    where: { id: booking.id },
    data: { rescheduleRequested: true, rescheduleNote: parts.join(" · "), rescheduleAt: now },
    include: withRelations,
  });
  return toPublicDTO(updated, (await getSettings()).booking.cancelMinHours, now);
}

/* ───────────────────────── Admin ───────────────────────── */

export async function listBookingsForAdmin(filter: {
  date?: string;
  status: string;
  barberId?: string;
}) {
  const where: Prisma.BookingWhereInput = {};
  if (filter.date) {
    where.startAt = { gte: zonedToUtc(filter.date, "00:00"), lt: zonedToUtc(addDays(filter.date, 1), "00:00") };
  }
  if (filter.barberId) where.barberId = filter.barberId;
  if (filter.status === "ACTIVE") where.status = { in: ACTIVE_BOOKING_STATUSES };
  else if (filter.status === "RESCHEDULE") {
    where.rescheduleRequested = true;
    where.status = { in: ACTIVE_BOOKING_STATUSES };
  } else if (filter.status !== "ALL") where.status = filter.status;

  const rows = await prisma.booking.findMany({
    where,
    include: withRelations,
    orderBy: { startAt: "asc" },
    take: 300,
  });
  const { booking: rules } = await getSettings();
  return rows.map((r) => toAdminDTO(r, rules.cancelMinHours));
}

export async function adminUpdateBooking(id: string, action: string, reason?: string, now = new Date()) {
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) throw new AppError("NOT_FOUND", "Reserva não encontrada.");

  let data: Prisma.BookingUpdateInput;
  switch (action) {
    case "confirm":
      if (booking.status !== "PENDING") throw new AppError("POLICY", "Só reservas pendentes podem ser confirmadas.");
      data = { status: "CONFIRMED", confirmedAt: now };
      break;
    case "cancel":
      if (!isActive(booking.status)) throw new AppError("POLICY", "Esta reserva já não está ativa.");
      data = { status: "CANCELLED", cancelledAt: now, cancelledBy: "ADMIN", cancelReason: reason || null };
      break;
    case "complete":
      data = { status: "COMPLETED" };
      break;
    case "no_show":
      data = { status: "NO_SHOW" };
      break;
    case "clear_reschedule":
      data = { rescheduleRequested: false };
      break;
    default:
      throw new AppError("VALIDATION", "Ação inválida.");
  }
  const updated = await prisma.booking.update({ where: { id }, data, include: withRelations });
  return toAdminDTO(updated, (await getSettings()).booking.cancelMinHours, now);
}

export async function getAdminStats(now = new Date()) {
  const day = todayStr(now);
  const start = zonedToUtc(day, "00:00");
  const end = zonedToUtc(addDays(day, 1), "00:00");
  const [today, pending, reschedule, upcoming] = await Promise.all([
    prisma.booking.count({ where: { startAt: { gte: start, lt: end }, status: { in: ACTIVE_BOOKING_STATUSES } } }),
    prisma.booking.count({ where: { status: "PENDING", startAt: { gte: now } } }),
    prisma.booking.count({ where: { rescheduleRequested: true, status: { in: ACTIVE_BOOKING_STATUSES } } }),
    prisma.booking.count({ where: { startAt: { gte: now }, status: { in: ACTIVE_BOOKING_STATUSES } } }),
  ]);
  return { today, pending, reschedule, upcoming };
}
