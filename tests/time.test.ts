import { describe, expect, it } from "vitest";
import { addDays, diffDays, isValidDateStr, toDateStr, toTimeStr, weekdayOf, zonedToUtc } from "@/lib/time";

describe("time utils (America/Porto_Velho, UTC−4)", () => {
  it("converte data/hora local para UTC", () => {
    expect(zonedToUtc("2026-09-25", "09:00").toISOString()).toBe("2026-09-25T13:00:00.000Z");
    expect(zonedToUtc("2026-12-31", "22:30").toISOString()).toBe("2027-01-01T02:30:00.000Z");
  });

  it("converte UTC de volta para data/hora local", () => {
    const d = new Date("2026-09-26T02:30:00.000Z");
    expect(toDateStr(d)).toBe("2026-09-25");
    expect(toTimeStr(d)).toBe("22:30");
  });

  it("funciona com fusos que têm horário de verão", () => {
    // Nova York: 10/03/2024 é o dia da mudança (EST → EDT)
    expect(zonedToUtc("2024-03-10", "12:00", "America/New_York").toISOString()).toBe("2024-03-10T16:00:00.000Z");
    expect(zonedToUtc("2024-01-10", "12:00", "America/New_York").toISOString()).toBe("2024-01-10T17:00:00.000Z");
  });

  it("aritmética de datas civis", () => {
    expect(addDays("2026-02-28", 1)).toBe("2026-03-01");
    expect(addDays("2026-01-01", -1)).toBe("2025-12-31");
    expect(diffDays("2026-09-24", "2026-10-24")).toBe(30);
    expect(weekdayOf("2026-09-27")).toBe(0); // domingo
  });

  it("valida datas", () => {
    expect(isValidDateStr("2026-02-29")).toBe(false);
    expect(isValidDateStr("2028-02-29")).toBe(true);
    expect(isValidDateStr("2026-9-1")).toBe(false);
  });
});
