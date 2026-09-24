import "server-only";
import { cache } from "react";
import { prisma, type Db } from "./db";
import type { BarberDTO, BusinessHourDTO, ServiceCategory, ServiceDTO } from "@/types";
import { businessConfig } from "@/config/business";

export const getServices = cache(async (): Promise<ServiceDTO[]> => {
  const rows = await prisma.service.findMany({
    where: { active: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { barbers: { where: { barber: { active: true } }, select: { barberId: true } } },
  });
  return rows.map((s) => ({
    id: s.id,
    slug: s.slug,
    name: s.name,
    description: s.description,
    category: s.category as ServiceCategory,
    durationMin: s.durationMin,
    priceCents: s.priceCents,
    priceFrom: s.priceFrom,
    featured: s.featured,
    barberIds: s.barbers.map((b) => b.barberId),
  }));
});

export const getBarbers = cache(async (): Promise<BarberDTO[]> => {
  const rows = await prisma.barber.findMany({
    where: { active: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { services: { where: { service: { active: true } }, select: { serviceId: true } }, hours: true },
  });
  return rows.map((b) => ({
    id: b.id,
    slug: b.slug,
    name: b.name,
    nickname: b.nickname,
    specialty: b.specialty,
    bio: b.bio,
    yearsExperience: b.yearsExperience,
    rating: b.rating,
    reviewsCount: b.reviewsCount,
    photo: b.photo,
    instagram: b.instagram,
    serviceIds: b.services.map((s) => s.serviceId),
    customHours: b.hours.map(toHourDTO),
  }));
});

export function toHourDTO(h: BusinessHourDTO): BusinessHourDTO {
  return {
    dayOfWeek: h.dayOfWeek,
    isOpen: h.isOpen,
    openTime: h.openTime,
    closeTime: h.closeTime,
    breakStart: h.breakStart,
    breakEnd: h.breakEnd,
  };
}

/** Horário de funcionamento dos 7 dias (com fallback para a config). */
export async function getBusinessHours(db: Db = prisma): Promise<BusinessHourDTO[]> {
  const rows = await db.businessHour.findMany({ orderBy: { dayOfWeek: "asc" } });
  return businessConfig.defaultHours.map((def) => {
    const row = rows.find((r) => r.dayOfWeek === def.dayOfWeek);
    return row
      ? {
          dayOfWeek: row.dayOfWeek,
          isOpen: row.isOpen,
          openTime: row.openTime,
          closeTime: row.closeTime,
          breakStart: row.breakStart,
          breakEnd: row.breakEnd,
        }
      : { ...def };
  });
}

export const getBusinessHoursCached = cache(() => getBusinessHours());
