import { AdminPageHeader } from "@/components/admin/form-kit";
import { SettingsEditor } from "@/components/admin/settings-editor";
import { getSettings } from "@/server/settings";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  return (
    <div className="space-y-8">
      <AdminPageHeader title="Configurações" description="Tudo o que muda de uma barbearia para outra. Cada bloco é salvo separadamente e o site atualiza na hora." />
      <SettingsEditor settings={settings} />
    </div>
  );
}
