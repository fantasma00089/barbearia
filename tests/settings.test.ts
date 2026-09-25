import { describe, expect, it } from "vitest";
import { DEFAULT_SETTINGS, mergeSettings } from "@/lib/settings-defaults";
import { accentCss, hexToHsl, whatsappDisplay } from "@/lib/site";
import { maskPhone } from "@/lib/format";
import { slugify } from "@/lib/slug";
import { settingsSectionSchemas } from "@/lib/validation/settings";
import { barberInputSchema, serviceInputSchema } from "@/lib/validation/catalog";

describe("configurações", () => {
  it("mescla o que foi salvo sobre os padrões", () => {
    const s = mergeSettings({ brand: { name: "Outra" }, content: { faq: [] } });
    expect(s.brand.name).toBe("Outra");
    expect(s.brand.slogan).toBe(DEFAULT_SETTINGS.brand.slogan);
    expect(s.content.faq).toEqual([]);
    expect(s.content.testimonials.length).toBeGreaterThan(0);
    expect(mergeSettings(null)).toEqual(DEFAULT_SETTINGS);
  });

  it("os padrões passam na validação de todas as seções", () => {
    for (const [section, schema] of Object.entries(settingsSectionSchemas)) {
      const r = schema.safeParse(DEFAULT_SETTINGS[section as keyof typeof DEFAULT_SETTINGS]);
      expect(r.success, section).toBe(true);
    }
  });

  it("normaliza WhatsApp e Instagram", () => {
    const r = settingsSectionSchemas.contact.parse({
      ...DEFAULT_SETTINGS.contact,
      whatsapp: "(69) 99888-7766",
      instagramHandle: "https://instagram.com/minhabarbearia/",
    });
    expect(r.whatsapp).toBe("5569998887766");
    expect(r.instagramHandle).toBe("minhabarbearia");
    expect(whatsappDisplay({ ...DEFAULT_SETTINGS, contact: r })).toBe("(69) 99888-7766");
  });

  it("rejeita cor e grade de horários inválidas", () => {
    expect(settingsSectionSchemas.brand.safeParse({ ...DEFAULT_SETTINGS.brand, accentColor: "red" }).success).toBe(false);
    expect(settingsSectionSchemas.booking.safeParse({ ...DEFAULT_SETTINGS.booking, slotStepMinutes: 7 }).success).toBe(false);
  });

  it("gera CSS de cor sem injeção", () => {
    expect(hexToHsl("#d9a441")).toMatchObject({ h: 39, l: 55 });
    expect(hexToHsl("#ffffff")).toEqual({ h: 0, s: 0, l: 100 });
    const css = accentCss("#000000;}</style><script>");
    expect(css).not.toMatch(/<|script/);
  });
});

describe("utilitários", () => {
  it("máscara de telefone aceita colar com +55", () => {
    expect(maskPhone("+55 69 99999-0000")).toBe("(69) 99999-0000");
    expect(maskPhone("069999990000")).toBe("(69) 99999-0000");
    expect(maskPhone("699")).toBe("(69) 9");
  });

  it("slug sem acentos", () => {
    expect(slugify("Degradê Navalhado & Barba")).toBe("degrade-navalhado-barba");
  });

  it("valida cadastro de barbeiro e serviço", () => {
    expect(barberInputSchema.safeParse({ name: "X" }).success).toBe(false);
    const service = serviceInputSchema.safeParse({
      name: "Corte",
      description: "Descrição com tamanho ok",
      category: "HAIR",
      durationMin: 33,
      price: 40,
      priceFrom: false,
      featured: false,
      active: true,
      barberIds: [],
    });
    expect(service.success).toBe(false); // 33 não é múltiplo de 5
  });
});
