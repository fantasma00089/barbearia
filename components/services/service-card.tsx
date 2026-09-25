import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CategoryIcon } from "./category-icon";
import { CATEGORY_LABELS } from "@/lib/constants";
import { formatDuration, formatPrice } from "@/lib/format";
import type { ServiceDTO } from "@/types";

export function ServiceCard({ service }: { service: ServiceDTO }) {
  return (
    <article className="card-interactive group flex h-full flex-col p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <span className="inline-flex size-11 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary transition-transform duration-300 ease-out group-hover:scale-105">
          <CategoryIcon category={service.category} className="size-5" />
        </span>
        <Badge variant="outline">{CATEGORY_LABELS[service.category]}</Badge>
      </div>

      <h3 className="text-2xl font-semibold uppercase tracking-wide">{service.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{service.description}</p>

      <div className="mt-6 flex items-end justify-between gap-4 border-t pt-5">
        <div>
          <p className="font-display text-2xl font-semibold text-primary">
            {service.priceFrom && <span className="mr-1 font-sans text-xs font-normal text-muted-foreground">a partir de</span>}
            {formatPrice(service.priceCents)}
          </p>
          <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="size-3.5" aria-hidden />
            {formatDuration(service.durationMin)}
          </p>
        </div>
        {service.barberIds.length === 0 ? (
          <span className="text-xs text-muted-foreground">Agendamento pelo WhatsApp</span>
        ) : (
        <Link
          href={`/agendar?servico=${service.slug}`}
          className="inline-flex items-center gap-1.5 rounded-full py-2 text-sm font-semibold text-foreground transition-colors hover:text-primary"
        >
          Agendar este serviço
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
          <span className="sr-only">: {service.name}</span>
        </Link>
        )}
      </div>
    </article>
  );
}
