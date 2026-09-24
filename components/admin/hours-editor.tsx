"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormAlert } from "@/components/forms/form-alert";
import { WEEKDAYS } from "@/config/business";
import { apiFetch } from "@/lib/api-client";
import { businessHoursSchema } from "@/lib/validation/admin";
import { cn } from "@/lib/utils";
import type { BusinessHourDTO } from "@/types";

const ORDER = [1, 2, 3, 4, 5, 6, 0];

export function HoursEditor({ initial }: { initial: BusinessHourDTO[] }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [rows, setRows] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; variant: "success" | "error" } | null>(null);
  const [rowErrors, setRowErrors] = useState<Record<number, string>>({});

  const update = (day: number, patch: Partial<BusinessHourDTO>) =>
    setRows((rs) => rs.map((r) => (r.dayOfWeek === day ? { ...r, ...patch } : r)));

  const save = async () => {
    const parsed = businessHoursSchema.safeParse(rows);
    if (!parsed.success) {
      const errs: Record<number, string> = {};
      for (const issue of parsed.error.issues) {
        const idx = issue.path[0];
        if (typeof idx === "number" && !errs[rows[idx]!.dayOfWeek]) errs[rows[idx]!.dayOfWeek] = issue.message;
      }
      setRowErrors(errs);
      setMessage({ text: "Corrija os dias destacados.", variant: "error" });
      return;
    }
    setRowErrors({});
    setSaving(true);
    setMessage(null);
    try {
      await apiFetch("/api/admin/hours", { method: "PUT", json: { hours: rows } });
      setMessage({ text: "Horários salvos. O site e a agenda já usam os novos horários.", variant: "success" });
      startTransition(() => router.refresh());
    } catch (e) {
      setMessage({ text: e instanceof Error ? e.message : "Falha ao salvar.", variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border bg-card">
        {ORDER.map((day) => {
          const r = rows.find((x) => x.dayOfWeek === day)!;
          const hasBreak = r.breakStart !== null;
          return (
            <fieldset key={day} className={cn("grid gap-3 border-b p-4 last:border-0 md:grid-cols-[160px_1fr] md:items-center", rowErrors[day] && "bg-destructive/5")}>
              <legend className="sr-only">{WEEKDAYS[day]}</legend>
              <label className="flex items-center gap-3 font-medium">
                <input
                  type="checkbox"
                  checked={r.isOpen}
                  onChange={(e) => update(day, { isOpen: e.target.checked })}
                  className="size-5 accent-[hsl(var(--primary))]"
                />
                {WEEKDAYS[day]}
              </label>
              {r.isOpen ? (
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <Input aria-label={`Abertura ${WEEKDAYS[day]}`} type="time" step={900} value={r.openTime} onChange={(e) => update(day, { openTime: e.target.value })} className="h-10 w-32" />
                  <span className="text-muted-foreground">às</span>
                  <Input aria-label={`Fechamento ${WEEKDAYS[day]}`} type="time" step={900} value={r.closeTime} onChange={(e) => update(day, { closeTime: e.target.value })} className="h-10 w-32" />
                  <label className="ml-2 flex items-center gap-2 text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={hasBreak}
                      onChange={(e) =>
                        update(day, e.target.checked ? { breakStart: "12:00", breakEnd: "13:00" } : { breakStart: null, breakEnd: null })
                      }
                      className="size-4 accent-[hsl(var(--primary))]"
                    />
                    Pausa
                  </label>
                  {hasBreak && (
                    <>
                      <Input aria-label={`Início da pausa ${WEEKDAYS[day]}`} type="time" step={900} value={r.breakStart ?? ""} onChange={(e) => update(day, { breakStart: e.target.value })} className="h-10 w-32" />
                      <span className="text-muted-foreground">–</span>
                      <Input aria-label={`Fim da pausa ${WEEKDAYS[day]}`} type="time" step={900} value={r.breakEnd ?? ""} onChange={(e) => update(day, { breakEnd: e.target.value })} className="h-10 w-32" />
                    </>
                  )}
                  {rowErrors[day] && <p className="w-full text-xs text-destructive">{rowErrors[day]}</p>}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Fechado</p>
              )}
            </fieldset>
          );
        })}
      </div>
      <FormAlert message={message?.text} variant={message?.variant} />
      <Button onClick={save} loading={saving}>
        {!saving && <Save aria-hidden />} Salvar horários
      </Button>
    </div>
  );
}
