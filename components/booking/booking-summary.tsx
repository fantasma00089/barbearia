import { CalendarDays, Clock, Scissors, User, Wallet } from "lucide-react";
import { bookingContent } from "@/config/content";
import { formatDuration, formatPrice } from "@/lib/format";
import { formatDateStr } from "@/lib/time";
import { cn } from "@/lib/utils";
import type { BarberDTO, ServiceDTO } from "@/types";

export interface SummaryData {
  service: ServiceDTO | null;
  barber: BarberDTO | null;
  anyBarber: boolean;
  date: string | null;
  time: string | null;
}

/** Lista das escolhas. `onEdit` transforma cada item em atalho para a etapa. */
export function BookingSummary({
  data,
  onEdit,
  className,
}: {
  data: SummaryData;
  onEdit?: (step: number) => void;
  className?: string;
}) {
  const rows = [
    { step: 0, icon: Scissors, label: "Serviço", value: data.service?.name },
    {
      step: 1,
      icon: User,
      label: "Barbeiro",
      value: data.anyBarber ? `${bookingContent.anyBarberLabel} (primeiro disponível)` : data.barber?.name,
    },
    { step: 2, icon: CalendarDays, label: "Data", value: data.date ? formatDateStr(data.date) : undefined },
    {
      step: 3,
      icon: Clock,
      label: "Horário",
      value: data.time && data.service ? `${data.time} · ${formatDuration(data.service.durationMin)}` : data.time ?? undefined,
    },
    {
      step: -1,
      icon: Wallet,
      label: "Valor",
      value: data.service ? formatPrice(data.service.priceCents, data.service.priceFrom) : undefined,
    },
  ];

  return (
    <ul className={cn("divide-y", className)}>
      {rows.map(({ step, icon: Icon, label, value }) => (
        <li key={label} className="flex items-start gap-3 py-3">
          <Icon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
          <div className="min-w-0 flex-1">
            <span className="block text-xs text-muted-foreground">{label}</span>
            <span className={cn("block text-sm font-medium first-letter:uppercase", !value && "text-muted-foreground/60")}>
              {value ?? "—"}
            </span>
          </div>
          {onEdit && step >= 0 && value && (
            <button
              type="button"
              onClick={() => onEdit(step)}
              className="rounded text-xs font-medium text-primary underline-offset-4 hover:underline"
            >
              Alterar<span className="sr-only"> {label.toLowerCase()}</span>
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
