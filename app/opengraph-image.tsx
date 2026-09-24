import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.name} — ${siteConfig.slogan}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Imagem Open Graph gerada no build — sem arquivos externos. */
export default function OpenGraphImage() {
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
              border: "3px solid #d9a441",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#d9a441",
              fontSize: 30,
              fontStyle: "italic",
            }}
          >
            N&A
          </div>
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 8, color: "#d9a441", textTransform: "uppercase" }}>
            {`${siteConfig.address.city} · ${siteConfig.address.state}`}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 88, fontWeight: 700, textTransform: "uppercase", lineHeight: 1 }}>{siteConfig.shortName}</div>
          <div style={{ fontSize: 40, marginTop: 20, color: "#d9a441" }}>{siteConfig.slogan}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#a8a29e" }}>
          <span>Agende online em menos de 1 minuto</span>
          <span>{`Nota ${siteConfig.stats.rating.toFixed(1).replace(".", ",")} no Google`}</span>
        </div>
      </div>
    ),
    size,
  );
}
