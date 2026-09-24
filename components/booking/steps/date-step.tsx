"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { OptionCard } from "../option-card";
import { Button } from "@/components/ui/button";
import { addDays, formatDateStr, weekdayOf } from "@/lib/time";
import { WEEKDAYS_SHORT } from "@/config/business";
import type { BusinessHourDTO } from "@/types";

const INITIAL_DAYS = 14;

export function DateStep({
  today,
  maxAdvanceDays,
  hours,
  selected,
  onSelect,
}: {
  today: string;
  maxAdvanceDays: number;
  hours: BusinessHourDTO[];
  selected: string | null;
  onSelect: (date: string) => void;
}) {
  const [expanded, setExpanded] = useState(() => {
    if (!selected) return false;
    return Math.round((Date.parse(selected) - Date.parse(today)) / 86400000) >= INITIAL_DAYS;
  });

  const days = useMemo(
    () =>
      Array.from({ length: maxAdvanceDays + 1 }, (_, i) => {
        const date = addDays(today, i);
        const wd = weekdayOf(date);
        return { date, wd, open: hours[wd]?.isOpen ?? false, i };
      }),
    [today, maxAdvanceDays, hours],
  );
  const visible = expanded ? days : days.slice(0, INITIAL_DAYS);

  return (
    <div className="space-y-4">
      <div role="radiogroup" aria-label="Datas disponíveis" className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-7">
        {visible.map(({ date, wd, open, i }) => {
          const label = i === 0 ? "Hoje" : i === 1 ? "Amanhã" : WEEKDAYS_SHORT[wd];
          return (
            <OptionCard
              key={date}
              name="date"
              value={date}
              checked={selected === date}
              onSelect={onSelect}
              disabled={!open}
              indicator={false}
              contentClassName="flex flex-col items-center gap-0.5 px-2 py-3 text-center"
            >
              <span aria-hidden className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground group-has-[:checked]:text-primary">
                {label}
              </span>
              <span aria-hidden className="font-display text-2xl font-semibold leading-none">{date.slice(8)}</span>
              <span aria-hidden className="text-[11px] text-muted-foreground">
                {open ? formatDateStr(date, { month: "short" }).replace(".", "") : "Fechado"}
              </span>
              <span className="sr-only">{i < 2 ? `${label}, ` : ""}{formatDateStr(date)}{open ? "" : " — fechado"}</span>
            </OptionCard>
          );
        })}
      </div>
      {!expanded && days.length > INITIAL_DAYS && (
        <Button type="button" variant="ghost" size="sm" onClick={() => setExpanded(true)}>
          <ChevronDown aria-hidden /> Mostrar mais datas
        </Button>
      )}
    </div>
  );
}
