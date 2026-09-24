import { requireAdmin } from "@/server/auth/admin";
import { saveService } from "@/server/admin-catalog";
import { json, readJson, route } from "@/server/http";
import { serviceInputSchema } from "@/lib/validation/catalog";

export const dynamic = "force-dynamic";

export const POST = route(async (req: Request) => {
  await requireAdmin();
  const input = serviceInputSchema.parse(await readJson(req));
  const service = await saveService(null, input);
  return json({ id: service.id }, { status: 201 });
});
