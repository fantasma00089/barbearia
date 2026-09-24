import { ImageResponse } from "next/og";
import { getSettings } from "@/server/settings";

export const alt = "Imagem de divulgação da barbearia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Imagem Open Graph gerada no build — sem arquivos externos. */
export default async function OpenGraphImage() {
  const s = await getSettings();
  const accent = s.brand.accentColor;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "radial-gradient(circle at 20% 10%, #2a2112 0%, #0a0a0a 55%)",
          color: "#f3efe8",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 999,
              border: `3px solid ${accent}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: accent,
              fontSize: 30,
              fontStyle: "italic",
            }}
          >
            {s.brand.shortName
              .split(/\s+/)
              .filter((w) => /^[\p{L}&]/u.test(w))
              .slice(0, 3)
              .map((w) => w[0])
              .join("")}
          </div>
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 8, color: accent, textTransform: "uppercase" }}>
            {`${s.address.city} · ${s.address.state}`}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 88, fontWeight: 700, textTransform: "uppercase", lineHeight: 1 }}>{s.brand.shortName}</div>
          <div style={{ fontSize: 40, marginTop: 20, color: accent }}>{s.brand.slogan}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#a8a29e" }}>
          <span>Agende online em menos de 1 minuto</span>
          <span>{`Nota ${s.stats.rating.toFixed(1).replace(".", ",")} no Google`}</span>
        </div>
      </div>
    ),
    size,
  );
}
