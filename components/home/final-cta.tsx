import Link from "next/link";
import { CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { WhatsAppIcon } from "@/components/icons/brand-icons";
import { homeContent } from "@/config/content";
import type { SiteSettings } from "@/types/settings";
import { whatsappLink } from "@/lib/format";

export function FinalCta({ settings }: { settings: SiteSettings }) {
  const c = { ...homeContent.finalCta, ...settings.content.finalCta };
  return (
    <section className="pb-20 md:pb-28" aria-labelledby="cta-final">
      <div className="container">
        <Reveal className="relative overflow-hidden rounded-2xl border border-primary/30 bg-card px-6 py-14 text-center sm:px-12 md:py-20">
          <div className="bg-grain pointer-events-none absolute inset-0" aria-hidden />
          <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" aria-hidden />
          <div className="relative">
            <h2 id="cta-final" className="mx-auto max-w-2xl text-4xl font-semibold uppercase leading-[1.05] sm:text-5xl">
              {c.title}
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">{c.description}</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/agendar">
                  <CalendarCheck aria-hidden /> {c.primary}
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={whatsappLink(settings.contact.whatsapp, `Olá! Vim pelo site da ${settings.brand.shortName}.`)} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon /> {c.secondary}
                </a>
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
