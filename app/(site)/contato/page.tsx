import { Reveal } from "@/components/motion/reveal";
import { ContactDetails } from "@/components/contact/contact-details";
import { MapEmbed } from "@/components/contact/map-embed";
import { WhatsAppForm } from "@/components/contact/whatsapp-form";
import { PageHeader } from "@/components/shared/page-header";
import { contactContent } from "@/config/content";
import { siteConfig } from "@/config/site";
import { summarizeHours } from "@/lib/hours";
import { buildMetadata } from "@/lib/seo";
import { getBusinessHoursCached } from "@/server/catalog";

export const revalidate = 300;

export const metadata = buildMetadata({
  title: "Contato e localização",
  description: `Endereço, telefone, WhatsApp, Instagram e horário da ${siteConfig.shortName} em ${siteConfig.address.city} — ${siteConfig.address.state}.`,
  path: "/contato",
});

export default async function ContactPage() {
  const hours = summarizeHours(await getBusinessHoursCached());
  return (
    <>
      <PageHeader eyebrow="Contato" title={contactContent.title} description={contactContent.description} />
      <section className="container grid gap-6 py-10 md:py-14 lg:grid-cols-2">
        <Reveal>
          <ContactDetails hours={hours} />
        </Reveal>
        <Reveal delay={0.06}>
          <WhatsAppForm />
        </Reveal>
        <Reveal className="lg:col-span-2">
          <MapEmbed className="min-h-[380px]" />
        </Reveal>
      </section>
    </>
  );
}
