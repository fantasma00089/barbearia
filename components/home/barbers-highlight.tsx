import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { BarberCard } from "@/components/team/barber-card";
import { homeContent } from "@/config/content";
import type { BarberDTO } from "@/types";

export function BarbersHighlight({ barbers }: { barbers: BarberDTO[] }) {
  const c = homeContent.barbers;
  return (
    <section className="relative border-y bg-card/30 py-20 md:py-28" aria-labelledby="equipe-destaque">
      <div className="container">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading id="equipe-destaque" eyebrow={c.eyebrow} title={c.title} description={c.description} />
          <Button asChild variant="outline" className="w-fit">
            <Link href="/equipe">
              {c.cta} <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {barbers.map((b) => (
            <StaggerItem key={b.id}>
              <BarberCard barber={b} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
