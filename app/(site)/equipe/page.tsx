import Link from "next/link";
import { Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { PageHeader } from "@/components/shared/page-header";
import { PlaceholderNote } from "@/components/shared/placeholder-note";
import { BarberCard } from "@/components/team/barber-card";
import { bookingContent } from "@/config/content";
import { buildMetadata } from "@/lib/seo";
import { getSettings } from "@/server/settings";
import { getBarbers, getServices } from "@/server/catalog";

export const revalidate = 300;

export async function generateMetadata() {
  const s = await getSettings();
  return buildMetadata(s, {
    title: "Nossa equipe",
    description: `Conheça os barbeiros da ${s.brand.shortName}: especialistas em fade, barba, coloração e cortes infantis em ${s.address.city}.`,
    path: "/equipe",
  });
}

export default async function TeamPage() {
  const [barbers, services] = await Promise.all([getBarbers(), getServices()]);

  return (
    <>
      <PageHeader
        eyebrow="Equipe"
        title="Mãos que conhecem o ofício"
        description="Cada barbeiro tem uma especialidade. Escolha o seu — ou deixe que a gente indique o primeiro disponível."
      >
        <div className="mt-6">
          <PlaceholderNote>Profissionais e fotos fictícios — substitua pela equipe real.</PlaceholderNote>
        </div>
      </PageHeader>

      <section className="container py-12 md:py-16" aria-label="Barbeiros">
        <Stagger className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {barbers.map((b) => (
            <StaggerItem key={b.id}>
              <BarberCard barber={b} services={services} variant="full" />
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal className="mt-10 flex flex-col items-start justify-between gap-6 rounded-xl border border-dashed border-primary/40 bg-card/50 p-6 sm:flex-row sm:items-center md:p-8">
          <div className="flex items-start gap-4">
            <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Shuffle className="size-5" aria-hidden />
            </span>
            <div>
              <h2 className="text-2xl font-semibold uppercase">{bookingContent.anyBarberLabel} de barbeiro</h2>
              <p className="mt-1 text-sm text-muted-foreground">{bookingContent.anyBarberDescription} Mais horários, menos espera.</p>
            </div>
          </div>
          <Button asChild size="lg" variant="outline" className="shrink-0">
            <Link href="/agendar?barbeiro=sem-preferencia">Agendar sem preferência</Link>
          </Button>
        </Reveal>
      </section>
    </>
  );
}
