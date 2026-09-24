import { LegalDocument, type LegalSection } from "@/components/legal/legal-document";
import { businessConfig } from "@/config/business";
import { fullAddress, whatsappDisplay } from "@/lib/site";
import type { SiteSettings } from "@/types/settings";
import { buildMetadata } from "@/lib/seo";
import { getSettings } from "@/server/settings";

export async function generateMetadata() {
  const s = await getSettings();
  return buildMetadata(s, {
    title: "Política de Privacidade",
    description: `Como a ${s.brand.shortName} coleta, usa e protege seus dados pessoais no agendamento online, conforme a LGPD.`,
    path: "/privacidade",
  });
}

function getSections(s: SiteSettings): LegalSection[] {
  const { legal } = s;
  return [
  {
    id: "controlador",
    title: "Quem somos",
    content: (
      <p>
        O controlador dos dados é <strong>{legal.companyName}</strong> (CNPJ {legal.cnpj}), {fullAddress(s)}. Contato do encarregado
        (DPO): <a href={`mailto:${legal.privacyEmail}`}>{legal.privacyEmail}</a>.
      </p>
    ),
  },
  {
    id: "dados-coletados",
    title: "Dados coletados",
    content: (
      <>
        <p>Ao agendar, coletamos apenas o necessário:</p>
        <ul>
          <li><strong>Nome</strong> — para identificar você no atendimento;</li>
          <li><strong>WhatsApp</strong> — para confirmar, lembrar e gerenciar a reserva;</li>
          <li><strong>Serviço, barbeiro, data e horário</strong> escolhidos;</li>
          <li><strong>Observações</strong> opcionais que você decidir informar.</li>
        </ul>
        <p>
          Também registramos dados técnicos mínimos (como endereço IP) de forma temporária para segurança e prevenção de abuso. Não
          usamos cookies de publicidade. O painel administrativo usa um cookie estritamente necessário para autenticação da equipe.
        </p>
      </>
    ),
  },
  {
    id: "finalidade",
    title: "Finalidade",
    content: (
      <ul>
        <li>confirmar, lembrar, remarcar e cancelar agendamentos;</li>
        <li>organizar a agenda dos profissionais e evitar conflitos de horário;</li>
        <li>atender solicitações feitas por você;</li>
        <li>cumprir obrigações legais e prevenir fraudes.</li>
      </ul>
    ),
  },
  {
    id: "base-legal",
    title: "Base legal",
    content: (
      <ul>
        <li><strong>Execução de contrato e procedimentos preliminares</strong> (art. 7º, V, LGPD) — para realizar o agendamento e o atendimento;</li>
        <li><strong>Legítimo interesse</strong> (art. 7º, IX) — segurança do site e prevenção de abuso;</li>
        <li><strong>Cumprimento de obrigação legal</strong> (art. 7º, II) — quando aplicável, como registros fiscais.</li>
      </ul>
    ),
  },
  {
    id: "compartilhamento",
    title: "Compartilhamento",
    content: (
      <>
        <p>Não vendemos seus dados. Eles são compartilhados apenas com:</p>
        <ul>
          <li>o <strong>barbeiro</strong> responsável pelo seu atendimento;</li>
          <li><strong>provedores necessários</strong> à operação (hospedagem do site e banco de dados), sob contrato e dever de sigilo;</li>
          <li>autoridades, quando exigido por lei ou ordem judicial.</li>
        </ul>
        <p>
          Ao clicar em links de WhatsApp, Instagram ou Google Maps, você passa a interagir com esses serviços, que têm políticas próprias.
          O mapa só é carregado quando você clica para exibi-lo.
        </p>
      </>
    ),
  },
  {
    id: "direitos",
    title: "Seus direitos",
    content: (
      <>
        <p>Nos termos do art. 18 da LGPD, você pode solicitar a qualquer momento:</p>
        <ul>
          <li>confirmação da existência de tratamento e acesso aos dados;</li>
          <li>correção de dados incompletos, inexatos ou desatualizados;</li>
          <li>anonimização, bloqueio ou eliminação de dados desnecessários;</li>
          <li>portabilidade e informação sobre compartilhamentos;</li>
          <li>eliminação dos dados, respeitadas as hipóteses legais de guarda.</li>
        </ul>
        <p>Responderemos em até 15 dias. Você também pode apresentar reclamação à Autoridade Nacional de Proteção de Dados (ANPD).</p>
      </>
    ),
  },
  {
    id: "retencao",
    title: "Retenção",
    content: (
      <p>
        Mantemos os dados de agendamento por até 24 meses após o atendimento, para histórico e eventuais solicitações. Depois disso,
        eles são excluídos ou anonimizados, salvo obrigação legal de guarda. Você pode pedir a exclusão antecipada a qualquer momento.
      </p>
    ),
  },
  {
    id: "seguranca",
    title: "Segurança",
    content: (
      <p>
        Adotamos medidas técnicas e administrativas razoáveis: conexão criptografada (HTTPS), acesso restrito ao painel, limite de
        tentativas e consulta de reserva condicionada ao código <em>e</em> ao WhatsApp. Nenhum sistema é 100% imune, e comunicaremos
        incidentes relevantes conforme a lei.
      </p>
    ),
  },
  {
    id: "contato",
    title: "Canal de contato",
    content: (
      <p>
        Para exercer seus direitos ou tirar dúvidas: <a href={`mailto:${legal.privacyEmail}`}>{legal.privacyEmail}</a> ou WhatsApp{" "}
        {whatsappDisplay(s)}, de acordo com nosso horário de atendimento (fuso {businessConfig.timezone}).
      </p>
    ),
  },
];
}

export default async function PrivacyPage() {
  const s = await getSettings();
  return (
    <LegalDocument
      lastUpdated={s.legal.lastUpdated}
      title="Política de Privacidade"
      intro="Transparência sobre quais dados coletamos no agendamento, por que coletamos e como você pode controlá-los."
      sections={getSections(s)}
    />
  );
}
