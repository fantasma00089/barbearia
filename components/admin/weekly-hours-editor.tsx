"use client";

import { Input } from "@/components/ui/input";
import { WEEKDAYS } from "@/config/business";
import { cn } from "@/lib/utils";
import type { BusinessHourDTO } from "@/types";

const ORDER = [1, 2, 3, 4, 5, 6, 0];
type Mode = "shop" | "custom" | "off";

/**
 * Horário próprio de um barbeiro por dia: segue a barbearia, horário próprio ou folga.
 * `value` contém só os dias que NÃO seguem a barbearia.
 */
export function WeeklyHoursEditor({
  value,
  onChange,
  shopHours,
  error,
}: {
  value: BusinessHourDTO[];
  onChange: (v: BusinessHourDTO[]) => void;
  shopHours: BusinessHourDTO[];
  error?: string;
}) {
  const modeOf = (day: number): Mode => {
    const h = value.find((x) => x.dayOfWeek === day);
    return !h ? "shop" : h.isOpen ? "custom" : "off";
  };
  const setDay = (day: number, row: BusinessHourDTO | null) =>
    onChange([...value.filter((x) => x.dayOfWeek !== day), ...(row ? [row] : [])].sort((a, b) => a.dayOfWeek - b.dayOfWeek));

  const setMode = (day: number, mode: Mode) => {
    const shop = shopHours[day]!;
    if (mode === "shop") setDay(day, null);
    else if (mode === "off") setDay(day, { ...shop, dayOfWeek: day, isOpen: false });
    else
      setDay(day, {
        dayOfWeek: day,
        isOpen: true,
        openTime: shop.isOpen ? shop.openTime : "09:00",
        closeTime: shop.isOpen ? shop.closeTime : "18:00",
        breakStart: shop.breakStart,
        breakEnd: shop.breakEnd,
      });
  };

  return (
    <div className="space-y-2">
      <div className="overflow-hidden rounded-xl border">
        {ORDER.map((day) => {
          const mode = modeOf(day);
          const shop = shopHours[day]!;
          const row = value.find((x) => x.dayOfWeek === day);
          return (
            <fieldset key={day} className="grid gap-3 border-b p-3 last:border-0 md:grid-cols-[150px_220px_1fr] md:items-center">
              <legend className="sr-only">{WEEKDAYS[day]}</legend>
              <span className="text-sm font-medium">{WEEKDAYS[day]}</span>
              <select
                aria-label={`Modo de ${WEEKDAYS[day]}`}
                value={mode}
                onChange={(e) => setMode(day, e.target.value as Mode)}
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
              >
                <option value="shop">Horário da barbearia</option>
                <option value="custom">Horário próprio</option>
                <option value="off">Folga</option>
              </select>
              {mode === "shop" && (
                <p className="text-sm text-muted-foreground">
                  {shop.isOpen ? `${shop.openTime} – ${shop.closeTime}${shop.breakStart ? ` (pausa ${shop.breakStart}–${shop.breakEnd})` : ""}` : "Barbearia fechada"}
                </p>
              )}
              {mode === "off" && <p className="text-sm text-muted-foreground">Não atende neste dia</p>}
              {mode === "custom" && row && (
                <div className={cn("flex flex-wrap items-center gap-2 text-sm")}>
                  <Input aria-label={`Início ${WEEKDAYS[day]}`} type="time" step={900} value={row.openTime} onChange={(e) => setDay(day, { ...row, openTime: e.target.value })} className="h-10 w-28" />
                  <span className="text-muted-foreground">às</span>
                  <Input aria-label={`Fim ${WEEKDAYS[day]}`} type="time" step={900} value={row.closeTime} onChange={(e) => setDay(day, { ...row, closeTime: e.target.value })} className="h-10 w-28" />
                  <label className="ml-1 flex items-center gap-1.5 text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={row.breakStart !== null}
                      onChange={(e) => setDay(day, { ...row, breakStart: e.target.checked ? "12:00" : null, breakEnd: e.target.checked ? "13:00" : null })}
                      className="size-4 accent-[hsl(var(--primary))]"
                    />
                    Pausa
                  </label>
                  {row.breakStart !== null && (
                    <>
                      <Input aria-label={`Início da pausa ${WEEKDAYS[day]}`} type="time" step={900} value={row.breakStart ?? ""} onChange={(e) => setDay(day, { ...row, breakStart: e.target.value })} className="h-10 w-28" />
                      <span className="text-muted-foreground">–</span>
                      <Input aria-label={`Fim da pausa ${WEEKDAYS[day]}`} type="time" step={900} value={row.breakEnd ?? ""} onChange={(e) => setDay(day, { ...row, breakEnd: e.target.value })} className="h-10 w-28" />
                    </>
                  )}
                </div>
              )}
            </fieldset>
          );
        })}
      </div>
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}
