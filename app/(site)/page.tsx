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
import { getSettings } from "@/server/settings";

export const revalidate = 300;

export default async function HomePage() {
  const [services, barbers, hours, settings] = await Promise.all([
    getServices(),
    getBarbers(),
    getBusinessHoursCached(),
    getSettings(),
  ]);
  const { content } = settings;
  const featured = services.filter((s) => s.featured).slice(0, 6);

  return (
    <>
      <JsonLd data={[barberShopJsonLd(settings, hours), ...(content.faq.length ? [faqJsonLd(content.faq)] : [])]} />
      <Hero />
      <SocialProof stats={settings.stats} />
      <FeaturedServices services={featured.length ? featured : services.slice(0, 6)} />
      <BarbersHighlight barbers={barbers} />
      <Gallery gallery={content.gallery} />
      <Testimonials testimonials={content.testimonials} />
      <Location settings={settings} hours={summarizeHours(hours)} />
      <FaqSection faq={content.faq} />
      <FinalCta settings={settings} />
    </>
  );
}
