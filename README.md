# Navalha & Arte Barber Shop — site base para barbearias

Site completo e reutilizável para barbearias, com **agendamento online**, **painel administrativo** e identidade visual premium.
A barbearia "Navalha & Arte" (Porto Velho — RO) é **fictícia**: todo o conteúdo de demonstração está sinalizado para ser trocado.

> Objetivo: servir de produto base. Para uma barbearia nova você troca nome, logo, cores, fotos, barbeiros, serviços, preços e
> horários **sem mexer na arquitetura**. O passo a passo está em [CONTENT.md](./CONTENT.md).

---

## Sumário

- [Stack](#stack)
- [Funcionalidades](#funcionalidades)
- [Instalação e execução](#instalação-e-execução)
- [Banco de dados e seed](#banco-de-dados-e-seed)
- [Painel administrativo](#painel-administrativo)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Regras de agendamento](#regras-de-agendamento)
- [API](#api)
- [Animações e acessibilidade](#animações-e-acessibilidade)
- [SEO](#seo)
- [Deploy](#deploy)
- [Migrar para PostgreSQL](#migrar-para-postgresql)
- [Pagamentos (Pix)](#pagamentos-pix)
- [Scripts](#scripts)

---

## Stack

| Camada | Tecnologia |
| --- | --- |
| Framework | Next.js 15 (App Router, React 19, Server Components) |
| Linguagem | TypeScript (strict) |
| Estilo | Tailwind CSS 3 + componentes shadcn/ui (Radix) |
| Animações | Framer Motion 12 (`LazyMotion` + `MotionConfig reducedMotion="user"`) |
| Validação | Zod (mesmos schemas no cliente e no servidor) |
| Dados | Prisma 6 + SQLite (pronto para PostgreSQL) |
| Testes | Vitest (motor de horários, fuso, validações) |
| Fontes | Oswald, Inter e Playfair Display via `@fontsource` (locais, sem requisição externa) |

## Funcionalidades

**Site público**

| Rota | Conteúdo |
| --- | --- |
| `/` | Hero animado, prova social, serviços em destaque, barbeiros, galeria, depoimentos, mapa, FAQ e CTA final |
| `/servicos` | Lista com duração, preço e categoria, filtro por categoria (sincronizado com `?categoria=`) e "Agendar este serviço" |
| `/equipe` | 4 barbeiros com foto, bio, experiência, avaliação, serviços e "Agendar com …" + opção "Sem preferência" |
| `/agendar` | Wizard: serviço → barbeiro → data → horário → dados → resumo → sucesso com código |
| `/minha-reserva` | Consulta por código + WhatsApp, cancelamento conforme política e pedido de reagendamento |
| `/contato` | Endereço, telefone, WhatsApp, Instagram, horário, mapa e formulário que abre o WhatsApp |
| `/termos`, `/privacidade` | Termos de Uso e Política de Privacidade (LGPD) gerados a partir da configuração |
| 404 / erro | Página 404 com animação discreta e tela de erro amigável |

**Painel `/admin`** (protegido por senha em variável de ambiente)

- Agenda por dia/barbeiro/status, com contadores
- Confirmar, concluir, marcar falta, cancelar e tratar pedidos de reagendamento
- Atalho para avisar o cliente no WhatsApp com mensagem pronta
- Bloqueio de horários (por barbeiro ou da barbearia inteira)
- Edição do horário de funcionamento por dia da semana, com pausa opcional

## Instalação e execução

Pré-requisitos: **Node.js 20+** e npm.

```bash
# 1. Dependências
npm install

# 2. Variáveis de ambiente
cp .env.example .env
#    edite ADMIN_PASSWORD e ADMIN_SESSION_SECRET (openssl rand -base64 48)

# 3. Banco: cria o SQLite, aplica as migrations e popula com o seed
npm run db:setup

# 4. Desenvolvimento
npm run dev          # http://localhost:3000
```

Produção local:

```bash
npm run build
npm start
```

## Banco de dados e seed

| Comando | O que faz |
| --- | --- |
| `npm run db:setup` | `prisma migrate deploy` + seed (primeira instalação) |
| `npm run db:seed` | Reaplica o seed (upsert por `slug` — seguro rodar várias vezes) |
| `npm run db:migrate` | Cria uma nova migration após alterar `prisma/schema.prisma` |
| `npm run db:reset` | Apaga o banco, recria e roda o seed |
| `npm run db:studio` | Abre o Prisma Studio para editar dados visualmente |

O seed (`prisma/seed.ts`) cria:

- **4 barbeiros** e **18 serviços** (5 categorias) definidos em `prisma/data.ts`
- **Horários de funcionamento**: seg–sex 09:00–20:00, sáb 08:00–18:00, domingo fechado (`config/business.ts`)
- **8 reservas de demonstração** (código `NA-DEMO…`) nos próximos dias — desative com `SEED_DEMO_BOOKINGS="false"`

## Painel administrativo

1. Defina no `.env`:
   - `ADMIN_PASSWORD` — mínimo 8 caracteres
   - `ADMIN_SESSION_SECRET` — mínimo 32 caracteres (`openssl rand -base64 48`)
2. Acesse `/admin` (link "Área restrita" no rodapé).

Segurança: cookie `httpOnly` assinado com HMAC-SHA256 e validade de 8 h, comparação da senha em tempo constante,
limite de 5 tentativas a cada 15 min por IP, `middleware.ts` protegendo `/admin` e `/api/admin`, e checagem de sessão
repetida em cada rota (defesa em profundidade). Sem as variáveis, o painel fica desativado.

## Estrutura de pastas

```
app/
  (site)/            páginas públicas (layout com header/footer, template com transição)
  admin/             login e painel (layout próprio)
  api/               rotas: services, barbers, availability, bookings, admin/*
  sitemap.ts robots.ts manifest.ts opengraph-image.tsx not-found.tsx global-error.tsx
components/
  ui/                componentes shadcn/ui (button, card, input, accordion, sheet…)
  motion/            Reveal, Stagger, Parallax, PageTransition, MotionProvider
  home/ services/ team/ booking/ reservation/ contact/ legal/ admin/ layout/ shared/ forms/ icons/
config/
  site.ts            nome, logo, contatos, endereço, números, dados legais
  business.ts        fuso, horários padrão, regras de agendamento e cancelamento
  content.ts         todos os textos de marketing, FAQ, depoimentos e galeria
lib/
  time.ts            fuso horário sem dependências (America/Porto_Velho)
  scheduling.ts      núcleo puro do cálculo de horários (testado)
  validation/        schemas Zod compartilhados cliente/servidor
  motion.ts          tokens de animação (durações, easing, stagger)
  seo.ts format.ts hours.ts ics.ts phone.ts api-client.ts auth-token.ts
server/
  availability.ts    getAvailableSlots(serviceId, barberId, date)
  bookings.ts        criação transacional, consulta, cancelamento, reagendamento, ações do admin
  catalog.ts admin.ts db.ts http.ts errors.ts rate-limit.ts lock.ts
  auth/admin.ts      sessão do painel
  payments/          contrato para provedores Pix (não implementado)
prisma/
  schema.prisma      modelos  ·  data.ts  catálogo do seed  ·  seed.ts  ·  migrations/
types/               DTOs e enums compartilhados
tests/               testes unitários (Vitest)
scripts/             gerador das imagens ilustrativas (SVG)
public/images/       retratos e galeria (placeholders SVG locais)
```

## Regras de agendamento

Configuráveis em `config/business.ts` (e horários também em `/admin/horarios`):

| Regra | Padrão |
| --- | --- |
| Fuso horário | `America/Porto_Velho` (UTC−4). Datas gravadas em UTC; exibição sempre no fuso da barbearia |
| Horário de funcionamento | Por dia da semana, com pausa opcional (tabela `BusinessHour`) |
| Grade de horários | 15 min (`slotStepMinutes`) |
| Duração | Cada serviço tem `durationMin`; o horário só aparece se o serviço terminar antes do fechamento/pausa |
| Intervalo entre atendimentos | 10 min (`bufferMinutes`), aplicado antes e depois de cada reserva |
| Antecedência mínima | 60 min — nunca exibe horários no passado |
| Janela de agendamento | 30 dias |
| Confirmação | `autoConfirm: false` → reserva nasce "Aguardando confirmação" |
| Cancelamento online | Até 2 h antes |
| Tolerância de atraso | 10 min (texto em termos/sucesso) |

**Sem preferência de barbeiro**: une a disponibilidade de todos os barbeiros que fazem o serviço e, na criação,
atribui o barbeiro livre com menos atendimentos no dia.

**Prevenção de double booking** (`server/bookings.ts → createBooking`):

1. mutex em processo serializa criações simultâneas na mesma instância;
2. transação `Serializable` **recalcula a disponibilidade dentro da transação** antes de gravar;
3. conflitos de serialização (PostgreSQL `P2034`) são repetidos até 3 vezes e viram HTTP 409 com mensagem amigável;
4. no front, um 409 devolve o cliente à etapa de horário com a lista atualizada.

Teste feito: 5 requisições simultâneas para o mesmo barbeiro/horário → 1 reserva criada e 4 respostas 409.

**Nenhum horário disponível**: a API informa o motivo (`closed`, `full`, `past`, `too_far`, `no_barber`) e a
próxima data com vaga; a tela oferece "ver próxima data", "tentar sem preferência" e "pedir encaixe no WhatsApp".

## API

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/api/services?category=HAIR` | Serviços ativos |
| GET | `/api/barbers?serviceId=…` | Barbeiros (filtra por serviço) |
| GET | `/api/availability?serviceId=…&barberId=any\|id&date=YYYY-MM-DD` | Horários livres |
| POST | `/api/bookings` | Cria reserva (Zod + honeypot + rate limit) |
| POST | `/api/bookings/lookup` | Consulta por `code` + `phone` |
| POST | `/api/bookings/cancel` | Cancela conforme política |
| POST | `/api/bookings/reschedule` | Registra pedido de reagendamento |
| POST | `/api/admin/login` · `/api/admin/logout` | Sessão do painel |
| GET · PATCH | `/api/admin/bookings` · `/api/admin/bookings/:id` | Lista e ações (`confirm`, `cancel`, `complete`, `no_show`, `clear_reschedule`) |
| GET · POST · DELETE | `/api/admin/blocks` · `/api/admin/blocks/:id` | Bloqueios de agenda |
| GET · PUT | `/api/admin/hours` | Horário de funcionamento |

Erros seguem o formato `{ error, code?, fieldErrors? }`.

## Animações e acessibilidade

- **Reveal on scroll**: fade + `translateY(16px)`, 400 ms, uma vez por elemento; cards com stagger de 40–80 ms
- **Hero**: título em cascata, CTA com hover/press, arte com parallax apenas em telas ≥ 1024 px
- **Hover**: cards com elevação, borda dourada e zoom de 4 % na imagem; botões com escala 0,97 ao pressionar; underline animado no menu
- **Transição de páginas**: fade de 220 ms (não anima no primeiro carregamento, preservando o LCP)
- **Agendamento**: etapas com `AnimatePresence` direcional, horários com stagger limitado (nunca atrasa mais de 400 ms), skeleton no carregamento e check animado no sucesso
- **Formulários**: foco animado, erros com fade ligados por `aria-describedby`, botões com estado de loading, `role="alert"`/`role="status"`
- Apenas `transform` e `opacity` são animados; `prefers-reduced-motion` troca deslocamentos por fade
- Opções do wizard usam `<input type="radio">` nativo (teclado e leitor de tela funcionam); foco é movido para o título de cada etapa
- Link "Pular para o conteúdo", foco sempre visível, contraste AA, `lang="pt-BR"`, conteúdo visível sem JavaScript (`<noscript>`)

## SEO

- `buildMetadata()` por página (título, descrição, canonical, Open Graph, Twitter)
- Imagem Open Graph gerada em `app/opengraph-image.tsx`
- `sitemap.xml`, `robots.txt` (bloqueia `/admin`, `/api`, `/minha-reserva`) e `manifest.webmanifest`
- JSON-LD `BarberShop` (endereço, geo, horário vindo do banco, avaliação, `ReserveAction`), `FAQPage` e `OfferCatalog`
- Configure `NEXT_PUBLIC_SITE_URL` com o domínio final

## Deploy

As páginas de catálogo usam ISR (revalidação de 5 min) e **o build lê o banco**. Rode as migrations antes do build.

### Opção A — VPS, Railway, Render ou Fly.io com SQLite

Precisa de disco persistente para o arquivo do banco.

```bash
DATABASE_URL="file:/data/barbearia.db"   # caminho no volume persistente
npm ci
npm run db:deploy
SEED_DEMO_BOOKINGS=false npm run db:seed
npm run build
npm start                                 # porta 3000 (use PORT=… para mudar)
```

Use um proxy (Nginx/Caddy) com HTTPS na frente. Faça backup do arquivo `.db`.

### Opção B — Vercel (ou qualquer serverless) com PostgreSQL

Serverless não tem disco persistente, então use PostgreSQL (Neon, Supabase, Railway…):

1. Siga [Migrar para PostgreSQL](#migrar-para-postgresql).
2. Na Vercel, configure `DATABASE_URL`, `NEXT_PUBLIC_SITE_URL`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`.
3. Build command: `prisma migrate deploy && npm run build`.
4. Rode o seed uma vez apontando para o banco de produção: `SEED_DEMO_BOOKINGS=false npm run db:seed`.

> O rate limit e o mutex são em memória (por instância). Em várias instâncias a proteção contra double booking continua
> garantida pela transação serializável; para rate limit global, troque `server/rate-limit.ts` por Redis/Upstash.

## Migrar para PostgreSQL

O schema não usa recursos específicos de banco (status são strings validadas por Zod), então a troca é direta:

1. Em `prisma/schema.prisma`, altere `provider = "sqlite"` para `provider = "postgresql"`.
2. Ajuste `DATABASE_URL` para a URL do Postgres.
3. As migrations são específicas de cada banco: apague `prisma/migrations/` e gere a inicial:
   ```bash
   rm -rf prisma/migrations
   npx prisma migrate dev --name init
   npm run db:seed
   ```
4. Para migrar dados existentes do SQLite, exporte com `prisma studio`/scripts ou uma ferramenta como `pgloader`.

## Pagamentos (Pix)

Ainda **não** há cobrança online — o pagamento é na barbearia. A arquitetura já está pronta:
model `Payment`, campo `Booking.paymentStatus`, contrato `PaymentProvider` e seleção por `PAYMENT_PROVIDER`.
Veja [server/payments/README.md](./server/payments/README.md).

## Scripts

| Script | Descrição |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` / `npm start` | Build e servidor de produção |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript sem emitir arquivos |
| `npm test` | Testes unitários (Vitest) |
| `npm run placeholders` | Regera as imagens ilustrativas SVG |
| `npm run db:*` | Veja [Banco de dados e seed](#banco-de-dados-e-seed) |

---

Dados, depoimentos, fotos, CNPJ e contatos são **fictícios**. Os textos legais são modelos: revise com um profissional
jurídico antes de publicar.
