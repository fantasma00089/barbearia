/**
 * Normaliza telefone brasileiro para somente dígitos com DDD (sem DDI).
 * Aceita "(69) 99999-0000", "+55 69 99999-0000", "069999990000"...
 * Retorna null quando não é um celular válido (11 dígitos, 9 após o DDD).
 */
export function normalizeBrMobile(input: string): string | null {
  let d = input.replace(/\D/g, "");
  if (d.length === 13 && d.startsWith("55")) d = d.slice(2);
  if (d.length === 12 && d.startsWith("0")) d = d.slice(1);
  if (d.length !== 11) return null;
  const ddd = Number(d.slice(0, 2));
  if (ddd < 11 || ddd > 99) return null;
  if (d[2] !== "9") return null;
  return d;
}
