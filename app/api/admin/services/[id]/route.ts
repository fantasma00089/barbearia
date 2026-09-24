import { requireAdmin } from "@/server/auth/admin";
import { deleteService, saveService } from "@/server/admin-catalog";
import { json, readJson, route } from "@/server/http";
import { serviceInputSchema } from "@/lib/validation/catalog";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export const PUT = route(async (req: Request, ctx: Ctx) => {
  await requireAdmin();
  const { id } = await ctx.params;
  const input = serviceInputSchema.parse(await readJson(req));
  await saveService(id, input);
  return json({ id });
});

export const DELETE = route(async (_req: Request, ctx: Ctx) => {
  await requireAdmin();
  const { id } = await ctx.params;
  await deleteService(id);
  return json({ ok: true });
});
