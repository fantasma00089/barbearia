import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { PlaceholderNote } from "@/components/shared/placeholder-note";
import { SmartImage } from "@/components/shared/smart-image";
import { gallery, homeContent } from "@/config/content";
import { cn } from "@/lib/utils";

// Layout em mosaico: alguns itens ocupam duas linhas no desktop.
const TALL = new Set([0, 3, 5]);

export function Gallery() {
  const c = homeContent.gallery;
  return (
    <section className="py-20 md:py-28" aria-labelledby="galeria">
      <div className="container">
        <SectionHeading id="galeria" eyebrow={c.eyebrow} title={c.title} description={c.description} />
        <Stagger
          as="ul"
          stagger={0.05}
          className="mt-12 grid auto-rows-[180px] grid-cols-2 gap-3 sm:auto-rows-[220px] md:gap-4 lg:grid-cols-4"
        >
          {gallery.map((g, i) => (
            <StaggerItem
              as="li"
              key={g.src}
              className={cn("group relative overflow-hidden rounded-xl border bg-muted", TALL.has(i) && "row-span-2")}
            >
              <figure className="h-full">
                <SmartImage src={g.src} alt={g.title} fill sizes="(min-width: 1024px) 25vw, 50vw" className="img-zoom object-cover" />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 pt-10">
                  <span className="block text-[10px] font-semibold uppercase tracking-widest text-primary">{g.category}</span>
                  <span className="mt-0.5 block text-sm font-medium text-white">{g.title}</span>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
        <div className="mt-6">
          <PlaceholderNote>Imagens ilustrativas — substitua por fotos reais dos trabalhos.</PlaceholderNote>
        </div>
      </div>
    </section>
  );
}
