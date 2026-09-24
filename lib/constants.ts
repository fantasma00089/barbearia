import type { BookingStatus, ServiceCategory } from "@/types";

export const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  HAIR: "Cabelo",
  BEARD: "Barba",
  COMBO: "Combo",
  CHEMICAL: "Química",
  KIDS: "Kids",
};

/** Slugs usados na URL (?categoria=barba) */
export const CATEGORY_SLUGS: Record<ServiceCategory, string> = {
  HAIR: "cabelo",
  BEARD: "barba",
  COMBO: "combo",
  CHEMICAL: "quimica",
  KIDS: "kids",
};

export const STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING: "Aguardando confirmação",
  CONFIRMED: "Confirmada",
  CANCELLED: "Cancelada",
  COMPLETED: "Concluída",
  NO_SHOW: "Não compareceu",
};

export const ANY_BARBER = "any" as const;
