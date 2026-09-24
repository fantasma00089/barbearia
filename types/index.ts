export const SERVICE_CATEGORIES = ["HAIR", "BEARD", "COMBO", "CHEMICAL", "KIDS"] as const;
export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];

export const BOOKING_STATUSES = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "NO_SHOW"] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

/** Status que ocupam a agenda do barbeiro. */
export const ACTIVE_BOOKING_STATUSES: BookingStatus[] = ["PENDING", "CONFIRMED"];

export const PAYMENT_STATUSES = ["NOT_REQUIRED", "PENDING", "PAID", "REFUNDED", "FAILED"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export interface ServiceDTO {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: ServiceCategory;
  durationMin: number;
  priceCents: number;
  priceFrom: boolean;
  featured: boolean;
  barberIds: string[];
}

export interface BarberDTO {
  id: string;
  slug: string;
  name: string;
  nickname: string | null;
  specialty: string;
  bio: string;
  yearsExperience: number;
  rating: number;
  reviewsCount: number;
  photo: string;
  instagram: string | null;
  serviceIds: string[];
  /** Dias com horário próprio (os demais seguem o horário da barbearia). */
  customHours: BusinessHourDTO[];
}

export interface BusinessHourDTO {
  dayOfWeek: number;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  breakStart: string | null;
  breakEnd: string | null;
}

export interface SlotDTO {
  /** "HH:mm" no fuso da barbearia */
  time: string;
  /** ISO em UTC */
  startAt: string;
  /** Barbeiros livres nesse horário */
  barberIds: string[];
}

export type AvailabilityReason = "closed" | "past" | "too_far" | "full" | "no_barber";

export interface AvailabilityResult {
  date: string;
  timezone: string;
  slots: SlotDTO[];
  reason?: AvailabilityReason;
  /** Próxima data com horários livres (quando `slots` está vazio). */
  nextAvailableDate?: string | null;
}

export interface BookingPublicDTO {
  code: string;
  status: BookingStatus;
  serviceName: string;
  barberName: string;
  customerName: string;
  customerPhone: string;
  notes: string | null;
  startAt: string;
  endAt: string;
  dateLabel: string;
  timeLabel: string;
  durationMin: number;
  priceCents: number;
  priceFrom: boolean;
  canCancel: boolean;
  cancelDeadline: string;
  canRequestReschedule: boolean;
  rescheduleRequested: boolean;
}

export interface AdminBookingDTO extends BookingPublicDTO {
  id: string;
  barberId: string;
  serviceId: string;
  anyBarber: boolean;
  rescheduleNote: string | null;
  cancelReason: string | null;
  cancelledBy: string | null;
  createdAt: string;
}

export interface TimeBlockDTO {
  id: string;
  barberId: string | null;
  barberName: string | null;
  startAt: string;
  endAt: string;
  dateLabel: string;
  timeRange: string;
  reason: string | null;
}

export interface ApiErrorBody {
  error: string;
  code?: string;
  fieldErrors?: Record<string, string[] | undefined>;
}
