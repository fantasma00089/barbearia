import type { BusinessHourDTO } from "@/types";

/** Horário efetivo (versão sem dependências de servidor, para o front). */
export function effectiveHours(shop: BusinessHourDTO[], custom: BusinessHourDTO[], weekday: number) {
  return custom.find((h) => h.dayOfWeek === weekday) ?? shop[weekday];
}
