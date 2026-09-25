import "server-only";
import { prisma } from "./db";
import { AppError } from "./errors";
import { businessHoursSchema, timeBlockSchema } from "@/lib/validation";
import { formatDateLong, toDateStr, todayStr, toTimeStr, zonedToUtc } from "@/lib/time";
import type { TimeBlockDTO } from "@/types";
import type { z } from "zod";

export async function listUpcomingBlocks(now = new Date()): Promise<TimeBlockDTO[]> {
  const rows = await prisma.timeBlock.findMany({
    where: { endAt: { gt: now } },
    include: { barber: { select: { name: true } } },
    orderBy: { startAt: "asc" },
    take: 200,
  });
  return rows.map((b) => ({
    id: b.id,
    barberId: b.barberId,
    barberName: b.barber?.name ?? null,
    startAt: b.startAt.toISOString(),
    endAt: b.endAt.toISOString(),
    dateLabel: formatDateLong(b.startAt),
    timeRange:
      toDateStr(b.startAt) === toDateStr(b.endAt)
        ? `${toTimeStr(b.startAt)} – ${toTimeStr(b.endAt)}`
        : `${toTimeStr(b.startAt)} → ${formatDateLong(b.endAt)} ${toTimeStr(b.endAt)}`,
    reason: b.reason,
  }));
}

export async function createBlock(input: z.output<typeof timeBlockSchema>, now = new Date()) {
  if (input.date < todayStr(now)) throw new AppError("POLICY", "Não é possível bloquear datas passadas.");
  if (input.barberId) {
    const exists = await prisma.barber.count({ where: { id: input.barberId } });
    if (!exists) throw new AppError("NOT_FOUND", "Barbeiro não encontrado.");
  }
  const startAt = zonedToUtc(input.date, input.startTime);
  const endAt = zonedToUtc(input.date, input.endTime);
  if (endAt <= now) throw new AppError("POLICY", "Esse período já passou. Escolha um horário futuro.");
  const block = await prisma.timeBlock.create({
    data: { barberId: input.barberId, startAt, endAt, reason: input.reason || null },
  });

  // Informa reservas ativas que colidem com o bloqueio (não cancela automaticamente).
  const conflicts = await prisma.booking.count({
    where: {
      status: { in: ["PENDING", "CONFIRMED"] },
      startAt: { lt: endAt },
      endAt: { gt: startAt },
      ...(input.barberId ? { barberId: input.barberId } : {}),
    },
  });
  return { id: block.id, conflicts };
}

export async function deleteBlock(id: string) {
  const res = await prisma.timeBlock.deleteMany({ where: { id } });
  if (!res.count) throw new AppError("NOT_FOUND", "Bloqueio não encontrado.");
}

export async function saveBusinessHours(rows: z.output<typeof businessHoursSchema>) {
  await prisma.$transaction(
    rows.map((r) =>
      prisma.businessHour.upsert({
        where: { dayOfWeek: r.dayOfWeek },
        update: r,
        create: r,
      }),
    ),
  );
}

export async function listBarbersForAdmin() {
  return prisma.barber.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true, active: true } });
}
