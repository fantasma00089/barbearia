/**
 * Utilitários de data/hora com fuso horário explícito, sem dependências.
 *
 * Convenções:
 *  - "dateStr" = "YYYY-MM-DD" (data civil no fuso da barbearia)
 *  - "timeStr" = "HH:mm"
 *  - Instantes são `Date` em UTC; a exibição sempre converte para o fuso.
 */
import { businessConfig } from "@/config/business";

export const SHOP_TZ = businessConfig.timezone;

const partsFormatters = new Map<string, Intl.DateTimeFormat>();

function getPartsFormatter(tz: string) {
  let f = partsFormatters.get(tz);
  if (!f) {
    f = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      weekday: "short",
    });
    partsFormatters.set(tz, f);
  }
  return f;
}

const WEEKDAY_INDEX: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

export interface ZonedParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  weekday: number;
}

export function getZonedParts(date: Date, tz: string = SHOP_TZ): ZonedParts {
  const map: Record<string, string> = {};
  for (const p of getPartsFormatter(tz).formatToParts(date)) map[p.type] = p.value;
  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour: Number(map.hour),
    minute: Number(map.minute),
    second: Number(map.second),
    weekday: WEEKDAY_INDEX[map.weekday ?? "Sun"] ?? 0,
  };
}

/** Diferença (min) entre o horário local do fuso e UTC no instante informado. */
export function tzOffsetMinutes(date: Date, tz: string = SHOP_TZ) {
  const p = getZonedParts(date, tz);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return Math.round((asUtc - Math.floor(date.getTime() / 1000) * 1000) / 60000);
}

export function parseDateStr(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return { year: y!, month: m!, day: d! };
}

export function isValidDateStr(dateStr: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const { year, month, day } = parseDateStr(dateStr);
  const dt = new Date(Date.UTC(year, month - 1, day));
  return dt.getUTCFullYear() === year && dt.getUTCMonth() === month - 1 && dt.getUTCDate() === day;
}

export function timeToMinutes(timeStr: string) {
  const [h, m] = timeStr.split(":").map(Number);
  return h! * 60 + m!;
}

export function minutesToTime(total: number) {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Converte data + hora civis no fuso para o instante UTC correspondente. */
export function zonedToUtc(dateStr: string, timeStr: string, tz: string = SHOP_TZ): Date {
  const { year, month, day } = parseDateStr(dateStr);
  const [h, mi] = timeStr.split(":").map(Number);
  const guess = Date.UTC(year, month - 1, day, h!, mi!);
  let offset = tzOffsetMinutes(new Date(guess), tz);
  let result = guess - offset * 60000;
  // Segunda passada cobre transições de horário de verão.
  const offset2 = tzOffsetMinutes(new Date(result), tz);
  if (offset2 !== offset) {
    offset = offset2;
    result = guess - offset * 60000;
  }
  return new Date(result);
}

/** "YYYY-MM-DD" do instante no fuso. */
export function toDateStr(date: Date, tz: string = SHOP_TZ) {
  const p = getZonedParts(date, tz);
  return `${p.year}-${String(p.month).padStart(2, "0")}-${String(p.day).padStart(2, "0")}`;
}

/** "HH:mm" do instante no fuso. */
export function toTimeStr(date: Date, tz: string = SHOP_TZ) {
  const p = getZonedParts(date, tz);
  return minutesToTime(p.hour * 60 + p.minute);
}

export function todayStr(now: Date = new Date(), tz: string = SHOP_TZ) {
  return toDateStr(now, tz);
}

export function addDays(dateStr: string, days: number) {
  const { year, month, day } = parseDateStr(dateStr);
  const dt = new Date(Date.UTC(year, month - 1, day + days));
  return dt.toISOString().slice(0, 10);
}

/** Dia da semana (0 = domingo) de uma data civil. */
export function weekdayOf(dateStr: string) {
  const { year, month, day } = parseDateStr(dateStr);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

export function diffDays(fromDateStr: string, toDateStr_: string) {
  const a = parseDateStr(fromDateStr);
  const b = parseDateStr(toDateStr_);
  return Math.round((Date.UTC(b.year, b.month - 1, b.day) - Date.UTC(a.year, a.month - 1, a.day)) / 86400000);
}

/* ───────────── Formatação para exibição (pt-BR) ───────────── */

export function formatDateLong(date: Date, tz: string = SHOP_TZ) {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: tz,
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

export function formatDateShort(date: Date, tz: string = SHOP_TZ) {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: tz, day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}

export function formatDateTime(date: Date, tz: string = SHOP_TZ) {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: tz,
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/** Formata uma data civil ("YYYY-MM-DD") sem depender de fuso. */
export function formatDateStr(dateStr: string, opts: Intl.DateTimeFormatOptions = { weekday: "long", day: "numeric", month: "long" }) {
  const { year, month, day } = parseDateStr(dateStr);
  return new Intl.DateTimeFormat("pt-BR", { ...opts, timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, day, 12)));
}
