import { requireAdmin } from "@/server/auth/admin";
import { deleteBlock } from "@/server/admin";
import { json, route } from "@/server/http";

export const dynamic = "force-dynamic";

export const DELETE = route(async (_req: Request, ctx: { params: Promise<{ id: string }> }) => {
  await requireAdmin();
  const { id } = await ctx.params;
  await deleteBlock(id);
  return json({ ok: true });
});
