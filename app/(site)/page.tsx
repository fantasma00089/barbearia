import { BarbersHighlight } from "@/components/home/barbers-highlight";
import { FaqSection, faqJsonLd } from "@/components/home/faq-section";
import { FeaturedServices } from "@/components/home/featured-services";
import { FinalCta } from "@/components/home/final-cta";
import { Gallery } from "@/components/home/gallery";
import { Hero } from "@/components/home/hero";
import { Location } from "@/components/home/location";
import { SocialProof } from "@/components/home/social-proof";
import { Testimonials } from "@/components/home/testimonials";
import { JsonLd } from "@/components/shared/json-ld";
import { summarizeHours } from "@/lib/hours";
import { barberShopJsonLd } from "@/lib/seo";
import { getBarbers, getBusinessHoursCached, getServices } from "@/server/catalog";

export const revalidate = 300;

export default async function HomePage() {
  const [services, barbers, hours] = await Promise.all([getServices(), getBarbers(), getBusinessHoursCached()]);
  const featured = services.filter((s) => s.featured).slice(0, 6);

  return (
    <>
      <JsonLd data={[barberShopJsonLd(hours), faqJsonLd()]} />
      <Hero />
      <SocialProof />
      <FeaturedServices services={featured.length ? featured : services.slice(0, 6)} />
      <BarbersHighlight barbers={barbers} />
      <Gallery />
      <Testimonials />
      <Location hours={summarizeHours(hours)} />
      <FaqSection />
      <FinalCta />
    </>
  );
}
