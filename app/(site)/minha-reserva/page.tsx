import { Suspense } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { ReservationManager } from "@/components/reservation/reservation-manager";
import { businessConfig } from "@/config/business";
import { buildMetadata } from "@/lib/seo";
import { todayStr } from "@/lib/time";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Minha reserva",
  description: "Consulte, cancele ou solicite reagendamento da sua reserva usando o código e o WhatsApp.",
  path: "/minha-reserva",
  noIndex: true,
});

export default function MyBookingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Minha reserva"
        title="Consulte sua reserva"
        description={`Veja os detalhes, solicite reagendamento ou cancele online até ${businessConfig.cancellation.minHoursBefore}h antes do horário.`}
      />
      <section className="container py-10 md:py-14">
        <Suspense>
          <ReservationManager today={todayStr()} />
        </Suspense>
      </section>
    </>
  );
}
