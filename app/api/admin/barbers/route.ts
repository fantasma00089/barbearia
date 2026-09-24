import { requireAdmin } from "@/server/auth/admin";
import { saveBarber } from "@/server/admin-catalog";
import { json, readJson, route } from "@/server/http";
import { barberInputSchema } from "@/lib/validation/catalog";

export const dynamic = "force-dynamic";

export const POST = route(async (req: Request) => {
  await requireAdmin();
  const input = barberInputSchema.parse(await readJson(req));
  const barber = await saveBarber(null, input);
  return json({ id: barber.id }, { status: 201 });
});
