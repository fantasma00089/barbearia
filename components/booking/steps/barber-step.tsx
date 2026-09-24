"use client";

import { Shuffle, Star } from "lucide-react";
import { OptionCard } from "../option-card";
import { SmartImage } from "@/components/shared/smart-image";
import { bookingContent } from "@/config/content";
import { ANY_BARBER } from "@/lib/constants";
import type { BarberDTO } from "@/types";

export function BarberStep({
  barbers,
  selectedId,
  onSelect,
  serviceName,
}: {
  barbers: BarberDTO[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  serviceName: string;
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Profissionais que realizam <strong className="text-foreground">{serviceName}</strong>:
      </p>
      <div role="radiogroup" aria-label="Barbeiros" className="grid gap-3 sm:grid-cols-2">
        <OptionCard name="barber" value={ANY_BARBER} checked={selectedId === ANY_BARBER} onSelect={onSelect} className="sm:col-span-2">
          <div className="flex items-center gap-4 pr-8">
            <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-full border border-dashed border-primary/50 bg-primary/10 text-primary">
              <Shuffle className="size-6" aria-hidden />
            </span>
            <span>
              <span className="block font-semibold">{bookingContent.anyBarberLabel}</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">{bookingContent.anyBarberDescription}</span>
            </span>
          </div>
        </OptionCard>

        {barbers.map((b) => (
          <OptionCard key={b.id} name="barber" value={b.id} checked={selectedId === b.id} onSelect={onSelect}>
            <div className="flex items-center gap-4 pr-8">
              <span className="relative size-14 shrink-0 overflow-hidden rounded-full border bg-muted">
                <SmartImage src={b.photo} alt="" fill sizes="56px" className="object-cover" />
              </span>
              <span className="min-w-0">
                <span className="block font-semibold">
                  {b.name}
                  {b.nickname && <span className="font-normal text-muted-foreground"> · {b.nickname}</span>}
                </span>
                <span className="mt-0.5 block truncate text-xs text-muted-foreground">{b.specialty}</span>
                <span className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="size-3 fill-primary text-primary" aria-hidden />
                  {b.rating.toFixed(1).replace(".", ",")} · {b.yearsExperience} {b.yearsExperience === 1 ? "ano" : "anos"} de experiência
                </span>
              </span>
            </div>
          </OptionCard>
        ))}
      </div>
    </div>
  );
}
