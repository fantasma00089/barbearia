import { describe, expect, it } from "vitest";
import { normalizeBrMobile } from "@/lib/phone";
import { createBookingSchema, customerSchema } from "@/lib/validation/booking";
import { timeBlockSchema } from "@/lib/validation/admin";

describe("normalizeBrMobile", () => {
  it.each([
    ["(69) 99999-0000", "69999990000"],
    ["+55 69 99999-0000", "69999990000"],
    ["069999990000", "69999990000"],
  ])("%s → %s", (input, expected) => expect(normalizeBrMobile(input)).toBe(expected));

  it.each(["(69) 3222-0000", "9999-0000", "(00) 99999-0000", ""])("rejeita %s", (input) =>
    expect(normalizeBrMobile(input)).toBeNull(),
  );
});

describe("schemas", () => {
  it("customerSchema normaliza telefone e valida nome", () => {
    const ok = customerSchema.safeParse({ name: "João da Silva", phone: "(69) 98888-7777", notes: "" });
    expect(ok.success && ok.data.phone).toBe("69988887777");
    expect(customerSchema.safeParse({ name: "1", phone: "123" }).success).toBe(false);
  });

  it("createBookingSchema exige aceite dos termos", () => {
    const input = { name: "Ana", phone: "69988887777", serviceId: "s1", barberId: "any", date: "2026-10-01", time: "10:00" };
    expect(createBookingSchema.safeParse({ ...input, acceptTerms: false }).success).toBe(false);
    expect(createBookingSchema.safeParse({ ...input, acceptTerms: true }).success).toBe(true);
  });

  it("timeBlockSchema exige fim depois do início", () => {
    const b = { barberId: null, date: "2026-10-01", startTime: "14:00", endTime: "13:00" };
    expect(timeBlockSchema.safeParse(b).success).toBe(false);
  });
});
