import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { toOpeningHoursSpecification } from "./hours";
import { instagramUrl, phoneE164 } from "./site";
import type { BusinessHourDTO } from "@/types";
import type { SiteSettings } from "@/types/settings";

interface PageMeta {
  title?: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
}

/** Metadata por página com canonical e Open Graph consistentes. */
export function buildMetadata(s: SiteSettings, { title, description = s.brand.description, path = "/", noIndex }: PageMeta = {}): Metadata {
  const fullTitle = title ? `${title} | ${s.brand.shortName}` : `${s.brand.name} — Barbearia em ${s.address.city}`;
  return {
    title: fullTitle,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: siteConfig.ogLocale,
      url: path,
      siteName: s.brand.name,
      title: fullTitle,
      description,
    },
    twitter: { card: "summary_large_image", title: fullTitle, description },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

export function barberShopJsonLd(s: SiteSettings, hours: BusinessHourDTO[]) {
  const { address, contact, stats } = s;
  return {
    "@context": "https://schema.org",
    "@type": "BarberShop",
    "@id": `${siteConfig.url}/#barbershop`,
    name: s.brand.name,
    description: s.brand.description,
    slogan: s.brand.slogan,
    url: siteConfig.url,
    image: `${siteConfig.url}/opengraph-image`,
    logo: s.brand.logoUrl ? new URL(s.brand.logoUrl, siteConfig.url).toString() : `${siteConfig.url}/icon.svg`,
    telephone: phoneE164(s),
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
      addressCountry: "BR",
    },
    geo: { "@type": "GeoCoordinates", latitude: address.lat, longitude: address.lng },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${address.lat},${address.lng}`,
    openingHoursSpecification: toOpeningHoursSpecification(hours),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: stats.rating,
      reviewCount: stats.reviewsCount,
      bestRating: 5,
    },
    sameAs: contact.instagramHandle ? [instagramUrl(s)] : [],
    potentialAction: {
      "@type": "ReserveAction",
      target: { "@type": "EntryPoint", urlTemplate: `${siteConfig.url}/agendar` },
      result: { "@type": "Reservation", name: "Agendamento de horário" },
    },
  };
}
