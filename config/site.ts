/**
 * ───────────────────────────────────────────────────────────────
 *  IDENTIDADE E CONTATO DA BARBEARIA
 *  Todos os dados marcados com [FICTÍCIO] devem ser substituídos
 *  pelos dados reais antes de publicar. Veja CONTENT.md.
 * ───────────────────────────────────────────────────────────────
 */

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const siteConfig = {
  name: "Navalha & Arte Barber Shop",
  shortName: "Navalha & Arte",
  /** Partes do nome usadas no logotipo (a segunda recebe destaque). */
  logo: { primary: "Navalha", secondary: "& Arte", tagline: "Barber Shop" },
  slogan: "Tradição na navalha. Arte em cada detalhe.",
  description:
    "Barbearia premium em Porto Velho (RO). Cortes clássicos e modernos, fade, barboterapia, coloração e atendimento kids. Agende online em poucos cliques.",
  url: siteUrl,
  locale: "pt-BR",
  ogLocale: "pt_BR",
  keywords: [
    "barbearia Porto Velho",
    "barbearia em Porto Velho RO",
    "corte masculino Porto Velho",
    "fade Porto Velho",
    "barba Porto Velho",
    "barboterapia",
    "agendar barbeiro online",
  ],

  /** [FICTÍCIO] Contatos */
  contact: {
    phoneDisplay: "(69) 3222-0000",
    phoneE164: "+556932220000",
    /** Somente dígitos, com DDI 55 — usado nos links wa.me */
    whatsapp: "5569990000000",
    whatsappDisplay: "(69) 99000-0000",
    email: "contato@navalhaearte.com.br",
    instagramHandle: "navalhaearte.pvh",
    instagramUrl: "https://instagram.com/navalhaearte.pvh",
  },

  /** [FICTÍCIO] Endereço */
  address: {
    street: "Av. Carlos Gomes, 1234",
    neighborhood: "Centro",
    city: "Porto Velho",
    state: "RO",
    postalCode: "76801-000",
    country: "BR",
    reference: "Próximo à Praça das Três Caixas D'Água",
    geo: { lat: -8.7619, lng: -63.9039 },
  },

  /** Números da barra de prova social — [FICTÍCIO] */
  stats: {
    rating: 4.9,
    reviewsCount: 1280,
    clientsServed: 15000,
    yearsExperience: 12,
    foundedYear: 2014,
  },

  /** [FICTÍCIO] Dados legais usados nos Termos e na Política de Privacidade */
  legal: {
    companyName: "Navalha & Arte Barbearia LTDA",
    cnpj: "00.000.000/0001-00",
    privacyEmail: "privacidade@navalhaearte.com.br",
    forum: "Comarca de Porto Velho, Estado de Rondônia",
    lastUpdated: "2026-09-24",
  },

  priceRange: "$$",
} as const;

export type SiteConfig = typeof siteConfig;

export const fullAddress = `${siteConfig.address.street} — ${siteConfig.address.neighborhood}, ${siteConfig.address.city} — ${siteConfig.address.state}, ${siteConfig.address.postalCode}`;
