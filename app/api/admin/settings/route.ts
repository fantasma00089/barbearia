import { z } from "zod";
import { requireAdmin } from "@/server/auth/admin";
import { json, readJson, route } from "@/server/http";
import { getSettings, saveSettingsSection } from "@/server/settings";
import { SETTINGS_SECTIONS } from "@/lib/validation/settings";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  section: z.enum(SETTINGS_SECTIONS as [string, ...string[]]),
  data: z.unknown(),
});

export const GET = route(async () => {
  await requireAdmin();
  return json({ settings: await getSettings() });
});

export const PUT = route(async (req: Request) => {
  await requireAdmin();
  const { section, data } = bodySchema.parse(await readJson(req));
  const settings = await saveSettingsSection(section as (typeof SETTINGS_SECTIONS)[number], data);
  return json({ settings });
});
