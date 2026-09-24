import "server-only";
import type { PaymentProvider } from "./types";

/**
 * Ponto único de acesso ao provedor de pagamento.
 * Hoje retorna `null` (pagamento presencial). Para ativar Pix:
 *  1. implemente `PaymentProvider` (ex.: server/payments/mercadopago.ts);
 *  2. retorne a instância aqui conforme `process.env.PAYMENT_PROVIDER`;
 *  3. crie a rota app/api/payments/webhook/route.ts usando `parseWebhook`.
 */
export function getPaymentProvider(): PaymentProvider | null {
  switch (process.env.PAYMENT_PROVIDER) {
    case undefined:
    case "":
    case "none":
      return null;
    default:
      throw new Error(`Provedor de pagamento "${process.env.PAYMENT_PROVIDER}" ainda não implementado.`);
  }
}

export const paymentsEnabled = () => getPaymentProvider() !== null;

export type { PaymentProvider } from "./types";
