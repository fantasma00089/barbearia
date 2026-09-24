/** Configurações editáveis pelo painel (/admin/configuracoes e /admin/conteudo). */
export interface SiteSettings {
  brand: {
    name: string;
    shortName: string;
    logoPrimary: string;
    logoSecondary: string;
    logoTagline: string;
    /** Imagem de logo enviada pelo painel (opcional). Sem ela, usa o emblema em SVG. */
    logoUrl: string | null;
    slogan: string;
    description: string;
    /** Cor de destaque (hex). Gera os tons dos temas escuro e claro. */
    accentColor: string;
  };
  contact: {
    phoneDisplay: string;
    /** Somente dígitos com DDI 55 (ex.: 5569990000000) */
    whatsapp: string;
    email: string;
    instagramHandle: string;
  };
  address: {
    street: string;
    neighborhood: string;
    city: string;
    state: string;
    postalCode: string;
    reference: string;
    lat: number;
    lng: number;
  };
  stats: {
    rating: number;
    reviewsCount: number;
    clientsServed: number;
    yearsExperience: number;
    foundedYear: number;
  };
  legal: {
    companyName: string;
    cnpj: string;
    privacyEmail: string;
    forum: string;
    lastUpdated: string;
  };
  booking: {
    slotStepMinutes: number;
    bufferMinutes: number;
    minLeadMinutes: number;
    maxAdvanceDays: number;
    autoConfirm: boolean;
    cancelMinHours: number;
    lateToleranceMinutes: number;
  };
  content: {
    hero: { eyebrow: string; titleLine1: string; titleLine2: string; subtitle: string; badge: string };
    finalCta: { title: string; description: string };
    faq: { q: string; a: string }[];
    testimonials: { name: string; detail: string; rating: number; text: string }[];
    gallery: { src: string; title: string; category: string }[];
  };
}
