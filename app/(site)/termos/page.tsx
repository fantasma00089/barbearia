import Link from "next/link";
import { LegalDocument, type LegalSection } from "@/components/legal/legal-document";
import { fullAddress } from "@/lib/site";
import type { SiteSettings } from "@/types/settings";
import { buildMetadata } from "@/lib/seo";
import { getSettings } from "@/server/settings";

export async function generateMetadata() {
  const s = await getSettings();
  return buildMetadata(s, {
    title: "Termos de Uso",
    description: `Regras de uso do site e do agendamento online da ${s.brand.shortName}: cancelamentos, atrasos, no-show, preços e responsabilidades.`,
    path: "/termos",
  });
}

function getSections(s: SiteSettings): LegalSection[] {
  const { legal, contact, booking } = s;
  return [
  {
    id: "identificacao",
    title: "Identificação do site",
    content: (
      <p>
        Este site é operado por <strong>{legal.companyName}</strong>, inscrita no CNPJ sob o nº {legal.cnpj}, com sede em {fullAddress(s)}{" "}
        (“{s.brand.shortName}”, “nós”). Contato: {contact.email} · {contact.phoneDisplay}.
      </p>
    ),
  },
  {
    id: "aceitacao",
    title: "Aceitação e elegibilidade",
    content: (
      <>
        <p>Ao usar o site ou realizar um agendamento, você declara ter lido e concordado com estes Termos e com a <Link href="/privacidade">Política de Privacidade</Link>.</p>
        <p>
          O agendamento online deve ser feito por pessoa maior de 18 anos ou por responsável legal. Serviços para crianças e adolescentes
          exigem a presença de um responsável durante o atendimento.
        </p>
      </>
    ),
  },
  {
    id: "uso-permitido",
    title: "Uso permitido",
    content: (
      <>
        <p>Você se compromete a:</p>
        <ul>
          <li>fornecer informações verdadeiras e um número de WhatsApp de sua titularidade;</li>
          <li>não realizar reservas falsas, em massa ou em nome de terceiros sem autorização;</li>
          <li>não tentar burlar mecanismos de segurança, acessar áreas restritas ou sobrecarregar o sistema;</li>
          <li>não utilizar o conteúdo do site para fins comerciais sem autorização.</li>
        </ul>
        <p>Podemos bloquear reservas ou acessos que violem estas regras.</p>
      </>
    ),
  },
  {
    id: "agendamentos",
    title: "Agendamentos",
    content: (
      <>
        <ul>
          <li>Os horários exibidos consideram a duração do serviço, o expediente e o fuso de Porto Velho (UTC−4).</li>
          <li>É necessária antecedência mínima de {booking.minLeadMinutes} minutos, e a agenda fica aberta para até {booking.maxAdvanceDays} dias.</li>
          <li>
            {booking.autoConfirm
              ? "A reserva é confirmada automaticamente após a conclusão do agendamento."
              : "A reserva é registrada como “aguardando confirmação” e confirmada pela equipe pelo WhatsApp."}
          </li>
          <li>Ao escolher “sem preferência”, o profissional é definido conforme a disponibilidade no horário.</li>
          <li>Guarde o código da reserva: ele e o seu WhatsApp são necessários para consultar ou cancelar.</li>
        </ul>
      </>
    ),
  },
  {
    id: "cancelamentos",
    title: "Cancelamentos, atrasos e no-show",
    content: (
      <>
        <ul>
          <li>
            <strong>Cancelamento:</strong> pode ser feito online em <Link href="/minha-reserva">Minha reserva</Link> até{" "}
            {booking.cancelMinHours} horas antes do horário. Depois disso, fale conosco pelo WhatsApp.
          </li>
          <li>
            <strong>Reagendamento:</strong> pode ser solicitado online; o novo horário só vale após nossa confirmação.
          </li>
          <li>
            <strong>Atrasos:</strong> toleramos até {booking.lateToleranceMinutes} minutos. Após esse prazo, o horário pode ser liberado e o
            atendimento fica sujeito a reencaixe, podendo ter o serviço reduzido para não prejudicar os próximos clientes.
          </li>
          <li>
            <strong>Não comparecimento (no-show):</strong> faltas sem aviso podem limitar novos agendamentos online.
          </li>
          <li>Em caso de imprevisto da barbearia, entraremos em contato para remarcar sem custo.</li>
        </ul>
      </>
    ),
  },
  {
    id: "precos",
    title: "Preços e alterações",
    content: (
      <>
        <p>
          Os preços exibidos estão em reais (R$) e podem ser alterados a qualquer momento, sem aviso prévio. Vale o preço vigente no
          momento do agendamento. Serviços marcados como “a partir de” podem variar conforme comprimento, volume ou condição do cabelo,
          e o valor final será informado antes da execução.
        </p>
        <p>O pagamento é realizado na barbearia, após o atendimento, por Pix, cartão ou dinheiro.</p>
      </>
    ),
  },
  {
    id: "dados",
    title: "Dados pessoais",
    content: (
      <p>
        O tratamento dos dados informados no agendamento segue a Lei Geral de Proteção de Dados (Lei nº 13.709/2018) e está descrito na{" "}
        <Link href="/privacidade">Política de Privacidade</Link>.
      </p>
    ),
  },
  {
    id: "propriedade",
    title: "Propriedade intelectual",
    content: (
      <p>
        Marca, logotipo, textos, fotografias, ilustrações e layout deste site pertencem a {legal.companyName} ou a seus licenciantes e são
        protegidos pela legislação de direitos autorais e de propriedade industrial. É proibida a reprodução sem autorização prévia e por escrito.
      </p>
    ),
  },
  {
    id: "responsabilidade",
    title: "Limitação de responsabilidade",
    content: (
      <>
        <p>
          Empregamos esforços razoáveis para manter o site disponível e as informações corretas, mas não garantimos funcionamento
          ininterrupto ou livre de erros. Não nos responsabilizamos por:
        </p>
        <ul>
          <li>falhas de conexão, de dispositivo ou de serviços de terceiros (como WhatsApp e Google Maps);</li>
          <li>informações incorretas fornecidas pelo usuário, incluindo número de WhatsApp;</li>
          <li>indisponibilidades temporárias para manutenção ou por motivo de força maior.</li>
        </ul>
        <p>Nada nestes Termos limita direitos garantidos pelo Código de Defesa do Consumidor.</p>
      </>
    ),
  },
  {
    id: "alteracoes",
    title: "Alterações destes Termos",
    content: <p>Podemos atualizar estes Termos. A versão vigente é sempre a publicada nesta página, com a data da última atualização.</p>,
  },
  {
    id: "foro",
    title: "Lei aplicável e foro",
    content: (
      <p>
        Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da {legal.forum}, ressalvado o direito
        do consumidor de ajuizar ação no foro de seu domicílio.
      </p>
    ),
  },
];
}

export default async function TermsPage() {
  const s = await getSettings();
  return (
    <LegalDocument
      title="Termos de Uso"
      intro={`Regras para usar o site e o agendamento online da ${s.brand.name}.`}
      lastUpdated={s.legal.lastUpdated}
      sections={getSections(s)}
    />
  );
}
