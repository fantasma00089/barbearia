"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { CalendarClock, CalendarDays, Clock, Scissors, Search, User, Wallet, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/forms/field";
import { FormAlert } from "@/components/forms/form-alert";
import { WhatsAppIcon } from "@/components/icons/brand-icons";
import { useSettings } from "@/components/providers/settings-provider";
import { ApiError, apiFetch, firstFieldErrors } from "@/lib/api-client";
import { STATUS_LABELS } from "@/lib/constants";
import { formatDateTime } from "@/lib/time";
import { formatDuration, formatPrice, maskPhone, whatsappLink } from "@/lib/format";
import { DURATION, EASE_OUT } from "@/lib/motion";
import { lookupBookingSchema, RESCHEDULE_PERIODS } from "@/lib/validation/booking";
import { flattenFieldErrors } from "@/lib/validation/errors";
import { cn } from "@/lib/utils";
import type { BookingPublicDTO, BookingStatus } from "@/types";

const STATUS_VARIANT: Record<BookingStatus, "success" | "warning" | "destructive" | "secondary"> = {
  PENDING: "warning",
  CONFIRMED: "success",
  CANCELLED: "destructive",
  COMPLETED: "secondary",
  NO_SHOW: "destructive",
};

const PERIOD_LABELS: Record<(typeof RESCHEDULE_PERIODS)[number], string> = {
  qualquer: "Qualquer horário",
  manha: "Manhã",
  tarde: "Tarde",
  noite: "Noite",
};

type Panel = "none" | "cancel" | "reschedule";

export function ReservationManager({ today }: { today: string }) {
  const params = useSearchParams();
  const reduced = useReducedMotion();
  const settings = useSettings();

  const [code, setCode] = useState(params.get("codigo") ?? "");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [booking, setBooking] = useState<BookingPublicDTO | null>(null);
  const [panel, setPanel] = useState<Panel>("none");

  const [cancelReason, setCancelReason] = useState("");
  const [prefDate, setPrefDate] = useState("");
  const [prefPeriod, setPrefPeriod] = useState<(typeof RESCHEDULE_PERIODS)[number]>("qualquer");
  const [prefNote, setPrefNote] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const lookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const parsed = lookupBookingSchema.safeParse({ code, phone });
    if (!parsed.success) {
      const fe = flattenFieldErrors(parsed.error);
      setErrors(fe);
      document.getElementById(Object.keys(fe)[0] === "phone" ? "lookup-phone" : "lookup-code")?.focus();
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const res = await apiFetch<{ booking: BookingPublicDTO }>("/api/bookings/lookup", { method: "POST", json: { code, phone } });
      setBooking(res.booking);
      setPanel("none");
    } catch (e) {
      setBooking(null);
      if (e instanceof ApiError && e.fieldErrors) setErrors(firstFieldErrors(e.fieldErrors));
      setError(e instanceof Error ? e.message : "Não foi possível consultar.");
    } finally {
      setLoading(false);
    }
  };

  const act = async (url: string, body: Record<string, unknown>, okMessage: string) => {
    setActionLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await apiFetch<{ booking: BookingPublicDTO }>(url, { method: "POST", json: { code: booking!.code, phone, ...body } });
      setBooking(res.booking);
      setPanel("none");
      setSuccess(okMessage);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível concluir.");
    } finally {
      setActionLoading(false);
    }
  };

  const fade = {
    initial: { opacity: 0, y: reduced ? 0 : 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0 },
    transition: { duration: DURATION.base, ease: EASE_OUT },
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[380px_minmax(0,1fr)] lg:gap-12">
      <form onSubmit={lookup} noValidate className="h-fit space-y-5 rounded-2xl border bg-card p-6" aria-labelledby="lookup-title">
        <h2 id="lookup-title" className="text-2xl font-semibold uppercase">
          Consultar reserva
        </h2>
        <Field id="lookup-code" label="Código da reserva" required error={errors.code} hint="Ex.: NA-7K3F9Q">
          {(p) => (
            <Input
              {...p}
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              placeholder="NA-XXXXXX"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="font-mono uppercase tracking-wider"
            />
          )}
        </Field>
        <Field id="lookup-phone" label="WhatsApp usado na reserva" required error={errors.phone}>
          {(p) => (
            <Input
              {...p}
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              placeholder="(69) 99999-0000"
              value={phone}
              onChange={(e) => setPhone(maskPhone(e.target.value))}
            />
          )}
        </Field>
        <Button type="submit" className="w-full" loading={loading}>
          {!loading && <Search aria-hidden />} {loading ? "Consultando…" : "Consultar"}
        </Button>
      </form>

      <div className="space-y-4">
        <FormAlert message={error} />
        <FormAlert message={success} variant="success" />

        <AnimatePresence mode="wait" initial={false}>
          {booking ? (
            <m.article key={booking.code + booking.status + String(booking.rescheduleRequested)} {...fade} className="rounded-2xl border bg-card" aria-label="Detalhes da reserva">
              <header className="flex flex-wrap items-center justify-between gap-3 border-b p-6">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Reserva</p>
                  <p className="font-display text-3xl font-semibold tracking-wider text-primary">{booking.code}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={STATUS_VARIANT[booking.status]}>{STATUS_LABELS[booking.status]}</Badge>
                  {booking.rescheduleRequested && <Badge variant="outline">Reagendamento solicitado</Badge>}
                </div>
              </header>

              <dl className="grid gap-5 p-6 sm:grid-cols-2">
                {[
                  { icon: Scissors, label: "Serviço", value: `${booking.serviceName} · ${formatDuration(booking.durationMin)}` },
                  { icon: User, label: "Barbeiro", value: booking.barberName },
                  { icon: CalendarDays, label: "Data", value: booking.dateLabel },
                  { icon: Clock, label: "Horário", value: booking.timeLabel },
                  { icon: Wallet, label: "Valor", value: `${formatPrice(booking.priceCents, booking.priceFrom)} (na barbearia)` },
                  { icon: User, label: "Cliente", value: booking.customerName },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex gap-3">
                    <Icon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                    <div>
                      <dt className="text-xs text-muted-foreground">{label}</dt>
                      <dd className="font-medium first-letter:uppercase">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>

              <footer className="space-y-4 border-t p-6">
                {booking.status === "CANCELLED" || booking.status === "COMPLETED" || booking.status === "NO_SHOW" ? (
                  <p className="text-sm text-muted-foreground">Esta reserva não está mais ativa.</p>
                ) : (
                  <>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant={panel === "reschedule" ? "secondary" : "outline"}
                        disabled={!booking.canRequestReschedule}
                        aria-expanded={panel === "reschedule"}
                        aria-controls="reschedule-panel"
                        onClick={() => setPanel(panel === "reschedule" ? "none" : "reschedule")}
                      >
                        <CalendarClock aria-hidden /> Solicitar reagendamento
                      </Button>
                      <Button
                        type="button"
                        variant={panel === "cancel" ? "secondary" : "outline"}
                        disabled={!booking.canCancel}
                        aria-expanded={panel === "cancel"}
                        aria-controls="cancel-panel"
                        onClick={() => setPanel(panel === "cancel" ? "none" : "cancel")}
                        className="hover:border-destructive/60 hover:text-destructive"
                      >
                        <XCircle aria-hidden /> Cancelar reserva
                      </Button>
                      <Button asChild variant="ghost">
                        <a
                          href={whatsappLink(settings.contact.whatsapp, `Olá! Sobre minha reserva ${booking.code} (${booking.dateLabel} às ${booking.timeLabel}).`)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <WhatsAppIcon /> Falar no WhatsApp
                        </a>
                      </Button>
                    </div>

                    {!booking.canCancel && (
                      <p className="text-xs text-muted-foreground">
                        O cancelamento online era permitido até {formatDateTime(new Date(booking.cancelDeadline))} (
                        {settings.booking.cancelMinHours}h antes). Para cancelar agora, fale com a gente pelo WhatsApp.
                      </p>
                    )}
                    {booking.rescheduleRequested && (
                      <p className="text-xs text-muted-foreground">
                        Recebemos seu pedido de reagendamento e vamos responder pelo WhatsApp. Seu horário atual continua reservado até lá.
                      </p>
                    )}

                    <AnimatePresence mode="wait" initial={false}>
                      {panel === "cancel" && (
                        <m.form
                          key="cancel"
                          id="cancel-panel"
                          {...fade}
                          onSubmit={(e) => {
                            e.preventDefault();
                            void act("/api/bookings/cancel", { reason: cancelReason }, "Reserva cancelada. Esperamos te ver em breve!");
                          }}
                          className="space-y-4 rounded-xl border border-destructive/30 bg-destructive/5 p-5"
                        >
                          <p className="text-sm font-medium">Tem certeza que deseja cancelar? Esta ação não pode ser desfeita.</p>
                          <Field id="cancel-reason" label="Motivo" optional>
                            {(p) => (
                              <Input {...p} maxLength={200} value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} placeholder="Ex.: imprevisto no trabalho" />
                            )}
                          </Field>
                          <div className="flex flex-wrap gap-2">
                            <Button type="submit" variant="destructive" loading={actionLoading}>
                              Sim, cancelar
                            </Button>
                            <Button type="button" variant="ghost" onClick={() => setPanel("none")}>
                              Manter reserva
                            </Button>
                          </div>
                        </m.form>
                      )}

                      {panel === "reschedule" && (
                        <m.form
                          key="reschedule"
                          id="reschedule-panel"
                          {...fade}
                          onSubmit={(e) => {
                            e.preventDefault();
                            void act(
                              "/api/bookings/reschedule",
                              { preferredDate: prefDate, preferredPeriod: prefPeriod, note: prefNote },
                              "Pedido de reagendamento enviado! Vamos confirmar o novo horário pelo WhatsApp.",
                            );
                          }}
                          className="space-y-4 rounded-xl border border-primary/30 bg-primary/5 p-5"
                        >
                          <p className="text-sm text-muted-foreground">
                            Diga sua preferência e confirmaremos a nova data pelo WhatsApp. Seu horário atual segue reservado até a confirmação.
                          </p>
                          <Field id="pref-date" label="Nova data preferida" optional>
                            {(p) => <Input {...p} type="date" min={today} value={prefDate} onChange={(e) => setPrefDate(e.target.value)} />}
                          </Field>
                          <fieldset>
                            <legend className="mb-2 text-sm font-medium">Período</legend>
                            <div className="flex flex-wrap gap-2">
                              {RESCHEDULE_PERIODS.map((p) => (
                                <label key={p} className="cursor-pointer">
                                  <input
                                    type="radio"
                                    name="period"
                                    value={p}
                                    checked={prefPeriod === p}
                                    onChange={() => setPrefPeriod(p)}
                                    className="peer sr-only"
                                  />
                                  <span
                                    className={cn(
                                      "inline-flex rounded-full border px-3 py-1.5 text-sm transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-ring",
                                      prefPeriod === p ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary/60",
                                    )}
                                  >
                                    {PERIOD_LABELS[p]}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </fieldset>
                          <Field id="pref-note" label="Observação" optional>
                            {(p) => <Textarea {...p} maxLength={200} value={prefNote} onChange={(e) => setPrefNote(e.target.value)} className="min-h-20" />}
                          </Field>
                          <div className="flex flex-wrap gap-2">
                            <Button type="submit" loading={actionLoading}>
                              Enviar solicitação
                            </Button>
                            <Button type="button" variant="ghost" onClick={() => setPanel("none")}>
                              Voltar
                            </Button>
                          </div>
                        </m.form>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </footer>
            </m.article>
          ) : (
            <m.div key="empty" {...fade} className="flex h-full min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center">
              <Search className="size-10 text-primary/60" aria-hidden />
              <p className="mt-4 font-medium">Encontre sua reserva</p>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Use o código recebido ao agendar e o mesmo WhatsApp informado. Por segurança, os dois precisam conferir.
              </p>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
