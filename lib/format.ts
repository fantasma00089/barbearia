const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function formatPrice(cents: number, from = false) {
  const value = brl.format(cents / 100);
  return from ? `a partir de ${value}` : value;
}

export function formatDuration(min: number) {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}h ${m}min` : `${h}h`;
}

/** 69999990000 → (69) 99999-0000 */
export function formatPhone(digits: string) {
  const d = digits.replace(/\D/g, "");
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return digits;
}

/** Máscara progressiva enquanto o usuário digita. */
export function maskPhone(value: string) {
  let d = value.replace(/\D/g, "");
  // Colou com DDI (+55 69 9…) ou com zero do DDD (069 9…)? Remove antes de mascarar.
  if (d.length > 11 && d.startsWith("55")) d = d.slice(2);
  if (d.length > 11 && d.startsWith("0")) d = d.slice(1);
  d = d.slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/** Link wa.me para um número com DDI (ex.: settings.contact.whatsapp). */
export function whatsappLink(phone: string, message?: string) {
  const base = `https://wa.me/${phone.replace(/\D/g, "")}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** WhatsApp de cliente (dígitos com DDD) → link wa.me com DDI 55. */
export function customerWhatsappLink(digits: string, message?: string) {
  return whatsappLink(`55${digits.replace(/\D/g, "")}`, message);
}

export function formatNumber(n: number) {
  return new Intl.NumberFormat("pt-BR").format(n);
}
