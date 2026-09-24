import { Quote } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { Rating } from "@/components/shared/rating";
import { SectionHeading } from "@/components/shared/section-heading";
import { homeContent, testimonials } from "@/config/content";
import { initials } from "@/lib/utils";

export function Testimonials() {
  const c = homeContent.testimonials;
  return (
    <section className="border-y bg-card/30 py-20 md:py-28" aria-labelledby="depoimentos">
      <div className="container">
        <SectionHeading id="depoimentos" eyebrow={c.eyebrow} title={c.title} align="center" />
        <Stagger as="ul" className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <StaggerItem as="li" key={t.name} className="card-interactive flex flex-col p-6">
              <figure className="flex h-full flex-col">
                <Quote className="size-8 text-primary/40" aria-hidden />
                <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-foreground/90">“{t.text}”</blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t pt-5">
                  <span
                    className="inline-flex size-10 items-center justify-center rounded-full bg-primary/15 font-display text-sm font-semibold text-primary"
                    aria-hidden
                  >
                    {initials(t.name)}
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-semibold">{t.name}</span>
                    <span className="block text-xs text-muted-foreground">{t.detail}</span>
                  </span>
                  <Rating value={t.rating} />
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
