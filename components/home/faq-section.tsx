import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { homeContent } from "@/config/content";
import type { SiteSettings } from "@/types/settings";

type Faq = SiteSettings["content"]["faq"];

export function FaqSection({ faq }: { faq: Faq }) {
  if (!faq.length) return null;
  const c = homeContent.faq;
  return (
    <section className="py-20 md:py-28" aria-labelledby="faq">
      <div className="container grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <SectionHeading id="faq" eyebrow={c.eyebrow} title={c.title} />
        <Reveal delay={0.05}>
          <Accordion type="single" collapsible className="border-t">
            {faq.map((item, i) => (
              <AccordionItem key={`${item.q}-${i}`} value={`item-${i}`}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}

export function faqJsonLd(faq: Faq) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
