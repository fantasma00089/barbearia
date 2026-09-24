import { BlocksManager } from "@/components/admin/blocks-manager";
import { listBarbersForAdmin, listUpcomingBlocks } from "@/server/admin";
import { todayStr } from "@/lib/time";

export const dynamic = "force-dynamic";

export default async function AdminBlocksPage() {
  const [blocks, barbers] = await Promise.all([listUpcomingBlocks(), listBarbersForAdmin()]);
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold uppercase">Bloqueios de agenda</h1>
        <p className="text-sm text-muted-foreground">Folgas, cursos, feriados ou pausas pontuais. Bloqueios não cancelam reservas existentes.</p>
      </div>
      <BlocksManager blocks={blocks} barbers={barbers} today={todayStr()} />
    </div>
  );
}
