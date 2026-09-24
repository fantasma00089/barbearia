/** Dados derivados das configurações (não precisam ser digitados no painel). */
import type { SiteSettings } from "@/types/settings";

export const phoneE164 = (s: SiteSettings) => `+55${s.contact.phoneDisplay.replace(/\D/g, "").replace(/^55/, "")}`;

export function whatsappDisplay(s: SiteSettings) {
  const d = s.contact.whatsapp.replace(/\D/g, "").replace(/^55/, "");
  return d.length === 11 ? `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}` : s.contact.whatsapp;
}

export const instagramUrl = (s: SiteSettings) => `https://instagram.com/${s.contact.instagramHandle.replace(/^@/, "")}`;

export const fullAddress = (s: SiteSettings) =>
  `${s.address.street} — ${s.address.neighborhood}, ${s.address.city} — ${s.address.state}, ${s.address.postalCode}`;

/** "#d9a441" → "38 74% 56%" (formato das variáveis CSS do tema) */
export function hexToHsl(hex: string) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  const int = parseInt(m ? m[1]! : "d9a441", 16);
  const r = ((int >> 16) & 255) / 255;
  const g = ((int >> 8) & 255) / 255;
  const b = (int & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let sat = 0;
  if (max !== min) {
    const d = max - min;
    sat = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h *= 60;
  }
  return { h: Math.round(h), s: Math.round(sat * 100), l: Math.round(l * 100) };
}

/** CSS que aplica a cor de destaque nos dois temas, mantendo contraste. */
export function accentCss(hex: string) {
  const { h, s, l } = hexToHsl(hex);
  const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
  const dark = `${h} ${s}% ${clamp(l, 45, 70)}%`;
  const darkSoft = `${h} ${clamp(s - 14, 20, 100)}% ${clamp(l + 14, 60, 85)}%`;
  const light = `${h} ${s}% ${clamp(l - 22, 22, 38)}%`;
  const lightSoft = `${h} ${s}% ${clamp(l - 10, 30, 50)}%`;
  return `html.dark{--primary:${dark};--gold:${dark};--ring:${dark};--gold-soft:${darkSoft}}html:not(.dark){--primary:${light};--gold:${light};--ring:${light};--gold-soft:${lightSoft}}`;
}
