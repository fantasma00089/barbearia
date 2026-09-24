/**
 * ───────────────────────────────────────────────────────────────
 *  TEXTOS EDITÁVEIS DO SITE
 *  Todo texto de marketing fica aqui. Depoimentos e fotos marcados
 *  como [FICTÍCIO] devem ser trocados por conteúdo real.
 *  Serviços, preços e barbeiros ficam em prisma/data.ts (seed).
 * ───────────────────────────────────────────────────────────────
 */

export const navigation = [
  { href: "/", label: "Início" },
  { href: "/servicos", label: "Serviços" },
  { href: "/equipe", label: "Equipe" },
  { href: "/minha-reserva", label: "Minha reserva" },
  { href: "/contato", label: "Contato" },
] as const;

export const footerLinks = [
  { href: "/servicos", label: "Serviços e preços" },
  { href: "/equipe", label: "Nossa equipe" },
  { href: "/agendar", label: "Agendar horário" },
  { href: "/minha-reserva", label: "Consultar reserva" },
  { href: "/contato", label: "Contato" },
] as const;

export const legalLinks = [
  { href: "/termos", label: "Termos de Uso" },
  { href: "/privacidade", label: "Política de Privacidade" },
] as const;

export const homeContent = {
  hero: {
    eyebrow: "Porto Velho · Rondônia",
    titleLines: ["Tradição na navalha.", "Arte em cada detalhe."],
    subtitle:
      "Cortes precisos, barba alinhada e um ambiente pensado para você relaxar. Agende em menos de um minuto e chegue só na hora.",
    primaryCta: "Agendar agora",
    secondaryCta: "Ver serviços",
    badge: "Atendimento com hora marcada",
  },
  socialProof: {
    ratingLabel: "avaliação média",
    reviewsLabel: "avaliações",
    clientsLabel: "clientes atendidos",
    yearsLabel: "anos de experiência",
  },
  services: {
    eyebrow: "Serviços",
    title: "Os mais procurados",
    description: "Do corte clássico ao degradê navalhado, cada serviço tem tempo certo e preço claro.",
    cta: "Ver todos os serviços",
  },
  barbers: {
    eyebrow: "Equipe",
    title: "Mãos que conhecem o ofício",
    description: "Profissionais especializados, cada um com seu estilo — escolha o seu ou deixe com a gente.",
    cta: "Conhecer a equipe",
  },
  gallery: {
    eyebrow: "Galeria",
    title: "Trabalhos recentes",
    description: "Uma amostra do que sai da nossa cadeira todos os dias.",
  },
  testimonials: {
    eyebrow: "Depoimentos",
    title: "Quem senta na cadeira, volta",
  },
  location: {
    eyebrow: "Localização",
    title: "Fácil de chegar, difícil de ir embora",
    description: "No coração de Porto Velho, com estacionamento próximo e ambiente climatizado.",
  },
  faq: {
    eyebrow: "Dúvidas",
    title: "Perguntas frequentes",
  },
  finalCta: {
    title: "Seu próximo corte começa aqui.",
    description: "Escolha o serviço, o barbeiro e o horário. Sem fila, sem espera.",
    primary: "Agendar agora",
    secondary: "Falar no WhatsApp",
  },
} as const;

/** [FICTÍCIO] Depoimentos — substitua por avaliações reais (com autorização). */
export const testimonials = [
  {
    name: "Marcos V.",
    detail: "Cliente desde 2019",
    rating: 5,
    text: "Melhor fade de Porto Velho, sem exagero. Pontualidade impecável e o agendamento online facilita demais.",
  },
  {
    name: "Thiago R.",
    detail: "Barboterapia com Lucas",
    rating: 5,
    text: "A toalha quente, a navalha, o acabamento... saio renovado. Virou meu ritual de toda sexta.",
  },
  {
    name: "Ana P.",
    detail: "Mãe do Davi, 6 anos",
    rating: 5,
    text: "O Bruno tem uma paciência enorme com criança. Meu filho pede para voltar e o corte fica lindo.",
  },
  {
    name: "Felipe S.",
    detail: "Luzes com Diego",
    rating: 5,
    text: "Fiz platinado pela primeira vez e o resultado ficou exatamente como eu queria. Cuidado total com o cabelo.",
  },
  {
    name: "Gustavo L.",
    detail: "Corte + barba",
    rating: 5,
    text: "Ambiente top, música boa e café. Dá para ver que cada detalhe foi pensado. Recomendo de olhos fechados.",
  },
  {
    name: "Rodrigo M.",
    detail: "Cliente desde 2021",
    rating: 5,
    text: "Nunca espero mais do que cinco minutos. Chego, sento e saio com o corte perfeito.",
  },
] as const;

/** [FICTÍCIO] Galeria — troque os arquivos em /public/images/gallery. */
export const gallery = [
  { src: "/images/gallery/corte-01.svg", title: "Low fade texturizado", category: "Cabelo" },
  { src: "/images/gallery/corte-02.svg", title: "Barba desenhada", category: "Barba" },
  { src: "/images/gallery/corte-03.svg", title: "Degradê navalhado", category: "Cabelo" },
  { src: "/images/gallery/corte-04.svg", title: "Platinado global", category: "Química" },
  { src: "/images/gallery/corte-05.svg", title: "Corte social clássico", category: "Cabelo" },
  { src: "/images/gallery/corte-06.svg", title: "Corte kids com risco", category: "Kids" },
  { src: "/images/gallery/corte-07.svg", title: "Mid fade + barba", category: "Combo" },
  { src: "/images/gallery/corte-08.svg", title: "Pigmentação de barba", category: "Barba" },
] as const;

export const faq = [
  {
    q: "Preciso agendar ou posso ir direto?",
    a: "Trabalhamos com hora marcada para você não esperar. Encaixes sem agendamento dependem da disponibilidade do dia — confirme pelo WhatsApp.",
  },
  {
    q: "Como cancelo ou remarco meu horário?",
    a: "Acesse “Minha reserva” com o código da reserva e seu WhatsApp. O cancelamento online é permitido até 2 horas antes; para remarcar, envie uma solicitação e a gente confirma o novo horário.",
  },
  {
    q: "Quais formas de pagamento vocês aceitam?",
    a: "Pix, cartões de débito e crédito e dinheiro. O pagamento é feito na barbearia, após o atendimento.",
  },
  {
    q: "E se eu me atrasar?",
    a: "Toleramos até 10 minutos de atraso. Depois disso, o horário pode ser liberado para outro cliente e o atendimento fica sujeito a reencaixe.",
  },
  {
    q: "Vocês atendem crianças?",
    a: "Sim! Temos um barbeiro especializado em cortes infantis e atendimento família, com paciência e cuidado extra.",
  },
] as const;

export const bookingContent = {
  title: "Agende seu horário",
  description: "Rápido, simples e sem cadastro. Você recebe um código para acompanhar a reserva.",
  steps: ["Serviço", "Barbeiro", "Data", "Horário", "Seus dados", "Resumo"],
  anyBarberLabel: "Sem preferência",
  anyBarberDescription: "Escolhemos o primeiro profissional disponível no horário.",
  noSlots:
    "Não há horários disponíveis nessa data. Tente outro dia, outro barbeiro ou “Sem preferência”.",
  successTitle: "Reserva recebida!",
  successPending:
    "Sua solicitação foi registrada. Em breve confirmaremos pelo WhatsApp. Guarde o código abaixo.",
  successConfirmed: "Seu horário está confirmado. Guarde o código abaixo para consultar ou cancelar.",
} as const;

export const contactContent = {
  title: "Fale com a gente",
  description:
    "Dúvidas, encaixes, eventos ou parcerias. O jeito mais rápido é pelo WhatsApp — respondemos em horário comercial.",
} as const;

export const notFoundContent = {
  title: "Esse corte não está no catálogo",
  description: "A página que você procura não existe ou mudou de endereço.",
} as const;
