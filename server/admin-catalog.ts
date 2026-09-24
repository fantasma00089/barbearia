import "server-only";
import { revalidatePath } from "next/cache";
import { prisma } from "./db";
import { AppError } from "./errors";
import { toHourDTO } from "./catalog";
import { slugify } from "@/lib/slug";
import type { BarberInput, ServiceInput } from "@/lib/validation/catalog";
import type { BusinessHourDTO, ServiceCategory } from "@/types";

const refreshSite = () => revalidatePath("/", "layout");

async function uniqueSlug(model: "barber" | "service", base: string, ignoreId?: string) {
  const root = slugify(base);
  for (let i = 1; ; i++) {
    const slug = i === 1 ? root : `${root}-${i}`;
    const existing =
      model === "barber"
        ? await prisma.barber.findUnique({ where: { slug }, select: { id: true } })
        : await prisma.service.findUnique({ where: { slug }, select: { id: true } });
    if (!existing || existing.id === ignoreId) return slug;
  }
}

/* ───────────────────────── Barbeiros ───────────────────────── */

export interface AdminBarber {
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
  active: boolean;
  sortOrder: number;
  serviceIds: string[];
  customHours: BusinessHourDTO[];
  bookingsCount: number;
}

export async function listBarbersFull(): Promise<AdminBarber[]> {
  const rows = await prisma.barber.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { services: { select: { serviceId: true } }, hours: true, _count: { select: { bookings: true } } },
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
    active: b.active,
    sortOrder: b.sortOrder,
    serviceIds: b.services.map((s) => s.serviceId),
    customHours: b.hours.map(toHourDTO),
    bookingsCount: b._count.bookings,
  }));
}

export async function getBarberFull(id: string) {
  return (await listBarbersFull()).find((b) => b.id === id) ?? null;
}

export async function saveBarber(id: string | null, input: BarberInput) {
  const data = {
    name: input.name,
    nickname: input.nickname || null,
    specialty: input.specialty,
    bio: input.bio,
    yearsExperience: input.yearsExperience,
    rating: input.rating,
    reviewsCount: input.reviewsCount,
    photo: input.photo,
    instagram: input.instagram || null,
    active: input.active,
  };

  const barber = await prisma.$transaction(async (tx) => {
    let saved;
    if (id) {
      const exists = await tx.barber.findUnique({ where: { id }, select: { id: true } });
      if (!exists) throw new AppError("NOT_FOUND", "Barbeiro não encontrado.");
      saved = await tx.barber.update({ where: { id }, data });
    } else {
      const max = await tx.barber.aggregate({ _max: { sortOrder: true } });
      saved = await tx.barber.create({
        data: { ...data, slug: await uniqueSlug("barber", input.name), sortOrder: (max._max.sortOrder ?? -1) + 1 },
      });
    }
    await tx.barberService.deleteMany({ where: { barberId: saved.id } });
    const validServices = await tx.service.findMany({ where: { id: { in: input.serviceIds } }, select: { id: true } });
    await tx.barberService.createMany({ data: validServices.map((s) => ({ barberId: saved.id, serviceId: s.id })) });

    await tx.barberHour.deleteMany({ where: { barberId: saved.id } });
    if (input.customHours.length) {
      await tx.barberHour.createMany({ data: input.customHours.map((h) => ({ ...h, barberId: saved.id })) });
    }
    return saved;
  });
  refreshSite();
  return barber;
}

export async function deleteBarber(id: string) {
  const count = await prisma.booking.count({ where: { barberId: id } });
  if (count > 0) {
    throw new AppError("POLICY", `Este barbeiro tem ${count} reserva(s) no histórico. Desative-o em vez de excluir.`);
  }
  await prisma.barber.delete({ where: { id } });
  refreshSite();
}

/* ───────────────────────── Serviços ───────────────────────── */

export interface AdminService {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: ServiceCategory;
  durationMin: number;
  priceCents: number;
  priceFrom: boolean;
  featured: boolean;
  active: boolean;
  sortOrder: number;
  barberIds: string[];
  bookingsCount: number;
}

export async function listServicesFull(): Promise<AdminService[]> {
  const rows = await prisma.service.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { barbers: { select: { barberId: true } }, _count: { select: { bookings: true } } },
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
    active: s.active,
    sortOrder: s.sortOrder,
    barberIds: s.barbers.map((b) => b.barberId),
    bookingsCount: s._count.bookings,
  }));
}

export async function getServiceFull(id: string) {
  return (await listServicesFull()).find((s) => s.id === id) ?? null;
}

export async function saveService(id: string | null, input: ServiceInput) {
  const data = {
    name: input.name,
    description: input.description,
    category: input.category,
    durationMin: input.durationMin,
    priceCents: Math.round(input.price * 100),
    priceFrom: input.priceFrom,
    featured: input.featured,
    active: input.active,
  };
  const service = await prisma.$transaction(async (tx) => {
    let saved;
    if (id) {
      const exists = await tx.service.findUnique({ where: { id }, select: { id: true } });
      if (!exists) throw new AppError("NOT_FOUND", "Serviço não encontrado.");
      saved = await tx.service.update({ where: { id }, data });
    } else {
      const max = await tx.service.aggregate({ _max: { sortOrder: true } });
      saved = await tx.service.create({
        data: { ...data, slug: await uniqueSlug("service", input.name), sortOrder: (max._max.sortOrder ?? -1) + 1 },
      });
    }
    await tx.barberService.deleteMany({ where: { serviceId: saved.id } });
    const validBarbers = await tx.barber.findMany({ where: { id: { in: input.barberIds } }, select: { id: true } });
    await tx.barberService.createMany({ data: validBarbers.map((b) => ({ barberId: b.id, serviceId: saved.id })) });
    return saved;
  });
  refreshSite();
  return service;
}

export async function deleteService(id: string) {
  const count = await prisma.booking.count({ where: { serviceId: id } });
  if (count > 0) {
    throw new AppError("POLICY", `Este serviço tem ${count} reserva(s) no histórico. Desative-o em vez de excluir.`);
  }
  await prisma.service.delete({ where: { id } });
  refreshSite();
}

/* ───────────────────────── Ordenação ───────────────────────── */

export async function move(model: "barber" | "service", id: string, direction: "up" | "down") {
  const rows =
    model === "barber"
      ? await prisma.barber.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }], select: { id: true } })
      : await prisma.service.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }], select: { id: true } });
  const ids = rows.map((r) => r.id);
  const i = ids.indexOf(id);
  if (i < 0) throw new AppError("NOT_FOUND", "Item não encontrado.");
  const j = direction === "up" ? i - 1 : i + 1;
  if (j < 0 || j >= ids.length) return;
  [ids[i], ids[j]] = [ids[j]!, ids[i]!];
  await prisma.$transaction(
    ids.map((rowId, index) =>
      model === "barber"
        ? prisma.barber.update({ where: { id: rowId }, data: { sortOrder: index } })
        : prisma.service.update({ where: { id: rowId }, data: { sortOrder: index } }),
    ),
  );
  refreshSite();
}

/* ───────────────────────── Imagens ───────────────────────── */

export const MEDIA_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
export const MEDIA_MAX_BYTES = 4 * 1024 * 1024;

export async function saveMedia(file: File) {
  if (!MEDIA_TYPES.includes(file.type)) throw new AppError("VALIDATION", "Use uma imagem JPG, PNG, WebP, AVIF ou GIF.");
  if (file.size > MEDIA_MAX_BYTES) throw new AppError("VALIDATION", "A imagem deve ter no máximo 4 MB.");
  const bytes = new Uint8Array(await file.arrayBuffer());
  const media = await prisma.media.create({ data: { mimeType: file.type, size: file.size, data: bytes } });
  return { id: media.id, url: `/media/${media.id}` };
}
