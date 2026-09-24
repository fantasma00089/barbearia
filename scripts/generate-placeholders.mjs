/**
 * Gera as imagens ilustrativas (SVG) usadas enquanto não há fotos reais.
 * Uso: npm run placeholders
 * Para usar fotos reais, basta substituir os arquivos em /public/images
 * (ou apontar `photo` / `gallery.src` para .jpg/.webp).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "images");
const GOLD = "#d9a441";
const GOLD_SOFT = "#ecd29a";

const defs = (id, hue = GOLD) => `
  <defs>
    <radialGradient id="glow-${id}" cx="50%" cy="38%" r="65%">
      <stop offset="0" stop-color="${hue}" stop-opacity="0.35"/>
      <stop offset="0.55" stop-color="${hue}" stop-opacity="0.06"/>
      <stop offset="1" stop-color="#0a0a0a" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="bg-${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1a1a1a"/>
      <stop offset="1" stop-color="#0b0b0b"/>
    </linearGradient>
    <linearGradient id="rim-${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${GOLD_SOFT}"/>
      <stop offset="0.6" stop-color="${GOLD}"/>
      <stop offset="1" stop-color="${GOLD}" stop-opacity="0.2"/>
    </linearGradient>
    <linearGradient id="skin-${id}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#2b2b2b"/>
      <stop offset="0.5" stop-color="#232323"/>
      <stop offset="1" stop-color="#191919"/>
    </linearGradient>
    <pattern id="lines-${id}" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
      <line x1="0" y1="0" x2="0" y2="10" stroke="#ffffff" stroke-opacity="0.025"/>
    </pattern>
  </defs>`;

const HAIR = {
  fade: `<path d="M134 214 C128 150 168 118 205 120 C247 122 274 156 268 214 C258 186 246 170 202 168 C160 168 142 186 134 214 Z" fill="#141414" stroke="url(#rim-ID)" stroke-width="2"/>
         <path d="M134 214 C136 232 138 244 140 256" stroke="#3a3a3a" stroke-width="6" stroke-linecap="round" opacity="0.5"/>
         <path d="M266 214 C264 232 262 244 260 256" stroke="#3a3a3a" stroke-width="6" stroke-linecap="round" opacity="0.5"/>`,
  classic: `<path d="M130 222 C122 150 170 112 210 116 C258 120 282 160 270 222 C262 196 252 176 236 168 C214 176 176 172 150 182 C140 192 134 206 130 222 Z" fill="#141414" stroke="url(#rim-ID)" stroke-width="2"/>`,
  color: `<path d="M132 218 C126 146 170 108 208 112 C252 116 280 152 268 218 C260 188 246 170 204 166 C162 166 142 186 132 218 Z" fill="url(#rim-ID)" opacity="0.9"/>
          <path d="M150 170 C170 140 196 132 222 136 M160 180 C184 156 214 150 244 160" stroke="#0a0a0a" stroke-opacity="0.35" stroke-width="3" fill="none"/>`,
  curly: `<g fill="#141414" stroke="url(#rim-ID)" stroke-width="1.6">
            <circle cx="150" cy="180" r="24"/><circle cx="178" cy="156" r="26"/><circle cx="212" cy="150" r="27"/>
            <circle cx="244" cy="164" r="25"/><circle cx="262" cy="192" r="20"/><circle cx="138" cy="206" r="16"/>
          </g>`,
  buzz: `<path d="M136 212 C132 158 168 130 202 130 C240 130 270 158 264 212 C254 190 240 180 202 178 C166 178 146 190 136 212 Z" fill="#1c1c1c" stroke="url(#rim-ID)" stroke-width="1.5" stroke-dasharray="2 3"/>`,
  pomp: `<path d="M136 214 C126 140 176 96 226 104 C268 112 284 150 266 214 C258 180 250 160 220 150 C190 146 160 160 136 214 Z" fill="#141414" stroke="url(#rim-ID)" stroke-width="2"/>
         <path d="M170 128 C196 114 230 114 256 132" stroke="${GOLD}" stroke-opacity="0.5" stroke-width="1.5" fill="none"/>`,
};

const BEARD = {
  none: "",
  full: `<path d="M136 246 C140 318 176 340 200 342 C224 340 260 318 264 246 C254 292 234 304 200 306 C166 304 146 292 136 246 Z" fill="#141414" stroke="url(#rim-ID)" stroke-width="2"/>
         <path d="M178 286 C190 280 210 280 222 286" stroke="#0a0a0a" stroke-width="5" stroke-linecap="round"/>`,
  designed: `<path d="M138 240 L150 300 L200 330 L250 300 L262 240 L246 290 L200 312 L154 290 Z" fill="#141414" stroke="url(#rim-ID)" stroke-width="2"/>
             <path d="M176 284 C188 278 212 278 224 284" stroke="#141414" stroke-width="7" stroke-linecap="round"/>`,
  stubble: `<path d="M142 258 C150 306 178 326 200 328 C222 326 250 306 258 258" fill="none" stroke="#3a3a3a" stroke-width="10" stroke-dasharray="1 4" opacity="0.8"/>`,
};

function bust(id, hair, beard, { scale = 1, dx = 0, dy = 0 } = {}) {
  const h = HAIR[hair].replaceAll("ID", id);
  const b = BEARD[beard].replaceAll("ID", id);
  return `
  <g transform="translate(${dx} ${dy}) scale(${scale})">
    <path d="M40 520 C52 404 124 372 200 368 C276 372 348 404 360 520 Z" fill="#161616" stroke="url(#rim-${id})" stroke-width="2"/>
    <path d="M150 382 L200 440 L250 382" fill="none" stroke="${GOLD}" stroke-opacity="0.35" stroke-width="2"/>
    <path d="M172 296 L228 296 L234 372 C214 384 186 384 166 372 Z" fill="url(#skin-${id})"/>
    <ellipse cx="200" cy="232" rx="68" ry="86" fill="url(#skin-${id})" stroke="url(#rim-${id})" stroke-width="2"/>
    <ellipse cx="131" cy="240" rx="9" ry="16" fill="#222"/>
    <ellipse cx="269" cy="240" rx="9" ry="16" fill="#222"/>
    ${h}
    ${b}
  </g>`;
}

function portrait({ file, initials, hair, beard, hue }) {
  const id = initials.toLowerCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" role="img" aria-label="Retrato ilustrativo">
  ${defs(id, hue)}
  <rect width="400" height="500" fill="url(#bg-${id})"/>
  <rect width="400" height="500" fill="url(#lines-${id})"/>
  <rect width="400" height="500" fill="url(#glow-${id})"/>
  <text x="200" y="120" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="150" fill="${GOLD}" fill-opacity="0.07">${initials}</text>
  ${bust(id, hair, beard, { dy: 10 })}
  <text x="20" y="30" font-family="Arial, sans-serif" font-size="10" letter-spacing="3" fill="#ffffff" fill-opacity="0.35">FOTO ILUSTRATIVA</text>
</svg>`;
  write(`barbers/${file}.svg`, svg);
}

function galleryTile({ file, hair, beard, variant, hue = GOLD, tall = false }) {
  const id = file.replace(/\W/g, "");
  const w = 600;
  const h = tall ? 800 : 600;
  const scale = tall ? 1.35 : 1.1;
  const dx = (w - 400 * scale) / 2;
  const dy = tall ? 120 : 40;
  const deco = {
    rings: `<circle cx="${w / 2}" cy="${h * 0.42}" r="${w * 0.36}" fill="none" stroke="${GOLD}" stroke-opacity="0.18"/><circle cx="${w / 2}" cy="${h * 0.42}" r="${w * 0.42}" fill="none" stroke="${GOLD}" stroke-opacity="0.08"/>`,
    stripes: `<g opacity="0.12">${Array.from({ length: 8 }, (_, i) => `<rect x="${i * 90 - 60}" y="-40" width="26" height="${h + 80}" fill="${i % 2 ? "#8b2e1f" : GOLD}" transform="rotate(20 ${w / 2} ${h / 2})"/>`).join("")}</g>`,
    arch: `<path d="M60 ${h} V${h * 0.38} A${(w - 120) / 2} ${(w - 120) / 2} 0 0 1 ${w - 60} ${h * 0.38} V${h}" fill="none" stroke="${GOLD}" stroke-opacity="0.25" stroke-width="2"/>`,
    grid: `<g stroke="#fff" stroke-opacity="0.04">${Array.from({ length: 12 }, (_, i) => `<line x1="${i * 50}" y1="0" x2="${i * 50}" y2="${h}"/><line x1="0" y1="${i * 70}" x2="${w}" y2="${i * 70}"/>`).join("")}</g>`,
  }[variant];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="Imagem ilustrativa de corte">
  ${defs(id, hue)}
  <rect width="${w}" height="${h}" fill="url(#bg-${id})"/>
  <rect width="${w}" height="${h}" fill="url(#lines-${id})"/>
  ${deco}
  <rect width="${w}" height="${h}" fill="url(#glow-${id})"/>
  ${bust(id, hair, beard, { scale, dx, dy })}
  <text x="${w - 20}" y="30" text-anchor="end" font-family="Arial, sans-serif" font-size="11" letter-spacing="3" fill="#ffffff" fill-opacity="0.3">IMAGEM ILUSTRATIVA</text>
</svg>`;
  write(`gallery/${file}.svg`, svg);
}

function write(rel, content) {
  const path = join(root, rel);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content.replace(/\n\s+\n/g, "\n"));
  console.log("✓", rel);
}

portrait({ file: "rafael-moreira", initials: "RM", hair: "fade", beard: "stubble" });
portrait({ file: "lucas-almeida", initials: "LA", hair: "classic", beard: "full" });
portrait({ file: "diego-souza", initials: "DS", hair: "color", beard: "none", hue: "#e0b35a" });
portrait({ file: "bruno-cardoso", initials: "BC", hair: "curly", beard: "stubble", hue: "#c98a4a" });

galleryTile({ file: "corte-01", hair: "fade", beard: "none", variant: "rings", tall: true });
galleryTile({ file: "corte-02", hair: "buzz", beard: "designed", variant: "grid" });
galleryTile({ file: "corte-03", hair: "pomp", beard: "stubble", variant: "stripes" });
galleryTile({ file: "corte-04", hair: "color", beard: "none", variant: "arch", hue: "#f0d08a", tall: true });
galleryTile({ file: "corte-05", hair: "classic", beard: "none", variant: "grid" });
galleryTile({ file: "corte-06", hair: "curly", beard: "none", variant: "rings", tall: true });
galleryTile({ file: "corte-07", hair: "fade", beard: "full", variant: "arch" });
galleryTile({ file: "corte-08", hair: "buzz", beard: "full", variant: "stripes", hue: "#b5452f" });
