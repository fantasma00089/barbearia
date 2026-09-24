import "server-only";
import { cache } from "react";
import { revalidatePath } from "next/cache";
import { prisma } from "./db";
import { mergeSettings } from "@/lib/settings-defaults";
import { settingsSectionSchemas, type SettingsSection } from "@/lib/validation/settings";
import type { SiteSettings } from "@/types/settings";

const SITE_KEY = "site";

async function readSite(): Promise<Partial<Record<keyof SiteSettings, unknown>> | null> {
  const row = await prisma.setting.findUnique({ where: { key: SITE_KEY } });
  if (!row) return null;
  try {
    return JSON.parse(row.value);
  } catch {
    return null;
  }
}

/** Configurações vigentes (padrões + o que foi salvo no painel). Deduplicado por requisição. */
export const getSettings = cache(async (): Promise<SiteSettings> => mergeSettings(await readSite()));

/** Salva uma seção validada e revalida todas as páginas. */
export async function saveSettingsSection(section: SettingsSection, data: unknown) {
  const parsed = settingsSectionSchemas[section].parse(data);
  const current = (await readSite()) ?? {};
  const next = { ...current, [section]: parsed };
  await prisma.setting.upsert({
    where: { key: SITE_KEY },
    update: { value: JSON.stringify(next) },
    create: { key: SITE_KEY, value: JSON.stringify(next) },
  });
  revalidatePath("/", "layout");
  return mergeSettings(next);
}
