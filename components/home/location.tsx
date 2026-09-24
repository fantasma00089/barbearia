import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { ContactDetails } from "@/components/contact/contact-details";
import { MapEmbed } from "@/components/contact/map-embed";
import { homeContent } from "@/config/content";
import type { HoursGroup } from "@/lib/hours";

export function Location({ hours }: { hours: HoursGroup[] }) {
  const c = homeContent.location;
  return (
    <section className="border-y bg-card/30 py-20 md:py-28" aria-labelledby="localizacao">
      <div className="container">
        <SectionHeading id="localizacao" eyebrow={c.eyebrow} title={c.title} description={c.description} />
        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          <Reveal>
            <ContactDetails hours={hours} />
          </Reveal>
          <Reveal delay={0.06}>
            <MapEmbed className="h-full min-h-[360px]" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
