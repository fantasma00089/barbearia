"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Ban, Check, CheckCheck, ChevronLeft, ChevronRight, CalendarClock, StickyNote, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FormAlert } from "@/components/forms/form-alert";
import { WhatsAppIcon } from "@/components/icons/brand-icons";
import { siteConfig } from "@/config/site";
import { apiFetch } from "@/lib/api-client";
import { STATUS_LABELS } from "@/lib/constants";
import { customerWhatsappLink, formatPhone, formatPrice } from "@/lib/format";
import { addDays, formatDateStr, formatDateTime, toTimeStr } from "@/lib/time";
import { cn } from "@/lib/utils";
import type { AdminBookingDTO, BookingStatus } from "@/types";

const STATUS_FILTERS = [
  { value: "ACTIVE", label: "Ativas" },
  { value: "PENDING", label: "Pendentes" },
  { value: "CONFIRMED", label: "Confirmadas" },
  { value: "RESCHEDULE", label: "Reagendar" },
  { value: "CANCELLED", label: "Canceladas" },
  { value: "COMPLETED", label: "Concluídas" },
  { value: "NO_SHOW", label: "Faltas" },
  { value: "ALL", label: "Todas" },
];

const STATUS_VARIANT: Record<BookingStatus, "success" | "warning" | "destructive" | "secondary"> = {
  PENDING: "warning",
  CONFIRMED: "success",
  CANCELLED: "destructive",
  COMPLETED: "secondary",
  NO_SHOW: "destructive",
};

interface Props {
  bookings: AdminBookingDTO[];
  barbers: { id: string; name: string }[];
  filters: { date: string | null; status: string; barberId: string | null };
  today: string;
}

export function BookingsBoard({ bookings, barbers, filters, today }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const setFilter = (patch: Partial<Props["filters"]>) => {
    const next = { ...filters, ...patch };
    const qs = new URLSearchParams();
    qs.set("date", next.date ?? "all");
    if (next.status !== "ACTIVE") qs.set("status", next.status);
    if (next.barberId) qs.set("barberId", next.barberId);
    startTransition(() => router.push(`${pathname}?${qs}`));
  };

  const act = async (b: AdminBookingDTO, action: string) => {
    if (action === "cancel" && !window.confirm(`Cancelar a reserva ${b.code} de ${b.customerName}?`)) return;
    setBusyId(b.id);
    setError(null);
    try {
      await apiFetch(`/api/admin/bookings/${b.id}`, { method: "PATCH", json: { action } });
      startTransition(() => router.refresh());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao atualizar.");
    } finally {
      setBusyId(null);
    }
  };

  const confirmMessage = (b: AdminBookingDTO) =>
    `Olá, ${b.customerName.split(" ")[0]}! Sua reserva ${b.code} na ${siteConfig.shortName} está confirmada: ${b.serviceName} com ${b.barberName}, ${b.dateLabel} às ${b.timeLabel}. Até lá!`;

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 lg:flex-row lg:items-end">
        <div className="flex items-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Dia anterior"
            onClick={() => setFilter({ date: addDays(filters.date ?? today, -1) })}
          >
            <ChevronLeft />
          </Button>
          <div className="space-y-1.5">
            <label htmlFor="f-date" className="text-xs font-medium text-muted-foreground">
              Data
            </label>
            <Input
              id="f-date"
              type="date"
              value={filters.date ?? ""}
              onChange={(e) => setFilter({ date: e.target.value || null })}
              className="h-10 w-44"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Próximo dia"
            onClick={() => setFilter({ date: addDays(filters.date ?? today, 1) })}
          >
            <ChevronRight />
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => setFilter({ date: today })}>
            Hoje
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => setFilter({ date: null })}>
            Todas as datas
          </Button>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="f-barber" className="text-xs font-medium text-muted-foreground">
            Barbeiro
          </label>
          <select
            id="f-barber"
            value={filters.barberId ?? ""}
            onChange={(e) => setFilter({ barberId: e.target.value || null })}
            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm lg:w-48"
          >
            <option value="">Todos</option>
            {barbers.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div role="group" aria-label="Filtrar por status" className="scrollbar-none flex gap-2 overflow-x-auto">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s.value}
            type="button"
            aria-pressed={filters.status === s.value}
            onClick={() => setFilter({ status: s.value })}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 text-sm transition-colors",
              filters.status === s.value ? "border-primary bg-primary text-primary-foreground" : "text-muted-foreground hover:border-primary/60",
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <FormAlert message={error} />

      <div className={cn("space-y-3 transition-opacity", pending && "opacity-60")} aria-busy={pending}>
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {bookings.length} reserva(s){filters.date ? ` em ${formatDateStr(filters.date)}` : ""}.
        </p>

        {bookings.length === 0 && (
          <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">Nenhuma reserva encontrada com esses filtros.</div>
        )}

        {bookings.map((b) => (
          <article key={b.id} className="rounded-xl border bg-card p-4 sm:p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start">
              <div className="w-28 shrink-0">
                <p className="font-display text-2xl font-semibold tabular-nums">
                  {b.timeLabel}
                  <span className="text-base text-muted-foreground">–{toTimeStr(new Date(b.endAt))}</span>
                </p>
                {!filters.date && <p className="text-xs capitalize text-muted-foreground">{b.dateLabel}</p>}
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{b.customerName}</p>
                  <Badge variant={STATUS_VARIANT[b.status]}>{STATUS_LABELS[b.status]}</Badge>
                  {b.rescheduleRequested && (
                    <Badge variant="outline" className="border-primary/50 text-primary">
                      <CalendarClock className="size-3" aria-hidden /> Reagendamento
                    </Badge>
                  )}
                  <span className="font-mono text-xs text-muted-foreground">{b.code}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {b.serviceName} · {b.barberName}
                  {b.anyBarber && " (sem preferência)"} · {formatPrice(b.priceCents, b.priceFrom)}
                </p>
                <a
                  href={customerWhatsappLink(b.customerPhone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
                >
                  <WhatsAppIcon className="size-3.5" /> {formatPhone(b.customerPhone)}
                </a>
                {b.notes && (
                  <p className="flex gap-1.5 text-sm">
                    <StickyNote className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden /> {b.notes}
                  </p>
                )}
                {b.rescheduleRequested && b.rescheduleNote && (
                  <p className="rounded-md bg-primary/10 px-3 py-2 text-sm">Pedido de reagendamento: {b.rescheduleNote}</p>
                )}
                {b.status === "CANCELLED" && (
                  <p className="text-xs text-muted-foreground">
                    Cancelada por {b.cancelledBy === "CUSTOMER" ? "cliente" : "barbearia"}
                    {b.cancelReason ? ` — “${b.cancelReason}”` : ""}
                  </p>
                )}
                <p className="text-[11px] text-muted-foreground/70">Criada em {formatDateTime(new Date(b.createdAt))}</p>
              </div>

              <div className="flex flex-wrap gap-2 md:max-w-[280px] md:justify-end">
                {b.status === "PENDING" && (
                  <>
                    <Button size="sm" loading={busyId === b.id} onClick={() => act(b, "confirm")}>
                      <Check aria-hidden /> Confirmar
                    </Button>
                    <Button asChild size="sm" variant="whatsapp">
                      <a href={customerWhatsappLink(b.customerPhone, confirmMessage(b))} target="_blank" rel="noopener noreferrer">
                        <WhatsAppIcon /> Avisar
                      </a>
                    </Button>
                  </>
                )}
                {b.status === "CONFIRMED" && (
                  <>
                    <Button size="sm" variant="outline" disabled={busyId === b.id} onClick={() => act(b, "complete")}>
                      <CheckCheck aria-hidden /> Concluir
                    </Button>
                    <Button size="sm" variant="outline" disabled={busyId === b.id} onClick={() => act(b, "no_show")}>
                      <UserX aria-hidden /> Faltou
                    </Button>
                  </>
                )}
                {b.rescheduleRequested && (b.status === "PENDING" || b.status === "CONFIRMED") && (
                  <Button size="sm" variant="ghost" disabled={busyId === b.id} onClick={() => act(b, "clear_reschedule")}>
                    Reagendamento tratado
                  </Button>
                )}
                {(b.status === "PENDING" || b.status === "CONFIRMED") && (
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={busyId === b.id}
                    onClick={() => act(b, "cancel")}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Ban aria-hidden /> Cancelar
                  </Button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
