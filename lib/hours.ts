import { WEEKDAYS_SHORT } from "@/config/business";
import type { BusinessHourDTO } from "@/types";

export interface HoursGroup {
  label: string;
  value: string;
  isOpen: boolean;
}

function rowValue(h: BusinessHourDTO) {
  if (!h.isOpen) return "Fechado";
  const base = `${h.openTime} – ${h.closeTime}`;
  return h.breakStart && h.breakEnd ? `${h.openTime} – ${h.breakStart} · ${h.breakEnd} – ${h.closeTime}` : base;
}

/** Agrupa dias consecutivos com o mesmo horário: "Seg a Sex · 09:00 – 20:00". Começa na segunda. */
export function summarizeHours(hours: BusinessHourDTO[]): HoursGroup[] {
  const order = [1, 2, 3, 4, 5, 6, 0];
  const groups: { days: number[]; value: string; isOpen: boolean }[] = [];
  for (const d of order) {
    const h = hours.find((x) => x.dayOfWeek === d);
    if (!h) continue;
    const value = rowValue(h);
    const last = groups.at(-1);
    if (last && last.value === value) last.days.push(d);
    else groups.push({ days: [d], value, isOpen: h.isOpen });
  }
  return groups.map((g) => {
    const first: string = WEEKDAYS_SHORT[g.days[0]!]!;
    const lastDay: string = WEEKDAYS_SHORT[g.days.at(-1)!]!;
    const label = g.days.length === 1 ? first : g.days.length === 2 ? `${first} e ${lastDay}` : `${first} a ${lastDay}`;
    return { label, value: g.value, isOpen: g.isOpen };
  });
}

/** Formato schema.org: [{ dayOfWeek: [...], opens, closes }] */
export function toOpeningHoursSpecification(hours: BusinessHourDTO[]) {
  const names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return hours
    .filter((h) => h.isOpen)
    .map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${names[h.dayOfWeek]}`,
      opens: h.openTime,
      closes: h.closeTime,
    }));
}
