"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, m, useReducedMotion, type Variants } from "framer-motion";
import { ArrowLeft, ArrowRight, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormAlert } from "@/components/forms/form-alert";
import { StepIndicator } from "./step-indicator";
import { BookingSummary } from "./booking-summary";
import { SuccessView } from "./success-view";
import { useAvailability } from "./use-availability";
import { ServiceStep } from "./steps/service-step";
import { BarberStep } from "./steps/barber-step";
import { DateStep } from "./steps/date-step";
import { TimeStep } from "./steps/time-step";
import { CustomerStep, type CustomerData } from "./steps/customer-step";
import { useSettings } from "@/components/providers/settings-provider";
import { ApiError, apiFetch, firstFieldErrors } from "@/lib/api-client";
import { ANY_BARBER } from "@/lib/constants";
import { formatDateStr } from "@/lib/time";
import { DURATION, EASE_OUT } from "@/lib/motion";
import { customerSchema } from "@/lib/validation/booking";
import { flattenFieldErrors } from "@/lib/validation/errors";
import type { BarberDTO, BookingPublicDTO, BusinessHourDTO, ServiceDTO } from "@/types";

const STEP_COPY = [
  { title: "Escolha o serviço", description: "O que vamos fazer hoje?" },
  { title: "Escolha o barbeiro", description: "Tem um preferido? Ou deixe com a gente." },
  { title: "Escolha a data", description: "Dias sem atendimento aparecem como indisponíveis." },
  { title: "Escolha o horário", description: "Horários de Porto Velho (UTC−4), já considerando a duração do serviço." },
  { title: "Seus dados", description: "Sem cadastro. Só o necessário para confirmar seu horário." },
  { title: "Revise e confirme", description: "Confira tudo antes de confirmar." },
] as const;

const SUCCESS_STEP = 6;

export interface BookingWizardProps {
  services: ServiceDTO[];
  barbers: BarberDTO[];
  hours: BusinessHourDTO[];
  today: string;
  maxAdvanceDays: number;
  initial: { serviceId: string | null; barberId: string | null; step: number };
}

export function BookingWizard({ services, barbers, hours, today, maxAdvanceDays, initial }: BookingWizardProps) {
  const reduced = useReducedMotion();
  const settings = useSettings();
  const topRef = useRef<HTMLDivElement | HTMLFormElement | null>(null);
  const shouldFocus = useRef(false);

  const [step, setStep] = useState(initial.step);
  const [dir, setDir] = useState(1);
  const [maxReached, setMaxReached] = useState(initial.step);

  const [serviceId, setServiceId] = useState<string | null>(initial.serviceId);
  const [barberId, setBarberId] = useState<string | null>(initial.barberId);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [customer, setCustomer] = useState<CustomerData>({ name: "", phone: "", notes: "" });
  const [customerErrors, setCustomerErrors] = useState<Record<string, string>>({});
  const [accept, setAccept] = useState(false);
  const [acceptError, setAcceptError] = useState<string | null>(null);
  const [website, setWebsite] = useState(""); // honeypot

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [conflict, setConflict] = useState<string | null>(null);
  const [stepError, setStepError] = useState<string | null>(null);
  const [result, setResult] = useState<BookingPublicDTO | null>(null);

  const service = services.find((s) => s.id === serviceId) ?? null;
  const barber = barberId && barberId !== ANY_BARBER ? (barbers.find((b) => b.id === barberId) ?? null) : null;
  const eligibleBarbers = useMemo(
    () => (service ? barbers.filter((b) => b.serviceIds.includes(service.id)) : barbers),
    [barbers, service],
  );

  const availability = useAvailability(serviceId, barberId, date, step === 3);
  const slotValid = Boolean(time && availability.data?.slots.some((s) => s.time === time));

  const canContinue = [Boolean(service), Boolean(barberId), Boolean(date), slotValid, true, true][step] ?? false;

  const goTo = useCallback(
    (next: number) => {
      setDir(next > step ? 1 : -1);
      setStep(next);
      setMaxReached((m) => Math.max(m, next));
      setStepError(null);
      shouldFocus.current = true;
      const top = topRef.current?.getBoundingClientRect().top ?? 0;
      if (top < 0) topRef.current?.scrollIntoView({ block: "start", behavior: reduced ? "auto" : "smooth" });
    },
    [step, reduced],
  );

  /** Foca o título da etapa assim que ela monta (leitores de tela e teclado). */
  const headingRef = useCallback((el: HTMLHeadingElement | null) => {
    if (el && shouldFocus.current) {
      shouldFocus.current = false;
      el.focus({ preventScroll: true });
    }
  }, []);

  /* ── Seleções ── */
  // Mudar uma escolha invalida o horário: as etapas seguintes precisam ser refeitas.
  const invalidateFrom = (s: number) => setMaxReached((m) => Math.min(m, s));

  const selectService = (id: string) => {
    if (id === serviceId) return;
    setServiceId(id);
    if (barberId && barberId !== ANY_BARBER && !barbers.find((b) => b.id === barberId)?.serviceIds.includes(id)) {
      setBarberId(null);
      invalidateFrom(1);
    } else invalidateFrom(3);
    setTime(null);
  };
  const selectBarber = (id: string) => {
    if (id === barberId) return;
    setBarberId(id);
    setTime(null);
    setConflict(null);
    invalidateFrom(3);
  };
  const selectDate = (d: string) => {
    if (d === date) return;
    setDate(d);
    setTime(null);
    setConflict(null);
    invalidateFrom(3);
  };

  /* ── Avançar ── */
  const validateCustomer = () => {
    const parsed = customerSchema.safeParse(customer);
    if (!parsed.success) {
      setCustomerErrors(flattenFieldErrors(parsed.error));
      const first = Object.keys(flattenFieldErrors(parsed.error))[0];
      if (first) document.getElementById(first)?.focus();
      return false;
    }
    setCustomerErrors({});
    return true;
  };

  const submit = async () => {
    // Garantia extra: todas as escolhas precisam estar completas antes de enviar.
    const missing = !serviceId ? 0 : !barberId ? 1 : !date ? 2 : !time ? 3 : null;
    if (missing !== null) {
      goTo(missing);
      setStepError("Falta completar uma etapa antes de confirmar.");
      return;
    }
    if (!validateCustomer()) {
      goTo(4);
      return;
    }
    if (!accept) {
      setAcceptError("Para confirmar, aceite os Termos de Uso e a Política de Privacidade.");
      document.getElementById("accept")?.focus();
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const { booking } = await apiFetch<{ booking: BookingPublicDTO }>("/api/bookings", {
        method: "POST",
        json: { serviceId, barberId, date, time, ...customer, acceptTerms: true, website },
      });
      setResult(booking);
      setDir(1);
      setStep(SUCCESS_STEP);
      topRef.current?.scrollIntoView({ block: "start", behavior: reduced ? "auto" : "smooth" });
    } catch (e) {
      if (e instanceof ApiError && e.status === 409) {
        setConflict(e.message);
        setTime(null);
        availability.reload();
        goTo(3);
      } else if (e instanceof ApiError && e.fieldErrors && (e.fieldErrors.name || e.fieldErrors.phone || e.fieldErrors.notes)) {
        setCustomerErrors(firstFieldErrors(e.fieldErrors));
        goTo(4);
      } else {
        setSubmitError(e instanceof Error ? e.message : "Não foi possível concluir. Tente novamente.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const onPrimary = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 5) return void submit();
    if (step === 4 && !validateCustomer()) return;
    if (!canContinue) {
      setStepError(
        ["Escolha um serviço para continuar.", "Escolha um barbeiro ou “Sem preferência”.", "Escolha uma data.", "Escolha um horário disponível."][
          step
        ] ?? null,
      );
      return;
    }
    goTo(step + 1);
  };

  /* ── Animação entre etapas ── */
  const variants: Variants = {
    enter: (d: number) => ({ opacity: 0, x: reduced ? 0 : d * 24 }),
    center: { opacity: 1, x: 0, transition: { duration: DURATION.base, ease: EASE_OUT } },
    exit: (d: number) => ({ opacity: 0, x: reduced ? 0 : d * -16, transition: { duration: DURATION.fast, ease: "easeIn" } }),
  };

  if (step === SUCCESS_STEP && result) {
    return (
      <div ref={(el) => void (topRef.current = el)} className="scroll-mt-28 py-4">
        <SuccessView booking={result} />
      </div>
    );
  }

  const summaryData = { service, barber, anyBarber: barberId === ANY_BARBER, date, time };
  const copy = STEP_COPY[step]!;

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
      <form ref={(el) => void (topRef.current = el)} onSubmit={onPrimary} noValidate className="scroll-mt-28">
        <StepIndicator current={step} maxReached={maxReached} onNavigate={goTo} />

        {/* Resumo compacto no mobile */}
        {service && step > 0 && (
          <p className="mt-4 flex flex-wrap gap-x-2 gap-y-1 text-xs text-muted-foreground lg:hidden">
            <span className="text-foreground">{service.name}</span>
            {barberId && <span>· {barber ? (barber.nickname ?? barber.name.split(" ")[0]) : "Sem preferência"}</span>}
            {date && step > 2 && <span>· {formatDateStr(date, { day: "2-digit", month: "2-digit" })}</span>}
            {time && step > 3 && <span>· {time}</span>}
          </p>
        )}

        <div className="mt-8 min-h-[380px]">
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <m.section key={step} custom={dir} variants={variants} initial="enter" animate="center" exit="exit" aria-labelledby="step-title">
              <h2 id="step-title" ref={headingRef} tabIndex={-1} className="text-3xl font-semibold uppercase outline-none sm:text-4xl">
                {copy.title}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">{copy.description}</p>

              <div className="mt-6">
                {step === 0 && (
                  <ServiceStep
                    services={services}
                    selectedId={serviceId}
                    onSelect={selectService}
                    barber={barber}
                    onClearBarber={() => setBarberId(null)}
                  />
                )}
                {step === 1 && service && (
                  <BarberStep barbers={eligibleBarbers} selectedId={barberId} onSelect={selectBarber} serviceName={service.name} />
                )}
                {step === 2 && (
                  <DateStep
                    today={today}
                    maxAdvanceDays={maxAdvanceDays}
                    hours={hours}
                    barbers={barber ? [barber] : eligibleBarbers}
                    selected={date}
                    onSelect={selectDate}
                  />
                )}
                {step === 3 && (
                  <TimeStep
                    data={availability.data}
                    loading={availability.loading}
                    error={availability.error}
                    selected={time}
                    onSelect={(t) => {
                      setTime(t);
                      setConflict(null);
                    }}
                    onRetry={availability.reload}
                    onPickDate={selectDate}
                    onAnyBarber={() => selectBarber(ANY_BARBER)}
                    isAnyBarber={barberId === ANY_BARBER}
                    conflictMessage={conflict}
                  />
                )}
                {step === 4 && <CustomerStep value={customer} onChange={setCustomer} errors={customerErrors} />}
                {step === 5 && (
                  <div className="space-y-6">
                    <div className="rounded-xl border bg-card px-5 py-2">
                      <BookingSummary data={summaryData} onEdit={goTo} />
                      <div className="flex items-start gap-3 border-t py-3 text-sm">
                        <span className="text-xs text-muted-foreground">Cliente:</span>
                        <span className="flex-1 font-medium">
                          {customer.name} · {customer.phone}
                          {customer.notes && <span className="mt-1 block font-normal text-muted-foreground">“{customer.notes}”</span>}
                        </span>
                        <button type="button" onClick={() => goTo(4)} className="text-xs font-medium text-primary hover:underline">
                          Alterar<span className="sr-only"> dados</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="accept" className="flex cursor-pointer items-start gap-3 text-sm">
                        <input
                          id="accept"
                          type="checkbox"
                          checked={accept}
                          onChange={(e) => {
                            setAccept(e.target.checked);
                            if (e.target.checked) setAcceptError(null);
                          }}
                          aria-invalid={Boolean(acceptError)}
                          aria-describedby={acceptError ? "accept-error" : undefined}
                          className="mt-0.5 size-5 shrink-0 cursor-pointer rounded border-input accent-[hsl(var(--primary))]"
                        />
                        <span className="text-muted-foreground">
                          Li e aceito os{" "}
                          <Link href="/termos" target="_blank" className="text-primary underline underline-offset-4">
                            Termos de Uso
                          </Link>{" "}
                          e a{" "}
                          <Link href="/privacidade" target="_blank" className="text-primary underline underline-offset-4">
                            Política de Privacidade
                          </Link>
                          , incluindo a política de cancelamento (até {settings.booking.cancelMinHours}h antes).
                        </span>
                      </label>
                      <AnimatePresence initial={false}>
                        {acceptError && (
                          <m.p
                            id="accept-error"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: DURATION.fast }}
                            className="text-xs font-medium text-destructive"
                          >
                            {acceptError}
                          </m.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Honeypot anti-spam (invisível para pessoas) */}
                    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
                      <label htmlFor="website">Não preencha</label>
                      <input id="website" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
                    </div>

                    <FormAlert message={submitError} />
                  </div>
                )}
              </div>
            </m.section>
          </AnimatePresence>
        </div>

        <FormAlert message={stepError} variant="info" className="mt-6" />

        {/* Navegação: fixa no rodapé em telas pequenas */}
        <div className="sticky bottom-0 z-20 -mx-4 mt-8 flex items-center justify-between gap-3 border-t bg-background/90 px-4 py-3 backdrop-blur-md sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
          <Button type="button" variant="ghost" onClick={() => goTo(step - 1)} disabled={step === 0 || submitting} className={step === 0 ? "invisible" : ""}>
            <ArrowLeft aria-hidden /> Voltar
          </Button>
          <Button type="submit" size="lg" loading={submitting} aria-disabled={!canContinue} className={!canContinue ? "opacity-60" : ""}>
            {step === 5 ? (
              <>
                {!submitting && <CalendarCheck aria-hidden />}
                {submitting ? "Confirmando…" : "Confirmar agendamento"}
              </>
            ) : (
              <>
                Continuar <ArrowRight aria-hidden />
              </>
            )}
          </Button>
        </div>
      </form>

      <aside className="hidden lg:block" aria-label="Resumo do agendamento">
        <div className="sticky top-28 rounded-2xl border bg-card p-6">
          <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-primary">Seu agendamento</h2>
          <BookingSummary data={summaryData} className="mt-3" onEdit={(s) => (s <= maxReached ? goTo(s) : undefined)} />
          <p className="mt-4 border-t pt-4 text-xs leading-relaxed text-muted-foreground">
            Pagamento na barbearia (Pix, cartão ou dinheiro). Cancelamento online até {settings.booking.cancelMinHours}h antes.
          </p>
        </div>
      </aside>
    </div>
  );
}
