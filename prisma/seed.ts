import { PrismaClient } from "@prisma/client";
import { barbers, services } from "./data";
import { businessConfig } from "../config/business";
import { addDays, todayStr, weekdayOf, zonedToUtc } from "../lib/time";

const prisma = new PrismaClient();

/** Reservas de demonstração para o painel e a agenda não ficarem vazios. */
const DEMO_BOOKINGS = [
  { dayOffset: 1, time: "09:00", barber: "rafael-moreira", service: "fade-degrade", name: "Carlos Demo", status: "CONFIRMED" },
  { dayOffset: 1, time: "10:30", barber: "lucas-almeida", service: "barboterapia", name: "João Demo", status: "PENDING" },
  { dayOffset: 1, time: "14:00", barber: "diego-souza", service: "luzes", name: "Pedro Demo", status: "CONFIRMED" },
  { dayOffset: 1, time: "16:00", barber: "bruno-cardoso", service: "corte-kids", name: "Marina Demo", status: "PENDING" },
  { dayOffset: 2, time: "11:00", barber: "rafael-moreira", service: "combo-corte-barba", name: "André Demo", status: "CONFIRMED" },
  { dayOffset: 2, time: "15:15", barber: "lucas-almeida", service: "barba-desenhada", name: "Lucas Demo", status: "PENDING" },
  { dayOffset: 3, time: "09:30", barber: "bruno-cardoso", service: "combo-pai-filho", name: "Renato Demo", status: "CONFIRMED" },
  { dayOffset: 3, time: "18:00", barber: "rafael-moreira", service: "corte-navalhado", name: "Fábio Demo", status: "PENDING" },
] as const;

/**
 * Por padrão o seed só CRIA o que não existe — nunca sobrescreve o que foi editado no painel.
 * Para restaurar o catálogo de prisma/data.ts: SEED_OVERWRITE=true npm run db:seed
 */
const overwrite = process.env.SEED_OVERWRITE === "true";

async function main() {
  console.log(`🌱 Populando banco${overwrite ? " (sobrescrevendo catálogo)" : ""}…`);

  // Horário de funcionamento
  for (const h of businessConfig.defaultHours) {
    await prisma.businessHour.upsert({
      where: { dayOfWeek: h.dayOfWeek },
      update: overwrite ? { ...h } : {},
      create: { ...h },
    });
  }

  // Catálogo (serviços, barbeiros, reservas demo) só é criado em banco vazio,
  // para não recriar o que foi excluído ou editado no painel.
  const hasCatalog = (await prisma.barber.count()) + (await prisma.service.count()) > 0;
  if (hasCatalog && !overwrite) {
    console.log("✅ Catálogo já existe — mantido (use SEED_OVERWRITE=true para restaurar o de prisma/data.ts).");
    return;
  }

  // Serviços
  const serviceIds = new Map<string, string>();
  for (const [i, s] of services.entries()) {
    const data = {
      name: s.name,
      description: s.description,
      category: s.category,
      durationMin: s.durationMin,
      priceCents: Math.round(s.price * 100),
      priceFrom: s.priceFrom ?? false,
      featured: s.featured ?? false,
      active: true,
      sortOrder: i,
    };
    const row = await prisma.service.upsert({
      where: { slug: s.slug },
      update: overwrite ? data : {},
      create: { slug: s.slug, ...data },
    });
    serviceIds.set(s.slug, row.id);
  }

  // Barbeiros + serviços atendidos
  const barberIds = new Map<string, string>();
  for (const [i, b] of barbers.entries()) {
    const data = {
      name: b.name,
      nickname: b.nickname ?? null,
      specialty: b.specialty,
      bio: b.bio,
      yearsExperience: b.yearsExperience,
      rating: b.rating,
      reviewsCount: b.reviewsCount,
      photo: b.photo,
      instagram: b.instagram ?? null,
      active: true,
      sortOrder: i,
    };
    const row = await prisma.barber.upsert({
      where: { slug: b.slug },
      update: overwrite ? data : {},
      create: { slug: b.slug, ...data },
    });
    barberIds.set(b.slug, row.id);

    await prisma.barberService.deleteMany({ where: { barberId: row.id } });
    await prisma.barberService.createMany({
      data: b.services.map((slug) => {
        const serviceId = serviceIds.get(slug);
        if (!serviceId) throw new Error(`Serviço "${slug}" do barbeiro ${b.slug} não existe em prisma/data.ts`);
        return { barberId: row.id, serviceId };
      }),
    });
  }

  // Reservas de demonstração (recriadas a cada seed). Desative em produção com SEED_DEMO_BOOKINGS=false.
  await prisma.booking.deleteMany({ where: { code: { startsWith: `${businessConfig.booking.codePrefix}-DEMO` } } });
  const withDemo = process.env.SEED_DEMO_BOOKINGS !== "false";
  const today = todayStr();
  let n = 0;
  for (const d of withDemo ? DEMO_BOOKINGS : []) {
    let date = addDays(today, d.dayOffset);
    // pula dias fechados (domingo)
    while (!businessConfig.defaultHours[weekdayOf(date)]!.isOpen) date = addDays(date, 1);
    const service = services.find((s) => s.slug === d.service)!;
    const startAt = zonedToUtc(date, d.time);
    n++;
    await prisma.booking.create({
      data: {
        code: `${businessConfig.booking.codePrefix}-DEMO${String(n).padStart(2, "0")}`,
        serviceId: serviceIds.get(d.service)!,
        barberId: barberIds.get(d.barber)!,
        customerName: d.name,
        customerPhone: `6999999${String(1000 + n).slice(-4)}`,
        notes: "[DEMO] Reserva fictícia criada pelo seed.",
        startAt,
        endAt: new Date(startAt.getTime() + service.durationMin * 60000),
        status: d.status,
        confirmedAt: d.status === "CONFIRMED" ? new Date() : null,
        priceCents: Math.round(service.price * 100),
        durationMin: service.durationMin,
      },
    });
  }

  console.log(`✅ ${services.length} serviços, ${barbers.length} barbeiros, 7 dias de horário e ${n} reservas demo.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
