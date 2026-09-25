import { BookingWizard } from "@/components/booking/booking-wizard";
import { PageHeader } from "@/components/shared/page-header";
import { bookingContent } from "@/config/content";
import { ANY_BARBER } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";
import { getSettings } from "@/server/settings";
import { todayStr } from "@/lib/time";
import { getBarbers, getBusinessHours, getServices } from "@/server/catalog";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const s = await getSettings();
  return buildMetadata(s, {
    title: "Agendar horário",
    description: `Agende online seu corte ou barba na ${s.brand.shortName}, em ${s.address.city}. Escolha serviço, barbeiro, data e horário em menos de um minuto.`,
    path: "/agendar",
  });
}

type SearchParams = Promise<{ servico?: string; barbeiro?: string }>;

export default async function BookingPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const [services, barbers, hours, settings] = await Promise.all([getServices(), getBarbers(), getBusinessHours(), getSettings()]);

  // Pré-seleção via URL: /agendar?servico=fade-degrade&barbeiro=rafael-moreira
  // Serviço sem barbeiro ativo não pode ser pré-selecionado.
  const service = services.find((s) => s.slug === params.servico && s.barberIds.length > 0) ?? null;
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
          maxAdvanceDays={settings.booking.maxAdvanceDays}
          initial={{ serviceId: service?.id ?? null, barberId, step }}
        />
      </section>
    </>
  );
}
