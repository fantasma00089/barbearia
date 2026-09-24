"use client";

import { Clock, X } from "lucide-react";
import { OptionCard } from "../option-card";
import { CategoryIcon } from "@/components/services/category-icon";
import { CATEGORY_LABELS } from "@/lib/constants";
import { formatDuration, formatPrice } from "@/lib/format";
import { SERVICE_CATEGORIES, type BarberDTO, type ServiceDTO } from "@/types";

export function ServiceStep({
  services,
  selectedId,
  onSelect,
  barber,
  onClearBarber,
}: {
  services: ServiceDTO[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  barber: BarberDTO | null;
  onClearBarber: () => void;
}) {
  const visible = barber ? services.filter((s) => barber.serviceIds.includes(s.id)) : services;

  return (
    <div role="radiogroup" aria-label="Serviços" className="space-y-8">
      {barber && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm">
          <span>
            Mostrando serviços de <strong>{barber.nickname ?? barber.name}</strong>.
          </span>
          <button
            type="button"
            onClick={onClearBarber}
            className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline"
          >
            <X className="size-3.5" aria-hidden /> Ver todos os serviços
          </button>
        </div>
      )}

      {SERVICE_CATEGORIES.map((cat) => {
        const items = visible.filter((s) => s.category === cat);
        if (!items.length) return null;
        return (
          <fieldset key={cat}>
            <legend className="mb-3 flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <CategoryIcon category={cat} className="size-4 text-primary" />
              {CATEGORY_LABELS[cat]}
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {items.map((s) => (
                <OptionCard key={s.id} name="service" value={s.id} checked={selectedId === s.id} onSelect={onSelect}>
                  <div className="pr-8">
                    <p className="font-semibold">{s.name}</p>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{s.description}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="size-3.5" aria-hidden />
                      {formatDuration(s.durationMin)}
                    </span>
                    <span className="font-semibold text-primary">{formatPrice(s.priceCents, s.priceFrom)}</span>
                  </div>
                </OptionCard>
              ))}
            </div>
          </fieldset>
        );
      })}
    </div>
  );
}
