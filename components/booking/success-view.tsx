"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { m, useReducedMotion } from "framer-motion";
import { CalendarPlus, Check, Copy, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WhatsAppIcon } from "@/components/icons/brand-icons";
import { bookingContent } from "@/config/content";
import { businessConfig } from "@/config/business";
import { siteConfig } from "@/config/site";
import { STATUS_LABELS } from "@/lib/constants";
import { formatDuration, formatPrice, whatsappLink } from "@/lib/format";
import { buildIcs, downloadIcs } from "@/lib/ics";
import { DURATION, EASE_OUT } from "@/lib/motion";
import type { BookingPublicDTO } from "@/types";

export function SuccessView({ booking }: { booking: BookingPublicDTO }) {
  const reduced = useReducedMotion();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(booking.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard indisponível: o código segue visível para cópia manual */
    }
  };

  const addToCalendar = () =>
    downloadIcs(
      `reserva-${booking.code}.ics`,
      buildIcs({
        code: booking.code,
        title: `${booking.serviceName} — ${siteConfig.shortName}`,
        startAt: booking.startAt,
        endAt: booking.endAt,
        description: `Reserva ${booking.code} com ${booking.barberName}. Tolerância de atraso: ${businessConfig.lateToleranceMinutes} min.`,
      }),
    );

  const waMessage = `Olá! Acabei de agendar pelo site.\nCódigo: ${booking.code}\n${booking.serviceName} com ${booking.barberName}\n${booking.dateLabel} às ${booking.timeLabel}`;
  const confirmed = booking.status === "CONFIRMED";

  return (
    <div className="mx-auto max-w-xl text-center">
      {/* Confirmação curta: círculo + check (transform/opacity + traço SVG) */}
      <m.div
        initial={{ opacity: 0, scale: reduced ? 1 : 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: DURATION.slow, ease: EASE_OUT }}
        className="mx-auto flex size-20 items-center justify-center rounded-full bg-success/15 ring-1 ring-success/40"
        aria-hidden
      >
        <svg viewBox="0 0 24 24" className="size-10 text-success" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <m.path
            d="M5 12.5 10 17.5 19 7"
            initial={{ pathLength: reduced ? 1 : 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: DURATION.slow, ease: EASE_OUT, delay: 0.15 }}
          />
        </svg>
      </m.div>

      <m.div initial={{ opacity: 0, y: reduced ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DURATION.slow, ease: EASE_OUT, delay: 0.2 }}>
        <h2 ref={headingRef} tabIndex={-1} className="mt-6 text-4xl font-semibold uppercase outline-none">
          {bookingContent.successTitle}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          {confirmed ? bookingContent.successConfirmed : bookingContent.successPending}
        </p>

        <div className="mt-8 rounded-2xl border border-primary/40 bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Código da reserva</p>
          <div className="mt-2 flex items-center justify-center gap-3">
            <p className="font-display text-4xl font-semibold tracking-[0.12em] text-primary" aria-live="polite">
              {booking.code}
            </p>
            <Button type="button" variant="ghost" size="icon" onClick={copy} aria-label={copied ? "Código copiado" : "Copiar código"}>
              {copied ? <Check className="text-success" /> : <Copy />}
            </Button>
          </div>
          <Badge variant={confirmed ? "success" : "warning"} className="mt-3">
            {STATUS_LABELS[booking.status]}
          </Badge>

          <dl className="mt-6 grid gap-3 border-t pt-5 text-left text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs text-muted-foreground">Serviço</dt>
              <dd className="font-medium">
                {booking.serviceName} · {formatDuration(booking.durationMin)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Barbeiro</dt>
              <dd className="font-medium">{booking.barberName}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Quando</dt>
              <dd className="font-medium first-letter:uppercase">
                {booking.dateLabel}, às {booking.timeLabel}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Valor</dt>
              <dd className="font-medium">{formatPrice(booking.priceCents, booking.priceFrom)} · pago na barbearia</dd>
            </div>
          </dl>
        </div>

        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          <Button type="button" variant="outline" onClick={addToCalendar}>
            <CalendarPlus aria-hidden /> Adicionar à agenda
          </Button>
          <Button asChild variant="whatsapp">
            <a href={whatsappLink(waMessage)} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon /> Enviar no WhatsApp
            </a>
          </Button>
          <Button asChild variant="ghost" className="sm:col-span-2">
            <Link href={`/minha-reserva?codigo=${encodeURIComponent(booking.code)}`}>
              <Search aria-hidden /> Consultar ou cancelar depois
            </Link>
          </Button>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          Cancelamento online até {businessConfig.cancellation.minHoursBefore}h antes. Tolerância de atraso:{" "}
          {businessConfig.lateToleranceMinutes} minutos.
        </p>
      </m.div>
    </div>
  );
}
