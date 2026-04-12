import type { FC } from 'npm:react@18.3.1'
import { PurchaseConfirmationEmail } from './purchase-confirmation.tsx'

export interface TemplateEntry {
  component: FC<any>
  subject: string | ((data: any) => string)
  displayName?: string
  previewData?: Record<string, any>
  to?: string
}

export const TEMPLATES: Record<string, TemplateEntry> = {
  'purchase-confirmation': {
    component: PurchaseConfirmationEmail,
    subject: (data: any) => `✈️ Confirmação de Compra #${data.orderId || 'FC0000'}`,
    displayName: 'Confirmação de Compra',
    previewData: {
      customerName: 'João Silva',
      orderId: 'FC2025-0712',
      items: [
        { name: 'Olimpíadas 2028 - Los Angeles', quantity: 1, price: 15999 },
        { name: 'Copa do Mundo 2026 - México', quantity: 2, price: 12499 },
      ],
      totalPrice: 40997,
      purchaseDate: '12/04/2026',
    },
  },
}
