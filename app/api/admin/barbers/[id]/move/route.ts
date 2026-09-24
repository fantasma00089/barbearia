import { requireAdmin } from "@/server/auth/admin";
import { move } from "@/server/admin-catalog";
import { json, readJson, route } from "@/server/http";
import { reorderSchema } from "@/lib/validation/catalog";

export const dynamic = "force-dynamic";

export const POST = route(async (req: Request, ctx: { params: Promise<{ id: string }> }) => {
  await requireAdmin();
  const { id } = await ctx.params;
  const { direction } = reorderSchema.parse(await readJson(req));
  await move("barber", id, direction);
  return json({ ok: true });
});
