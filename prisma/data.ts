/**
 * ───────────────────────────────────────────────────────────────
 *  CATÁLOGO INICIAL (SEED)
 *  [FICTÍCIO] Barbeiros, serviços e preços de demonstração.
 *  Edite este arquivo e rode `npm run db:seed` para atualizar o banco.
 *  O seed faz upsert pelo `slug`, então é seguro rodar várias vezes.
 * ───────────────────────────────────────────────────────────────
 */

export type SeedCategory = "HAIR" | "BEARD" | "COMBO" | "CHEMICAL" | "KIDS";

export interface SeedService {
  slug: string;
  name: string;
  description: string;
  category: SeedCategory;
  durationMin: number;
  /** Em reais — o seed converte para centavos */
  price: number;
  priceFrom?: boolean;
  featured?: boolean;
}

export interface SeedBarber {
  slug: string;
  name: string;
  nickname?: string;
  specialty: string;
  bio: string;
  yearsExperience: number;
  rating: number;
  reviewsCount: number;
  photo: string;
  instagram?: string;
  /** Slugs dos serviços que o barbeiro atende */
  services: string[];
}

export const services: SeedService[] = [
  // ── Cabelo ──
  {
    slug: "corte-classico",
    name: "Corte Clássico",
    description: "Corte na máquina e tesoura com acabamento na navalha, lavagem e finalização.",
    category: "HAIR",
    durationMin: 40,
    price: 45,
    featured: true,
  },
  {
    slug: "fade-degrade",
    name: "Fade / Degradê",
    description: "Low, mid ou high fade com transição suave e contorno preciso. O queridinho da casa.",
    category: "HAIR",
    durationMin: 45,
    price: 55,
    featured: true,
  },
  {
    slug: "corte-navalhado",
    name: "Degradê Navalhado",
    description: "Degradê finalizado com navalha até a pele, para um acabamento extremamente limpo.",
    category: "HAIR",
    durationMin: 50,
    price: 60,
  },
  {
    slug: "corte-tesoura",
    name: "Corte na Tesoura",
    description: "Para cabelos médios e longos: volume controlado, camadas e caimento natural.",
    category: "HAIR",
    durationMin: 50,
    price: 60,
  },
  {
    slug: "pezinho-acabamento",
    name: "Pezinho / Acabamento",
    description: "Manutenção do contorno entre um corte e outro. Rápido e preciso.",
    category: "HAIR",
    durationMin: 15,
    price: 20,
  },
  // ── Barba ──
  {
    slug: "barba-tradicional",
    name: "Barba Tradicional",
    description: "Aparo, desenho e acabamento na navalha com toalha quente e pós-barba.",
    category: "BEARD",
    durationMin: 30,
    price: 40,
    featured: true,
  },
  {
    slug: "barboterapia",
    name: "Barboterapia",
    description: "Ritual completo: toalhas quentes, esfoliação, óleos essenciais e massagem facial.",
    category: "BEARD",
    durationMin: 45,
    price: 60,
    featured: true,
  },
  {
    slug: "barba-desenhada",
    name: "Barba Desenhada",
    description: "Linhas geométricas e contornos marcados para uma barba com personalidade.",
    category: "BEARD",
    durationMin: 35,
    price: 45,
  },
  {
    slug: "pigmentacao-barba",
    name: "Pigmentação de Barba",
    description: "Preenche falhas e uniformiza a cor da barba com resultado natural.",
    category: "BEARD",
    durationMin: 30,
    price: 45,
  },
  // ── Combo ──
  {
    slug: "combo-corte-barba",
    name: "Corte + Barba",
    description: "O combo mais pedido: qualquer corte da casa com barba tradicional.",
    category: "COMBO",
    durationMin: 75,
    price: 90,
    featured: true,
  },
  {
    slug: "combo-navalha-arte",
    name: "Combo Navalha & Arte",
    description: "Corte, barboterapia e sobrancelha na navalha. A experiência completa da casa.",
    category: "COMBO",
    durationMin: 100,
    price: 130,
  },
  {
    slug: "combo-pai-filho",
    name: "Pai & Filho",
    description: "Corte para o pai e para o pequeno (até 12 anos), lado a lado.",
    category: "COMBO",
    durationMin: 80,
    price: 85,
  },
  // ── Química ──
  {
    slug: "luzes",
    name: "Luzes",
    description: "Mechas iluminadas com descoloração controlada e matização.",
    category: "CHEMICAL",
    durationMin: 90,
    price: 120,
    priceFrom: true,
  },
  {
    slug: "platinado",
    name: "Platinado",
    description: "Descoloração global até o platinado, com tratamento para proteger os fios.",
    category: "CHEMICAL",
    durationMin: 150,
    price: 200,
    priceFrom: true,
  },
  {
    slug: "coloracao",
    name: "Coloração",
    description: "Tintura para cobrir fios brancos ou mudar o tom, com acabamento natural.",
    category: "CHEMICAL",
    durationMin: 60,
    price: 80,
  },
  {
    slug: "selagem",
    name: "Selagem Masculina",
    description: "Reduz volume e frizz, deixando o cabelo alinhado e fácil de pentear.",
    category: "CHEMICAL",
    durationMin: 90,
    price: 110,
    priceFrom: true,
  },
  // ── Kids ──
  {
    slug: "corte-kids",
    name: "Corte Kids",
    description: "Corte infantil (até 12 anos) com paciência, carinho e muita conversa.",
    category: "KIDS",
    durationMin: 35,
    price: 40,
    featured: true,
  },
  {
    slug: "kids-risco",
    name: "Kids + Risco",
    description: "Corte infantil com risco ou desenho simples na máquina.",
    category: "KIDS",
    durationMin: 45,
    price: 50,
  },
];

export const barbers: SeedBarber[] = [
  {
    slug: "rafael-moreira",
    name: "Rafael Moreira",
    nickname: "Rafa",
    specialty: "Fade, degradê e cortes clássicos",
    bio: "Fundador da casa, o Rafa aprendeu o ofício com o avô e une a escola clássica às técnicas de fade mais atuais. Obsessivo por simetria e transições invisíveis.",
    yearsExperience: 12,
    rating: 4.9,
    reviewsCount: 412,
    photo: "/images/barbers/rafael-moreira.svg",
    instagram: "rafa.navalha",
    services: [
      "corte-classico",
      "fade-degrade",
      "corte-navalhado",
      "corte-tesoura",
      "pezinho-acabamento",
      "barba-tradicional",
      "combo-corte-barba",
      "combo-navalha-arte",
      "combo-pai-filho",
      "corte-kids",
    ],
  },
  {
    slug: "lucas-almeida",
    name: "Lucas Almeida",
    specialty: "Barboterapia, barba desenhada e navalhado",
    bio: "Especialista em barba, o Lucas transforma o cuidado com a barba em ritual. Toalha quente, navalha afiada e contornos que valorizam o formato do rosto.",
    yearsExperience: 9,
    rating: 4.9,
    reviewsCount: 356,
    photo: "/images/barbers/lucas-almeida.svg",
    instagram: "lucas.barba",
    services: [
      "corte-classico",
      "corte-navalhado",
      "pezinho-acabamento",
      "barba-tradicional",
      "barboterapia",
      "barba-desenhada",
      "pigmentacao-barba",
      "combo-corte-barba",
      "combo-navalha-arte",
    ],
  },
  {
    slug: "diego-souza",
    name: "Diego Souza",
    specialty: "Coloração, luzes e químicas",
    bio: "Colorista com formação em visagismo, o Diego domina descoloração, luzes e platinados com foco total na saúde dos fios.",
    yearsExperience: 8,
    rating: 4.8,
    reviewsCount: 241,
    photo: "/images/barbers/diego-souza.svg",
    instagram: "diego.color",
    services: [
      "corte-classico",
      "fade-degrade",
      "pezinho-acabamento",
      "pigmentacao-barba",
      "combo-corte-barba",
      "luzes",
      "platinado",
      "coloracao",
      "selagem",
    ],
  },
  {
    slug: "bruno-cardoso",
    name: "Bruno Cardoso",
    specialty: "Cortes infantis e atendimento família",
    bio: "Pai de dois, o Bruno tem o dom de deixar a criançada à vontade na cadeira. Também atende adultos que buscam um corte prático e bem-feito.",
    yearsExperience: 10,
    rating: 5,
    reviewsCount: 298,
    photo: "/images/barbers/bruno-cardoso.svg",
    services: [
      "corte-classico",
      "fade-degrade",
      "pezinho-acabamento",
      "barba-tradicional",
      "combo-corte-barba",
      "combo-pai-filho",
      "corte-kids",
      "kids-risco",
    ],
  },
];
