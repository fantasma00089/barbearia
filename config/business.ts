/**
 * ───────────────────────────────────────────────────────────────
 *  REGRAS DE FUNCIONAMENTO E AGENDAMENTO
 *  Os horários abaixo são usados pelo seed. Depois de popular o banco,
 *  os horários "vivos" ficam na tabela BusinessHour e podem ser editados
 *  em /admin/horarios sem novo deploy.
 * ───────────────────────────────────────────────────────────────
 */

export const businessConfig = {
  /** Fuso horário oficial da barbearia (IANA). */
  timezone: "America/Porto_Velho",

  /** 0 = domingo ... 6 = sábado. Horas em "HH:mm". */
  defaultHours: [
    { dayOfWeek: 0, isOpen: false, openTime: "09:00", closeTime: "13:00", breakStart: null, breakEnd: null },
    { dayOfWeek: 1, isOpen: true, openTime: "09:00", closeTime: "20:00", breakStart: null, breakEnd: null },
    { dayOfWeek: 2, isOpen: true, openTime: "09:00", closeTime: "20:00", breakStart: null, breakEnd: null },
    { dayOfWeek: 3, isOpen: true, openTime: "09:00", closeTime: "20:00", breakStart: null, breakEnd: null },
    { dayOfWeek: 4, isOpen: true, openTime: "09:00", closeTime: "20:00", breakStart: null, breakEnd: null },
    { dayOfWeek: 5, isOpen: true, openTime: "09:00", closeTime: "20:00", breakStart: null, breakEnd: null },
    { dayOfWeek: 6, isOpen: true, openTime: "08:00", closeTime: "18:00", breakStart: null, breakEnd: null },
  ],

  booking: {
    /** Granularidade dos horários oferecidos (minutos). */
    slotStepMinutes: 15,
    /** Intervalo entre atendimentos do mesmo barbeiro (minutos). */
    bufferMinutes: 10,
    /** Antecedência mínima para agendar (minutos). */
    minLeadMinutes: 60,
    /** Até quantos dias à frente é possível agendar. */
    maxAdvanceDays: 30,
    /** Se true, reservas nascem CONFIRMADAS; se false, ficam PENDENTES até o admin confirmar. */
    autoConfirm: false,
    /** Prefixo do código da reserva (ex.: NA-7K3F9Q). */
    codePrefix: "NA",
  },

  cancellation: {
    /** Cancelamento online permitido até X horas antes do horário. */
    minHoursBefore: 2,
  },

  /** Tolerância de atraso antes de o horário poder ser liberado (minutos). */
  lateToleranceMinutes: 10,

  currency: "BRL",
} as const;

export const WEEKDAYS = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
] as const;

export const WEEKDAYS_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"] as const;
