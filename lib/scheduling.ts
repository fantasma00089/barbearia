/**
 * Núcleo puro do cálculo de horários — sem acesso a banco, fácil de testar.
 * `server/availability.ts` busca os dados e delega para cá.
 */
import type { BusinessHourDTO } from "@/types";
import { minutesToTime, timeToMinutes, zonedToUtc } from "./time";

export interface Interval {
  start: number; // epoch ms
  end: number; // epoch ms
}

export interface ComputeSlotsInput {
  dateStr: string;
  hours: BusinessHourDTO;
  durationMin: number;
  stepMin: number;
  bufferMin: number;
  /** Reservas ativas do barbeiro (sem buffer; ele é aplicado aqui). */
  bookings: Interval[];
  /** Bloqueios do barbeiro + bloqueios gerais. */
  blocks: Interval[];
  /** Nenhum horário antes deste instante (agora + antecedência mínima). */
  notBefore: number;
  tz: string;
}

export interface ComputedSlot {
  time: string;
  start: number;
}

const overlaps = (aStart: number, aEnd: number, bStart: number, bEnd: number) => aStart < bEnd && bStart < aEnd;

/**
 * Gera os inícios possíveis para UM barbeiro em UMA data.
 * Regras:
 *  - começa na abertura e avança de `stepMin` em `stepMin`
 *  - o serviço precisa terminar até o fechamento
 *  - não pode cruzar a pausa (almoço)
 *  - respeita `bufferMin` antes e depois de cada reserva existente
 *  - não pode colidir com bloqueios
 *  - não pode estar no passado / dentro da antecedência mínima
 */
export function computeBarberSlots(input: ComputeSlotsInput): ComputedSlot[] {
  const { hours, durationMin, stepMin, bufferMin, bookings, blocks, notBefore, dateStr, tz } = input;
  if (!hours.isOpen) return [];

  const open = timeToMinutes(hours.openTime);
  const close = timeToMinutes(hours.closeTime);
  const breakStart = hours.breakStart ? timeToMinutes(hours.breakStart) : null;
  const breakEnd = hours.breakEnd ? timeToMinutes(hours.breakEnd) : null;
  const bufferMs = bufferMin * 60000;
  const durationMs = durationMin * 60000;

  const slots: ComputedSlot[] = [];
  for (let m = open; m + durationMin <= close; m += stepMin) {
    if (breakStart !== null && breakEnd !== null && overlaps(m, m + durationMin, breakStart, breakEnd)) continue;

    const time = minutesToTime(m);
    const start = zonedToUtc(dateStr, time, tz).getTime();
    const end = start + durationMs;
    if (start < notBefore) continue;

    const busy = bookings.some((b) => overlaps(start, end, b.start - bufferMs, b.end + bufferMs));
    if (busy) continue;

    const blocked = blocks.some((b) => overlaps(start, end, b.start, b.end));
    if (blocked) continue;

    slots.push({ time, start });
  }
  return slots;
}

/** Une os horários de vários barbeiros: time → barbeiros livres. */
export function mergeSlots(perBarber: Map<string, ComputedSlot[]>) {
  const merged = new Map<string, { time: string; start: number; barberIds: string[] }>();
  for (const [barberId, slots] of perBarber) {
    for (const s of slots) {
      const cur = merged.get(s.time);
      if (cur) cur.barberIds.push(barberId);
      else merged.set(s.time, { time: s.time, start: s.start, barberIds: [barberId] });
    }
  }
  return [...merged.values()].sort((a, b) => a.start - b.start);
}
