import Link from "next/link";
import { Award, CalendarCheck } from "lucide-react";
import { InstagramIcon } from "@/components/icons/brand-icons";
import { Button } from "@/components/ui/button";
import { Rating } from "@/components/shared/rating";
import { SmartImage } from "@/components/shared/smart-image";
import { formatNumber } from "@/lib/format";
import type { BarberDTO, ServiceDTO } from "@/types";

function displayName(b: BarberDTO) {
  return b.nickname ?? b.name.split(" ")[0]!;
}

export function BarberCard({
  barber,
  services,
  variant = "compact",
}: {
  barber: BarberDTO;
  services?: ServiceDTO[];
  variant?: "compact" | "full";
}) {
  const offered = services?.filter((s) => barber.serviceIds.includes(s.id)) ?? [];
  const full = variant === "full";

  return (
    <article id={barber.slug} className="card-interactive group flex h-full scroll-mt-28 flex-col overflow-hidden">
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <SmartImage
          src={barber.photo}
          alt={`Foto de ${barber.name}`}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="img-zoom object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-card via-card/60 to-transparent" aria-hidden />
        <div className="absolute bottom-4 left-5 right-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">{barber.specialty.split(",")[0]}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-2xl font-semibold uppercase tracking-wide">
          {barber.name}
          {barber.nickname && (
            <span className="ml-2 font-serif text-lg font-medium normal-case italic text-primary">“{barber.nickname}”</span>
          )}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{barber.specialty}</p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Rating value={barber.rating} />
            <span className="font-semibold text-foreground">{barber.rating.toFixed(1).replace(".", ",")}</span>
            <span>({formatNumber(barber.reviewsCount)})</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Award className="size-3.5 text-primary" aria-hidden />
            {barber.yearsExperience} {barber.yearsExperience === 1 ? "ano" : "anos"} de experiência
          </span>
        </div>

        {full && (
          <>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{barber.bio}</p>
            {offered.length > 0 && (
              <div className="mt-5">
                <h4 className="mb-2 font-sans text-xs font-semibold uppercase tracking-widest text-foreground/80">
                  Serviços oferecidos
                </h4>
                <ul className="flex flex-wrap gap-1.5">
                  {offered.map((s) => (
                    <li key={s.id} className="rounded-full border px-2.5 py-1 text-xs text-muted-foreground">
                      {s.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {barber.instagram && (
              <a
                href={`https://instagram.com/${barber.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex w-fit items-center gap-1.5 text-xs text-muted-foreground hover:text-primary"
              >
                <InstagramIcon className="size-3.5" />@{barber.instagram}
              </a>
            )}
          </>
        )}

        <div className="mt-auto pt-6">
          <Button asChild variant={full ? "default" : "outline"} className="w-full">
            <Link href={`/agendar?barbeiro=${barber.slug}`}>
              <CalendarCheck aria-hidden />
              Agendar com {displayName(barber)}
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
