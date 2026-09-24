import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/server/auth/admin";
import { saveBusinessHours } from "@/server/admin";
import { getBusinessHours } from "@/server/catalog";
import { json, readJson, route } from "@/server/http";
import { businessHoursSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export const GET = route(async () => {
  await requireAdmin();
  return json({ hours: await getBusinessHours() });
});

export const PUT = route(async (req: Request) => {
  await requireAdmin();
  const body = (await readJson(req)) as { hours?: unknown };
  const hours = businessHoursSchema.parse(body.hours);
  await saveBusinessHours(hours);
  revalidatePath("/", "layout");
  return json({ hours: await getBusinessHours() });
});
