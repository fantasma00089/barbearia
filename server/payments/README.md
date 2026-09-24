# Pagamentos (Pix) — arquitetura preparada

O agendamento funciona hoje com **pagamento presencial**. A estrutura para Pix já existe:

| Peça | Onde | Estado |
| --- | --- | --- |
| Model `Payment` (valor, status, `externalId`, copia-e-cola, QR, expiração) | `prisma/schema.prisma` | ✅ criado |
| Campo `Booking.paymentStatus` (`NOT_REQUIRED` por padrão) | `prisma/schema.prisma` | ✅ criado |
| Contrato `PaymentProvider` | `server/payments/types.ts` | ✅ definido |
| Seleção do provedor por `PAYMENT_PROVIDER` | `server/payments/index.ts` | ✅ (retorna `null`) |
| Implementação de um provedor (Mercado Pago, Efí, Asaas…) | `server/payments/<provedor>.ts` | ⏳ a fazer |
| Webhook | `app/api/payments/webhook/route.ts` | ⏳ a fazer |
| Etapa "Pagamento" no wizard | `components/booking/` | ⏳ a fazer |

## Fluxo sugerido

1. Após `createBooking`, se `paymentsEnabled()`, marcar `paymentStatus = "PENDING"` e chamar
   `provider.createPixCharge(...)`, gravando um `Payment`.
2. Exibir o QR Code / copia-e-cola na tela de sucesso.
3. No webhook, validar a assinatura (`parseWebhook`), atualizar `Payment.status` e
   `Booking.paymentStatus`; se `autoConfirm` estiver desligado, confirmar a reserva.
4. Reservas com Pix expirado podem ser canceladas por um job agendado.
