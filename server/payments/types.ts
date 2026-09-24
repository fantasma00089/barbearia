/**
 * Contrato para provedores de pagamento (Pix).
 * Nenhum provedor real está implementado ainda — veja README.md nesta pasta.
 */
export interface CreatePixChargeInput {
  bookingId: string;
  bookingCode: string;
  amountCents: number;
  customerName: string;
  customerPhone: string;
  /** Minutos até o QR Code expirar */
  expiresInMin: number;
}

export interface PixCharge {
  provider: string;
  externalId: string;
  status: "PENDING" | "PAID" | "EXPIRED" | "FAILED";
  pixCopyPaste: string;
  qrCodeUrl?: string;
  expiresAt: Date;
}

export interface WebhookResult {
  externalId: string;
  status: PixCharge["status"] | "REFUNDED";
  paidAt?: Date;
  raw: unknown;
}

export interface PaymentProvider {
  readonly name: string;
  createPixCharge(input: CreatePixChargeInput): Promise<PixCharge>;
  getCharge(externalId: string): Promise<PixCharge>;
  /** Valida assinatura e traduz o payload do webhook do provedor. */
  parseWebhook(request: Request): Promise<WebhookResult>;
  refund(externalId: string, amountCents?: number): Promise<void>;
}
