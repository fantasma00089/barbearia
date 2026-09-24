import type { Metadata, Viewport } from "next";
import "@fontsource-variable/oswald";
import "@fontsource-variable/inter";
import "@fontsource-variable/playfair-display/wght-italic.css";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { MotionProvider } from "@/components/motion/motion-provider";
import { SettingsProvider } from "@/components/providers/settings-provider";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { accentCss } from "@/lib/site";
import { getSettings } from "@/server/settings";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    metadataBase: new URL(siteConfig.url),
    ...buildMetadata(s),
    applicationName: s.brand.name,
    keywords: [...siteConfig.keywords],
    authors: [{ name: s.brand.name }],
    formatDetection: { telephone: false },
    icons: { icon: s.brand.logoUrl ?? "/icon.svg" },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    { media: "(prefers-color-scheme: light)", color: "#faf8f5" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <html lang="pt-BR" className="dark" style={{ colorScheme: "dark" }} suppressHydrationWarning>
      <head>
        {/* Cor de destaque definida no painel (/admin/configuracoes) */}
        <style dangerouslySetInnerHTML={{ __html: accentCss(settings.brand.accentColor) }} />
        {/* Sem JavaScript, o conteúdo animado aparece normalmente. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <SettingsProvider value={settings}>
          <ThemeProvider>
            <MotionProvider>{children}</MotionProvider>
          </ThemeProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
