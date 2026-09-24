import { requireAdmin } from "@/server/auth/admin";
import { deleteBarber, saveBarber } from "@/server/admin-catalog";
import { json, readJson, route } from "@/server/http";
import { barberInputSchema } from "@/lib/validation/catalog";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export const PUT = route(async (req: Request, ctx: Ctx) => {
  await requireAdmin();
  const { id } = await ctx.params;
  const input = barberInputSchema.parse(await readJson(req));
  await saveBarber(id, input);
  return json({ id });
});

export const DELETE = route(async (_req: Request, ctx: Ctx) => {
  await requireAdmin();
  const { id } = await ctx.params;
  await deleteBarber(id);
  return json({ ok: true });
});
