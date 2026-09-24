import { Suspense } from "react";
import Link from "next/link";
import { Info } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ServiceCard } from "@/components/services/service-card";
import { ServicesExplorer } from "@/components/services/services-explorer";
import { JsonLd } from "@/components/shared/json-ld";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { getServices } from "@/server/catalog";

export const revalidate = 300;

export const metadata = buildMetadata({
  title: "Serviços e preços",
  description: `Cortes, barba, combos, química e kids na ${siteConfig.shortName}, em ${siteConfig.address.city}. Veja duração e preço de cada serviço e agende online.`,
  path: "/servicos",
});

export default async function ServicesPage() {
  const services = await getServices();

  const offerCatalog = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: `Serviços — ${siteConfig.name}`,
    itemListElement: services.map((s) => ({
      "@type": "Offer",
      price: (s.priceCents / 100).toFixed(2),
      priceCurrency: "BRL",
      itemOffered: { "@type": "Service", name: s.name, description: s.description },
    })),
  };

  return (
    <>
      <JsonLd data={offerCatalog} />
      <PageHeader
        eyebrow="Serviços"
        title="Serviços e preços"
        description="Preço claro, tempo certo. Escolha o serviço e agende direto com o barbeiro de sua preferência."
      />
      <section className="container py-12 md:py-16" aria-label="Lista de serviços">
        <Suspense
          fallback={
            <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <li key={s.id}>
                  <ServiceCard service={s} />
                </li>
              ))}
            </ul>
          }
        >
          <ServicesExplorer services={services} />
        </Suspense>

        <p className="mt-10 flex items-start gap-2 text-sm text-muted-foreground">
          <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
          <span>
            Serviços de química com “a partir de” variam conforme comprimento e volume do cabelo. Pagamento na barbearia (Pix,
            cartão ou dinheiro). Dúvidas? <Link href="/contato" className="text-primary underline-offset-4 hover:underline">Fale com a gente</Link>.
          </span>
        </p>
      </section>
    </>
  );
}
