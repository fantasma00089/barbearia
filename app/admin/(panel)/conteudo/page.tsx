import { AdminPageHeader } from "@/components/admin/form-kit";
import { ContentEditor } from "@/components/admin/content-editor";
import { getSettings } from "@/server/settings";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const settings = await getSettings();
  return (
    <div className="max-w-4xl space-y-8">
      <AdminPageHeader
        title="Conteúdo do site"
        description="Textos da página inicial, galeria de fotos, depoimentos e perguntas frequentes. Barbeiros e serviços têm páginas próprias."
      />
      <ContentEditor settings={settings} />
    </div>
  );
}
