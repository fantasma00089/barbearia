/**
 * Composição visual do hero em SVG local (sem imagens externas).
 * Para usar uma foto real, troque por <SmartImage src="/images/hero.jpg" … />.
 */
export function HeroArt() {
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
      <svg viewBox="0 0 400 500" className="absolute inset-0 h-full w-full" role="img" aria-label="Ilustração: navalha e tesoura em moldura dourada">
        <defs>
          <linearGradient id="hero-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="hsl(var(--card))" />
            <stop offset="1" stopColor="hsl(var(--background))" />
          </linearGradient>
          <linearGradient id="hero-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="hsl(var(--gold-soft))" />
            <stop offset="0.5" stopColor="hsl(var(--gold))" />
            <stop offset="1" stopColor="hsl(var(--gold) / 0.6)" />
          </linearGradient>
          <radialGradient id="hero-glow" cx="0.5" cy="0.35" r="0.6">
            <stop offset="0" stopColor="hsl(var(--gold) / 0.28)" />
            <stop offset="1" stopColor="hsl(var(--gold) / 0)" />
          </radialGradient>
          <pattern id="hero-lines" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
            <line x1="0" y1="0" x2="0" y2="12" stroke="hsl(var(--foreground) / 0.05)" strokeWidth="1" />
          </pattern>
          <clipPath id="hero-arch">
            <path d="M40 500 V190 A160 160 0 0 1 360 190 V500 Z" />
          </clipPath>
        </defs>

        {/* Arco (espelho de barbearia) */}
        <g clipPath="url(#hero-arch)">
          <rect width="400" height="500" fill="url(#hero-bg)" />
          <rect width="400" height="500" fill="url(#hero-lines)" />
          <rect width="400" height="500" fill="url(#hero-glow)" />
        </g>
        <path d="M40 500 V190 A160 160 0 0 1 360 190 V500" fill="none" stroke="url(#hero-gold)" strokeWidth="2" />
        <path d="M58 500 V192 A142 142 0 0 1 342 192 V500" fill="none" stroke="hsl(var(--gold) / 0.3)" strokeWidth="1" />
        <path d="M20 499 H380" stroke="url(#hero-gold)" strokeWidth="2" />

        {/* Navalha */}
        <g transform="translate(200 250) rotate(-32)" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M-120 0 H40 L60 -26 H-110 Q-126 -26 -126 -12 Z" fill="hsl(var(--foreground) / 0.06)" stroke="url(#hero-gold)" strokeWidth="2.5" />
          <path d="M-110 -12 H44" stroke="hsl(var(--gold) / 0.35)" strokeWidth="1.2" />
          <path d="M40 0 H150 Q166 0 166 14 Q166 26 150 26 H46 Z" fill="hsl(var(--foreground) / 0.1)" stroke="url(#hero-gold)" strokeWidth="2.5" />
          <circle cx="46" cy="10" r="5" fill="url(#hero-gold)" />
          <path d="M78 13 H140" stroke="hsl(var(--gold) / 0.45)" strokeWidth="1.2" />
        </g>

        {/* Tesoura */}
        <g transform="translate(206 368) rotate(18)" fill="none" stroke="url(#hero-gold)" strokeWidth="2.5" strokeLinecap="round">
          <circle cx="-62" cy="-16" r="18" />
          <circle cx="-62" cy="22" r="18" />
          <path d="M-46 -8 L78 22" />
          <path d="M-46 14 L78 -16" />
          <circle cx="4" cy="3" r="3.5" fill="url(#hero-gold)" />
        </g>

        {/* Monograma */}
        <text x="200" y="138" textAnchor="middle" fontFamily="var(--font-serif)" fontStyle="italic" fontSize="44" fill="url(#hero-gold)">
          N&amp;A
        </text>
        <text x="200" y="164" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="10" letterSpacing="5" fill="hsl(var(--muted-foreground))">
          EST. 2014
        </text>
      </svg>
    </div>
  );
}
