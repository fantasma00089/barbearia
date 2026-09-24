import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { ServiceCard } from "@/components/services/service-card";
import { homeContent } from "@/config/content";
import type { ServiceDTO } from "@/types";

export function FeaturedServices({ services }: { services: ServiceDTO[] }) {
  const c = homeContent.services;
  return (
    <section className="py-20 md:py-28" aria-labelledby="servicos-destaque">
      <div className="container">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading id="servicos-destaque" eyebrow={c.eyebrow} title={c.title} description={c.description} />
          <Button asChild variant="outline" className="w-fit">
            <Link href="/servicos">
              {c.cta} <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <StaggerItem key={s.id}>
              <ServiceCard service={s} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
