"use client";

import { createContext, useContext } from "react";
import { DEFAULT_SETTINGS } from "@/lib/settings-defaults";
import type { SiteSettings } from "@/types/settings";

const SettingsContext = createContext<SiteSettings>(DEFAULT_SETTINGS);

/** Disponibiliza as configurações do painel para componentes client. */
export function SettingsProvider({ value, children }: { value: SiteSettings; children: React.ReactNode }) {
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export const useSettings = () => useContext(SettingsContext);
