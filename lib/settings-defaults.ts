/**
 * Valores iniciais das configurações — vêm de config/*.ts.
 * O painel grava por cima deles na tabela `Setting`; o que não foi editado usa estes padrões.
 */
import { businessConfig } from "@/config/business";
import { faq, gallery, homeContent, testimonials } from "@/config/content";
import { siteConfig } from "@/config/site";
import type { SiteSettings } from "@/types/settings";

export const DEFAULT_SETTINGS: SiteSettings = {
  brand: {
    name: siteConfig.name,
    shortName: siteConfig.shortName,
    logoPrimary: siteConfig.logo.primary,
    logoSecondary: siteConfig.logo.secondary,
    logoTagline: siteConfig.logo.tagline,
    logoUrl: null,
    slogan: siteConfig.slogan,
    description: siteConfig.description,
    accentColor: "#d9a441",
  },
  contact: {
    phoneDisplay: siteConfig.contact.phoneDisplay,
    whatsapp: siteConfig.contact.whatsapp,
    email: siteConfig.contact.email,
    instagramHandle: siteConfig.contact.instagramHandle,
  },
  address: {
    street: siteConfig.address.street,
    neighborhood: siteConfig.address.neighborhood,
    city: siteConfig.address.city,
    state: siteConfig.address.state,
    postalCode: siteConfig.address.postalCode,
    reference: siteConfig.address.reference,
    lat: siteConfig.address.geo.lat,
    lng: siteConfig.address.geo.lng,
  },
  stats: { ...siteConfig.stats },
  legal: { ...siteConfig.legal },
  booking: {
    slotStepMinutes: businessConfig.booking.slotStepMinutes,
    bufferMinutes: businessConfig.booking.bufferMinutes,
    minLeadMinutes: businessConfig.booking.minLeadMinutes,
    maxAdvanceDays: businessConfig.booking.maxAdvanceDays,
    autoConfirm: businessConfig.booking.autoConfirm,
    cancelMinHours: businessConfig.cancellation.minHoursBefore,
    lateToleranceMinutes: businessConfig.lateToleranceMinutes,
  },
  content: {
    hero: {
      eyebrow: homeContent.hero.eyebrow,
      titleLine1: homeContent.hero.titleLines[0],
      titleLine2: homeContent.hero.titleLines[1],
      subtitle: homeContent.hero.subtitle,
      badge: homeContent.hero.badge,
    },
    finalCta: { title: homeContent.finalCta.title, description: homeContent.finalCta.description },
    faq: faq.map((f) => ({ ...f })),
    testimonials: testimonials.map((t) => ({ ...t })),
    gallery: gallery.map((g) => ({ ...g })),
  },
};

/** Mescla o JSON salvo sobre os padrões (seção a seção), tolerando campos novos/ausentes. */
export function mergeSettings(saved: Partial<Record<keyof SiteSettings, unknown>> | null): SiteSettings {
  const out = structuredClone(DEFAULT_SETTINGS);
  if (!saved) return out;
  for (const key of Object.keys(out) as (keyof SiteSettings)[]) {
    const value = saved[key];
    if (value && typeof value === "object") {
      if (key === "content") {
        const c = value as Partial<SiteSettings["content"]>;
        out.content = {
          hero: { ...out.content.hero, ...c.hero },
          finalCta: { ...out.content.finalCta, ...c.finalCta },
          faq: Array.isArray(c.faq) ? c.faq : out.content.faq,
          testimonials: Array.isArray(c.testimonials) ? c.testimonials : out.content.testimonials,
          gallery: Array.isArray(c.gallery) ? c.gallery : out.content.gallery,
        };
      } else {
        Object.assign(out[key], value);
      }
    }
  }
  return out;
}
