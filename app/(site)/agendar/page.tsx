import { BookingWizard } from "@/components/booking/booking-wizard";
import { PageHeader } from "@/components/shared/page-header";
import { bookingContent } from "@/config/content";
import { businessConfig } from "@/config/business";
import { siteConfig } from "@/config/site";
import { ANY_BARBER } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";
import { todayStr } from "@/lib/time";
import { getBarbers, getBusinessHours, getServices } from "@/server/catalog";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Agendar horário",
  description: `Agende online seu corte ou barba na ${siteConfig.shortName}, em ${siteConfig.address.city}. Escolha serviço, barbeiro, data e horário em menos de um minuto.`,
  path: "/agendar",
});

type SearchParams = Promise<{ servico?: string; barbeiro?: string }>;

export default async function BookingPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const [services, barbers, hours] = await Promise.all([getServices(), getBarbers(), getBusinessHours()]);

  // Pré-seleção via URL: /agendar?servico=fade-degrade&barbeiro=rafael-moreira
  const service = services.find((s) => s.slug === params.servico) ?? null;
  let barberId: string | null =
    params.barbeiro === "sem-preferencia" ? ANY_BARBER : (barbers.find((b) => b.slug === params.barbeiro)?.id ?? null);
  if (service && barberId && barberId !== ANY_BARBER && !service.barberIds.includes(barberId)) barberId = null;

  const step = service ? (barberId ? 2 : 1) : 0;

  return (
    <>
      <PageHeader eyebrow="Agendamento online" title={bookingContent.title} description={bookingContent.description} />
      <section className="container py-10 md:py-14">
        <BookingWizard
          services={services}
          barbers={barbers}
          hours={hours}
          today={todayStr()}
          maxAdvanceDays={businessConfig.booking.maxAdvanceDays}
          initial={{ serviceId: service?.id ?? null, barberId, step }}
        />
      </section>
    </>
  );
}
