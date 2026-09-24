# CONTENT.md — textos e dados editáveis

Este documento lista **tudo o que muda de uma barbearia para outra** e onde fica cada item.
Itens marcados com **[FICTÍCIO]** são dados de demonstração e **precisam** ser substituídos antes de publicar.

> Fluxo sugerido: envie este arquivo ao cliente, colete os textos reais e aplique nos arquivos indicados.
> Nenhuma troca abaixo exige mudar componentes ou arquitetura.

---

## Checklist de personalização

- [ ] Nome, slogan, descrição e logo — `config/site.ts`, `components/shared/logo.tsx`, `public/icon.svg`
- [ ] Contatos, endereço, coordenadas e redes — `config/site.ts`
- [ ] Números da prova social — `config/site.ts → stats`
- [ ] Dados legais (razão social, CNPJ, e-mail de privacidade, foro) — `config/site.ts → legal`
- [ ] Cores — `app/globals.css` (variáveis `.dark` e `:root`)
- [ ] Fontes — `app/layout.tsx` (imports `@fontsource`) e `--font-*` em `app/globals.css`
- [ ] Barbeiros, serviços e preços — `prisma/data.ts` → `npm run db:seed`
- [ ] Horários de funcionamento — `/admin/horarios` (ou `config/business.ts` antes do seed)
- [ ] Regras de agendamento/cancelamento — `config/business.ts`
- [ ] Fotos dos barbeiros — `public/images/barbers/` (ou campo `photo` em `prisma/data.ts`)
- [ ] Galeria — `public/images/gallery/` e lista em `config/content.ts → gallery`
- [ ] Depoimentos reais (com autorização) — `config/content.ts → testimonials`
- [ ] FAQ — `config/content.ts → faq`
- [ ] Arte do hero (opcional) — `components/home/hero-art.tsx`
- [ ] `NEXT_PUBLIC_SITE_URL` com o domínio final; `SEED_DEMO_BOOKINGS="false"`; `NEXT_PUBLIC_HIDE_DEMO_NOTES="true"`
- [ ] Revisar Termos e Política de Privacidade com um profissional jurídico

---

## 1. Identidade — `config/site.ts`

| Campo | Valor atual |
| --- | --- |
| `name` | Navalha & Arte Barber Shop |
| `shortName` | Navalha & Arte |
| `logo` | "Navalha" + "& Arte" (itálico dourado) + "Barber Shop" |
| `slogan` | Tradição na navalha. Arte em cada detalhe. |
| `description` (SEO) | Barbearia premium em Porto Velho (RO). Cortes clássicos e modernos, fade, barboterapia, coloração e atendimento kids. Agende online em poucos cliques. |
| `keywords` | barbearia Porto Velho, corte masculino Porto Velho, fade Porto Velho, barba Porto Velho, barboterapia, agendar barbeiro online… |

### Contatos **[FICTÍCIO]**

| Campo | Valor |
| --- | --- |
| Telefone | (69) 3222-0000 (`+556932220000`) |
| WhatsApp | (69) 99000-0000 (`5569990000000` — com DDI, só dígitos) |
| E-mail | contato@navalhaearte.com.br |
| Instagram | @navalhaearte.pvh |

### Endereço **[FICTÍCIO]**

Av. Carlos Gomes, 1234 — Centro, Porto Velho — RO, 76801-000 · Referência: Próximo à Praça das Três Caixas D'Água ·
Coordenadas `-8.7619, -63.9039` (usadas no mapa, no botão "Como chegar" e no JSON-LD).

### Prova social **[FICTÍCIO]**

Nota 4,9 · 1.280 avaliações · 15 mil+ clientes atendidos · 12 anos de experiência · fundada em 2014.

### Dados legais **[FICTÍCIO]**

Navalha & Arte Barbearia LTDA · CNPJ 00.000.000/0001-00 · privacidade@navalhaearte.com.br ·
Foro: Comarca de Porto Velho, Estado de Rondônia · Última atualização: 2026-09-24.

---

## 2. Cores e tipografia — `app/globals.css`

| Token | Tema escuro (padrão) | Uso |
| --- | --- | --- |
| `--background` | `0 0% 4%` (preto profundo) | Fundo |
| `--card` / `--muted` | `0 0% 7%` / `0 0% 11%` (grafite) | Cartões e áreas secundárias |
| `--foreground` | `40 20% 94%` (branco quente) | Texto |
| `--primary` / `--gold` | `38 74% 56%` (dourado/âmbar) | Botões, destaques |
| `--ember` | `8 62% 44%` (vermelho queimado) | Detalhes opcionais |

Fontes: **Oswald** (títulos), **Inter** (texto), **Playfair Display itálico** (acentos como "& Arte").

---

## 3. Navegação e rodapé — `config/content.ts`

- **Menu**: Início · Serviços · Equipe · Minha reserva · Contato (+ botão "Agendar")
- **Rodapé**: Serviços e preços · Nossa equipe · Agendar horário · Consultar reserva · Contato
- **Legais**: Termos de Uso · Política de Privacidade

---

## 4. Home — `config/content.ts → homeContent`

### Hero
- Rótulo: **Porto Velho · Rondônia**
- Título: **Tradição na navalha. / Arte em cada detalhe.**
- Subtítulo: Cortes precisos, barba alinhada e um ambiente pensado para você relaxar. Agende em menos de um minuto e chegue só na hora.
- Botões: **Agendar agora** · **Ver serviços**
- Selo: Atendimento com hora marcada

### Prova social
avaliação média · avaliações · clientes atendidos · anos de experiência

### Seções
| Seção | Rótulo | Título | Descrição |
| --- | --- | --- | --- |
| Serviços | Serviços | Os mais procurados | Do corte clássico ao degradê navalhado, cada serviço tem tempo certo e preço claro. |
| Equipe | Equipe | Mãos que conhecem o ofício | Profissionais especializados, cada um com seu estilo — escolha o seu ou deixe com a gente. |
| Galeria | Galeria | Trabalhos recentes | Uma amostra do que sai da nossa cadeira todos os dias. |
| Depoimentos | Depoimentos | Quem senta na cadeira, volta | — |
| Localização | Localização | Fácil de chegar, difícil de ir embora | No coração de Porto Velho, com estacionamento próximo e ambiente climatizado. |
| FAQ | Dúvidas | Perguntas frequentes | — |
| CTA final | — | Seu próximo corte começa aqui. | Escolha o serviço, o barbeiro e o horário. Sem fila, sem espera. |

### Depoimentos **[FICTÍCIO]** — `testimonials`
1. **Marcos V.** (Cliente desde 2019): "Melhor fade de Porto Velho, sem exagero. Pontualidade impecável e o agendamento online facilita demais."
2. **Thiago R.** (Barboterapia com Lucas): "A toalha quente, a navalha, o acabamento... saio renovado. Virou meu ritual de toda sexta."
3. **Ana P.** (Mãe do Davi, 6 anos): "O Bruno tem uma paciência enorme com criança. Meu filho pede para voltar e o corte fica lindo."
4. **Felipe S.** (Luzes com Diego): "Fiz platinado pela primeira vez e o resultado ficou exatamente como eu queria. Cuidado total com o cabelo."
5. **Gustavo L.** (Corte + barba): "Ambiente top, música boa e café. Dá para ver que cada detalhe foi pensado. Recomendo de olhos fechados."
6. **Rodrigo M.** (Cliente desde 2021): "Nunca espero mais do que cinco minutos. Chego, sento e saio com o corte perfeito."

### Galeria **[FICTÍCIO]** — `gallery` (arquivos em `public/images/gallery/`)
Low fade texturizado · Barba desenhada · Degradê navalhado · Platinado global · Corte social clássico · Corte kids com risco · Mid fade + barba · Pigmentação de barba

### FAQ — `faq`
1. **Preciso agendar ou posso ir direto?** — Trabalhamos com hora marcada para você não esperar. Encaixes sem agendamento dependem da disponibilidade do dia — confirme pelo WhatsApp.
2. **Como cancelo ou remarco meu horário?** — Acesse "Minha reserva" com o código da reserva e seu WhatsApp. O cancelamento online é permitido até 2 horas antes; para remarcar, envie uma solicitação e a gente confirma o novo horário.
3. **Quais formas de pagamento vocês aceitam?** — Pix, cartões de débito e crédito e dinheiro. O pagamento é feito na barbearia, após o atendimento.
4. **E se eu me atrasar?** — Toleramos até 10 minutos de atraso. Depois disso, o horário pode ser liberado para outro cliente e o atendimento fica sujeito a reencaixe.
5. **Vocês atendem crianças?** — Sim! Temos um barbeiro especializado em cortes infantis e atendimento família, com paciência e cuidado extra.

> Se mudar as regras em `config/business.ts` (2 h, 10 min), atualize também as respostas 2 e 4.

---

## 5. Serviços **[FICTÍCIO]** — `prisma/data.ts → services`

Após editar, rode `npm run db:seed`. `price` em reais; `priceFrom: true` exibe "a partir de"; `featured: true` aparece na Home.

| Categoria | Serviço | Duração | Preço | Descrição |
| --- | --- | --- | --- | --- |
| Cabelo | Corte Clássico ★ | 40 min | R$ 45 | Corte na máquina e tesoura com acabamento na navalha, lavagem e finalização. |
| Cabelo | Fade / Degradê ★ | 45 min | R$ 55 | Low, mid ou high fade com transição suave e contorno preciso. O queridinho da casa. |
| Cabelo | Degradê Navalhado | 50 min | R$ 60 | Degradê finalizado com navalha até a pele, para um acabamento extremamente limpo. |
| Cabelo | Corte na Tesoura | 50 min | R$ 60 | Para cabelos médios e longos: volume controlado, camadas e caimento natural. |
| Cabelo | Pezinho / Acabamento | 15 min | R$ 20 | Manutenção do contorno entre um corte e outro. Rápido e preciso. |
| Barba | Barba Tradicional ★ | 30 min | R$ 40 | Aparo, desenho e acabamento na navalha com toalha quente e pós-barba. |
| Barba | Barboterapia ★ | 45 min | R$ 60 | Ritual completo: toalhas quentes, esfoliação, óleos essenciais e massagem facial. |
| Barba | Barba Desenhada | 35 min | R$ 45 | Linhas geométricas e contornos marcados para uma barba com personalidade. |
| Barba | Pigmentação de Barba | 30 min | R$ 45 | Preenche falhas e uniformiza a cor da barba com resultado natural. |
| Combo | Corte + Barba ★ | 75 min | R$ 90 | O combo mais pedido: qualquer corte da casa com barba tradicional. |
| Combo | Combo Navalha & Arte | 100 min | R$ 130 | Corte, barboterapia e sobrancelha na navalha. A experiência completa da casa. |
| Combo | Pai & Filho | 80 min | R$ 85 | Corte para o pai e para o pequeno (até 12 anos), lado a lado. |
| Química | Luzes | 90 min | a partir de R$ 120 | Mechas iluminadas com descoloração controlada e matização. |
| Química | Platinado | 150 min | a partir de R$ 200 | Descoloração global até o platinado, com tratamento para proteger os fios. |
| Química | Coloração | 60 min | R$ 80 | Tintura para cobrir fios brancos ou mudar o tom, com acabamento natural. |
| Química | Selagem Masculina | 90 min | a partir de R$ 110 | Reduz volume e frizz, deixando o cabelo alinhado e fácil de pentear. |
| Kids | Corte Kids ★ | 35 min | R$ 40 | Corte infantil (até 12 anos) com paciência, carinho e muita conversa. |
| Kids | Kids + Risco | 45 min | R$ 50 | Corte infantil com risco ou desenho simples na máquina. |

★ = destaque na Home. Os nomes das categorias ficam em `lib/constants.ts → CATEGORY_LABELS`.

---

## 6. Barbeiros **[FICTÍCIO]** — `prisma/data.ts → barbers`

| Barbeiro | Especialidade | Exp. | Nota (avaliações) | Instagram |
| --- | --- | --- | --- | --- |
| Rafael "Rafa" Moreira | Fade, degradê e cortes clássicos | 12 anos | 4,9 (412) | @rafa.navalha |
| Lucas Almeida | Barboterapia, barba desenhada e navalhado | 9 anos | 4,9 (356) | @lucas.barba |
| Diego Souza | Coloração, luzes e químicas | 8 anos | 4,8 (241) | @diego.color |
| Bruno Cardoso | Cortes infantis e atendimento família | 10 anos | 5,0 (298) | — |

**Bios**
- **Rafa**: Fundador da casa, o Rafa aprendeu o ofício com o avô e une a escola clássica às técnicas de fade mais atuais. Obsessivo por simetria e transições invisíveis.
- **Lucas**: Especialista em barba, o Lucas transforma o cuidado com a barba em ritual. Toalha quente, navalha afiada e contornos que valorizam o formato do rosto.
- **Diego**: Colorista com formação em visagismo, o Diego domina descoloração, luzes e platinados com foco total na saúde dos fios.
- **Bruno**: Pai de dois, o Bruno tem o dom de deixar a criançada à vontade na cadeira. Também atende adultos que buscam um corte prático e bem-feito.

**Serviços de cada um**: lista `services` (slugs) em cada barbeiro. **Fotos**: substitua os SVGs em
`public/images/barbers/<slug>.svg` ou aponte `photo` para `/images/barbers/<slug>.jpg` (recomendado 800×1000, proporção 4:5).

---

## 7. Horários e regras — `config/business.ts`

- Segunda a sexta: **09:00 às 20:00** · Sábado: **08:00 às 18:00** · Domingo: **fechado**
- Grade 15 min · intervalo entre atendimentos 10 min · antecedência mínima 60 min · agenda aberta por 30 dias
- Cancelamento online até **2 h** antes · tolerância de atraso **10 min** · `autoConfirm: false`
- Prefixo do código da reserva: **NA** (ex.: `NA-7K3F9Q`)

Depois do seed, os horários são editados em **/admin/horarios** (sem deploy).

---

## 8. Agendamento — `config/content.ts → bookingContent`

- Título: **Agende seu horário** · Descrição: Rápido, simples e sem cadastro. Você recebe um código para acompanhar a reserva.
- Etapas: Serviço · Barbeiro · Data · Horário · Seus dados · Resumo
- Sem preferência: "Escolhemos o primeiro profissional disponível no horário."
- Sem horários: "Não há horários disponíveis nessa data. Tente outro dia, outro barbeiro ou "Sem preferência"."
- Sucesso: **Reserva recebida!** — pendente: "Sua solicitação foi registrada. Em breve confirmaremos pelo WhatsApp. Guarde o código abaixo." — confirmada: "Seu horário está confirmado. Guarde o código abaixo para consultar ou cancelar."
- Títulos e subtítulos de cada etapa: `components/booking/booking-wizard.tsx → STEP_COPY`

---

## 9. Outras páginas

| Página | Onde editar | Texto principal |
| --- | --- | --- |
| Contato | `config/content.ts → contactContent` | "Fale com a gente" — Dúvidas, encaixes, eventos ou parcerias. O jeito mais rápido é pelo WhatsApp — respondemos em horário comercial. |
| 404 | `config/content.ts → notFoundContent` | "Esse corte não está no catálogo" — A página que você procura não existe ou mudou de endereço. |
| Serviços | `app/(site)/servicos/page.tsx` | "Serviços e preços" — Preço claro, tempo certo… |
| Equipe | `app/(site)/equipe/page.tsx` | "Mãos que conhecem o ofício" |
| Minha reserva | `app/(site)/minha-reserva/page.tsx` | "Consulte sua reserva" |
| Termos de Uso | `app/(site)/termos/page.tsx` | Seções: identificação, elegibilidade, uso permitido, agendamentos, cancelamentos/atrasos/no-show, preços, dados pessoais, propriedade intelectual, limitação de responsabilidade, alterações, lei aplicável e foro |
| Privacidade | `app/(site)/privacidade/page.tsx` | Seções: controlador, dados coletados, finalidade, base legal, compartilhamento, direitos do titular, retenção (24 meses), segurança, canal de contato |

Os textos legais já usam automaticamente razão social, CNPJ, e-mails, foro, prazos de cancelamento e tolerância definidos
em `config/site.ts` e `config/business.ts`.

---

## 10. Mensagens de WhatsApp pré-preenchidas

| Contexto | Mensagem | Arquivo |
| --- | --- | --- |
| Botão flutuante | Olá! Vim pelo site da Navalha & Arte e gostaria de mais informações. | `components/layout/whatsapp-float.tsx` |
| Após agendar | Olá! Acabei de agendar pelo site. Código… | `components/booking/success-view.tsx` |
| Sem horário | Olá! Não encontrei horário no site. Vocês têm algum encaixe? | `components/booking/steps/time-step.tsx` |
| Admin → cliente | Olá, {nome}! Sua reserva {código} na Navalha & Arte está confirmada… | `components/admin/bookings-board.tsx` |

---

## 11. Avisos de conteúdo fictício

Selos "Imagens ilustrativas" e "Profissionais e fotos fictícios" aparecem na galeria e na equipe; os SVGs trazem a marca
"FOTO/IMAGEM ILUSTRATIVA"; as reservas do seed têm código `NA-DEMO…` e observação `[DEMO]`.
Ao publicar com dados reais: `NEXT_PUBLIC_HIDE_DEMO_NOTES="true"` e `SEED_DEMO_BOOKINGS="false"`.
