import { describe, expect, it } from "vitest";
import { computeBarberSlots, mergeSlots, type ComputeSlotsInput } from "@/lib/scheduling";
import { zonedToUtc } from "@/lib/time";

const TZ = "America/Porto_Velho";
const DATE = "2026-09-25"; // sexta-feira
const at = (time: string) => zonedToUtc(DATE, time, TZ).getTime();

function base(overrides: Partial<ComputeSlotsInput> = {}): ComputeSlotsInput {
  return {
    dateStr: DATE,
    hours: { dayOfWeek: 5, isOpen: true, openTime: "09:00", closeTime: "12:00", breakStart: null, breakEnd: null },
    durationMin: 30,
    stepMin: 15,
    bufferMin: 10,
    bookings: [],
    blocks: [],
    notBefore: 0,
    tz: TZ,
    ...overrides,
  };
}

const times = (input: ComputeSlotsInput) => computeBarberSlots(input).map((s) => s.time);

describe("computeBarberSlots", () => {
  it("gera slots a partir da abertura respeitando a duração até o fechamento", () => {
    const t = times(base());
    expect(t[0]).toBe("09:00");
    expect(t.at(-1)).toBe("11:30"); // 11:30 + 30min = 12:00
    expect(t).not.toContain("11:45");
    expect(t).toHaveLength(11);
  });

  it("dia fechado não tem horários", () => {
    expect(times(base({ hours: { ...base().hours, isOpen: false } }))).toEqual([]);
  });

  it("serviço mais longo reduz os horários possíveis", () => {
    const t = times(base({ durationMin: 90 }));
    expect(t.at(-1)).toBe("10:30");
  });

  it("aplica o intervalo (buffer) antes e depois de uma reserva existente", () => {
    // reserva 10:00–10:30, buffer 10 → bloqueia de 09:50 a 10:40
    const t = times(base({ bookings: [{ start: at("10:00"), end: at("10:30") }] }));
    expect(t).toContain("09:15"); // 09:15–09:45 termina antes de 09:50
    expect(t).not.toContain("09:30"); // 09:30–10:00 não deixa os 10 min de intervalo
    expect(t).not.toContain("10:00");
    expect(t).not.toContain("10:30"); // começa antes de 10:40
    expect(t).toContain("10:45");
  });

  it("respeita pausa (almoço)", () => {
    const t = times(base({ hours: { ...base().hours, breakStart: "10:00", breakEnd: "11:00" } }));
    expect(t).toContain("09:30");
    expect(t).not.toContain("09:45"); // 09:45–10:15 cruza a pausa
    expect(t).not.toContain("10:30");
    expect(t).toContain("11:00");
  });

  it("respeita bloqueios de agenda", () => {
    const t = times(base({ blocks: [{ start: at("09:00"), end: at("11:00") }] }));
    expect(t[0]).toBe("11:00");
  });

  it("não oferece horários antes do limite (passado / antecedência mínima)", () => {
    const t = times(base({ notBefore: at("10:20") }));
    expect(t[0]).toBe("10:30");
  });
});

describe("mergeSlots", () => {
  it("une horários e lista os barbeiros livres em cada um", () => {
    const a = computeBarberSlots(base({ bookings: [{ start: at("09:00"), end: at("11:00") }] }));
    const b = computeBarberSlots(base());
    const merged = mergeSlots(
      new Map([
        ["a", a],
        ["b", b],
      ]),
    );
    expect(merged[0]).toMatchObject({ time: "09:00", barberIds: ["b"] });
    const late = merged.find((s) => s.time === "11:15");
    expect(late?.barberIds.sort()).toEqual(["a", "b"]);
  });
});
