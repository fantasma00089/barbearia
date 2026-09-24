"use client";

import { m, useReducedMotion } from "framer-motion";
import { CalendarX2, Moon, RefreshCw, Shuffle, Sun, Sunrise } from "lucide-react";
import { OptionCard } from "../option-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FormAlert } from "@/components/forms/form-alert";
import { WhatsAppIcon } from "@/components/icons/brand-icons";
import { bookingContent } from "@/config/content";
import { whatsappLink } from "@/lib/format";
import { DURATION, EASE_OUT, STAGGER } from "@/lib/motion";
import { formatDateStr, timeToMinutes } from "@/lib/time";
import type { AvailabilityResult, SlotDTO } from "@/types";

const PERIODS = [
  { key: "manha", label: "Manhã", icon: Sunrise, test: (m: number) => m < 12 * 60 },
  { key: "tarde", label: "Tarde", icon: Sun, test: (m: number) => m >= 12 * 60 && m < 18 * 60 },
  { key: "noite", label: "Noite", icon: Moon, test: (m: number) => m >= 18 * 60 },
] as const;

const REASON_TEXT: Record<string, string> = {
  closed: "A barbearia não abre nesta data.",
  past: "Esta data já passou.",
  too_far: "Ainda não abrimos a agenda para esta data.",
  no_barber: "Nenhum profissional realiza este serviço no momento.",
  full: bookingContent.noSlots,
};

export function TimeStep({
  data,
  loading,
  error,
  selected,
  onSelect,
  onRetry,
  onPickDate,
  onAnyBarber,
  isAnyBarber,
  conflictMessage,
}: {
  data: AvailabilityResult | null;
  loading: boolean;
  error: string | null;
  selected: string | null;
  onSelect: (time: string) => void;
  onRetry: () => void;
  onPickDate: (date: string) => void;
  onAnyBarber: () => void;
  isAnyBarber: boolean;
  conflictMessage: string | null;
}) {
  const reduced = useReducedMotion();

  if (loading || (!data && !error)) {
    return (
      <div role="status" aria-live="polite" className="space-y-6">
        <span className="sr-only">Buscando horários disponíveis…</span>
        {[0, 1].map((g) => (
          <div key={g} className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5 md:grid-cols-6">
              {Array.from({ length: 6 }, (_, i) => (
                <Skeleton key={i} className="h-12 rounded-xl" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <FormAlert message={error ?? "Não foi possível carregar os horários."}>
        <Button type="button" size="sm" variant="outline" onClick={onRetry}>
          <RefreshCw aria-hidden /> Tentar novamente
        </Button>
      </FormAlert>
    );
  }

  if (data.slots.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-6 text-center sm:p-10" role="status">
        <CalendarX2 className="mx-auto size-10 text-primary/70" aria-hidden />
        <p className="mt-4 font-semibold">Nenhum horário disponível</p>
        <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
          {REASON_TEXT[data.reason ?? "full"] ?? bookingContent.noSlots}
        </p>
        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          {data.nextAvailableDate && (
            <Button type="button" onClick={() => onPickDate(data.nextAvailableDate!)}>
              Ver {formatDateStr(data.nextAvailableDate, { weekday: "short", day: "numeric", month: "short" })}
            </Button>
          )}
          {!isAnyBarber && (
            <Button type="button" variant="outline" onClick={onAnyBarber}>
              <Shuffle aria-hidden /> Tentar sem preferência
            </Button>
          )}
          <Button asChild variant="ghost">
            <a href={whatsappLink("Olá! Não encontrei horário no site. Vocês têm algum encaixe?")} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon /> Pedir encaixe
            </a>
          </Button>
        </div>
      </div>
    );
  }

  const groups = PERIODS.map((p) => ({ ...p, slots: data.slots.filter((s) => p.test(timeToMinutes(s.time))) })).filter(
    (g) => g.slots.length,
  );

  let index = 0;
  const slotMotion = (slot: SlotDTO) => {
    const i = index++;
    return {
      initial: { opacity: 0, y: reduced ? 0 : 8 },
      animate: { opacity: 1, y: 0 },
      // Cascata só nos primeiros itens: nunca atrasa o uso da lista.
      transition: { duration: DURATION.base, ease: EASE_OUT, delay: Math.min(i, 10) * STAGGER.tight },
      key: slot.time,
    };
  };

  return (
    <div className="space-y-6">
      <FormAlert message={conflictMessage} />
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {data.slots.length} horários livres em <strong className="text-foreground">{formatDateStr(data.date)}</strong>.
      </p>
      <div role="radiogroup" aria-label="Horários disponíveis" className="space-y-6">
        {groups.map((g) => (
          <fieldset key={g.key}>
            <legend className="mb-3 flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <g.icon className="size-4 text-primary" aria-hidden />
              {g.label}
            </legend>
            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5 md:grid-cols-6">
              {g.slots.map((slot) => {
                const { key, ...motion } = slotMotion(slot);
                return (
                  <m.div key={key} {...motion}>
                    <OptionCard
                      name="time"
                      value={slot.time}
                      checked={selected === slot.time}
                      onSelect={onSelect}
                      indicator={false}
                      contentClassName="py-3 text-center font-display text-lg font-medium tabular-nums group-has-[:checked]:text-primary"
                    >
                      {slot.time}
                    </OptionCard>
                  </m.div>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>
    </div>
  );
}
