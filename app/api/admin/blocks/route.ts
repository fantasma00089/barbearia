import { requireAdmin } from "@/server/auth/admin";
import { createBlock, listUpcomingBlocks } from "@/server/admin";
import { json, readJson, route } from "@/server/http";
import { timeBlockSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export const GET = route(async () => {
  await requireAdmin();
  return json({ blocks: await listUpcomingBlocks() });
});

export const POST = route(async (req: Request) => {
  await requireAdmin();
  const input = timeBlockSchema.parse(await readJson(req));
  return json(await createBlock(input), { status: 201 });
});
