import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { toOpeningHoursSpecification } from "./hours";
import type { BusinessHourDTO } from "@/types";

interface PageMeta {
  title?: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
}

/** Metadata por página com canonical e Open Graph consistentes. */
export function buildMetadata({ title, description = siteConfig.description, path = "/", noIndex }: PageMeta = {}): Metadata {
  const fullTitle = title ? `${title} | ${siteConfig.shortName}` : `${siteConfig.name} — Barbearia em ${siteConfig.address.city}`;
  return {
    title: fullTitle,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: siteConfig.ogLocale,
      url: path,
      siteName: siteConfig.name,
      title: fullTitle,
      description,
    },
    twitter: { card: "summary_large_image", title: fullTitle, description },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

export function barberShopJsonLd(hours: BusinessHourDTO[]) {
  const { address, contact, stats } = siteConfig;
  return {
    "@context": "https://schema.org",
    "@type": "BarberShop",
    "@id": `${siteConfig.url}/#barbershop`,
    name: siteConfig.name,
    description: siteConfig.description,
    slogan: siteConfig.slogan,
    url: siteConfig.url,
    image: `${siteConfig.url}/opengraph-image`,
    logo: `${siteConfig.url}/icon.svg`,
    telephone: contact.phoneE164,
    email: contact.email,
    priceRange: siteConfig.priceRange,
    currenciesAccepted: "BRL",
    paymentAccepted: "Dinheiro, Pix, Cartão de débito, Cartão de crédito",
    foundingDate: String(stats.foundedYear),
    address: {
      "@type": "PostalAddress",
      streetAddress: address.street,
      addressLocality: address.city,
      addressRegion: address.state,
      postalCode: address.postalCode,
      addressCountry: address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: address.geo.lat, longitude: address.geo.lng },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${address.geo.lat},${address.geo.lng}`,
    openingHoursSpecification: toOpeningHoursSpecification(hours),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: stats.rating,
      reviewCount: stats.reviewsCount,
      bestRating: 5,
    },
    sameAs: [contact.instagramUrl],
    potentialAction: {
      "@type": "ReserveAction",
      target: { "@type": "EntryPoint", urlTemplate: `${siteConfig.url}/agendar` },
      result: { "@type": "Reservation", name: "Agendamento de horário" },
    },
  };
}
