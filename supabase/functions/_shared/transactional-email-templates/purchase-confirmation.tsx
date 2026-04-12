/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Row,
  Column,
  Img,
} from 'npm:@react-email/components@0.0.22'

interface OrderItem {
  name: string
  quantity: number
  price: number
}

interface PurchaseConfirmationProps {
  customerName?: string
  orderId?: string
  items?: OrderItem[]
  totalPrice?: number
  purchaseDate?: string
}

export const PurchaseConfirmationEmail: React.FC<PurchaseConfirmationProps> = ({
  customerName = 'Viajante',
  orderId = 'FC0000',
  items = [],
  totalPrice = 0,
  purchaseDate = new Date().toLocaleDateString('pt-BR'),
}) => {
  const primary = '#3B82F6'
  const primaryDark = '#1E3A5F'
  const foreground = '#1B2559'
  const muted = '#6B7280'
  const bg = '#F8FAFC'

  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: bg, fontFamily: "'Plus Jakarta Sans', Arial, sans-serif", margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff' }}>
          {/* Header */}
          <Section style={{ backgroundColor: primaryDark, padding: '32px 40px', textAlign: 'center' as const }}>
            <Text style={{ color: '#ffffff', fontSize: '24px', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>
              ✈️ FlyCultura
            </Text>
            <Text style={{ color: '#93C5FD', fontSize: '13px', margin: '4px 0 0' }}>
              Sua viagem começa aqui
            </Text>
          </Section>

          {/* Success Banner */}
          <Section style={{ backgroundColor: '#ECFDF5', padding: '20px 40px', textAlign: 'center' as const }}>
            <Text style={{ fontSize: '40px', margin: '0 0 8px' }}>✅</Text>
            <Heading as="h1" style={{ color: '#065F46', fontSize: '22px', fontWeight: 700, margin: 0 }}>
              Compra Confirmada!
            </Heading>
            <Text style={{ color: '#047857', fontSize: '14px', margin: '4px 0 0' }}>
              Seu pagamento foi processado com sucesso.
            </Text>
          </Section>

          {/* Ticket-style Order Info */}
          <Section style={{ padding: '32px 40px 16px' }}>
            <Text style={{ color: muted, fontSize: '12px', textTransform: 'uppercase' as const, letterSpacing: '1px', margin: '0 0 4px' }}>
              Olá, {customerName}!
            </Text>
            <Text style={{ color: foreground, fontSize: '15px', lineHeight: '1.6', margin: '0 0 24px' }}>
              Obrigado pela sua compra! Aqui está o seu recibo e ticket digital.
            </Text>

            {/* Order Details Card */}
            <Section style={{ border: `2px dashed ${primary}`, borderRadius: '12px', padding: '24px', backgroundColor: '#F0F7FF' }}>
              <Row>
                <Column style={{ width: '50%' }}>
                  <Text style={{ color: muted, fontSize: '11px', textTransform: 'uppercase' as const, letterSpacing: '1px', margin: '0 0 2px' }}>
                    Nº do Pedido
                  </Text>
                  <Text style={{ color: primary, fontSize: '18px', fontWeight: 700, margin: 0 }}>
                    {orderId}
                  </Text>
                </Column>
                <Column style={{ width: '50%', textAlign: 'right' as const }}>
                  <Text style={{ color: muted, fontSize: '11px', textTransform: 'uppercase' as const, letterSpacing: '1px', margin: '0 0 2px' }}>
                    Data da Compra
                  </Text>
                  <Text style={{ color: foreground, fontSize: '16px', fontWeight: 600, margin: 0 }}>
                    {purchaseDate}
                  </Text>
                </Column>
              </Row>

              <Hr style={{ borderColor: '#BFDBFE', margin: '16px 0' }} />

              <Text style={{ color: muted, fontSize: '11px', textTransform: 'uppercase' as const, letterSpacing: '1px', margin: '0 0 2px' }}>
                Status
              </Text>
              <Text style={{ color: '#059669', fontSize: '14px', fontWeight: 700, margin: 0 }}>
                ● Confirmado
              </Text>
            </Section>
          </Section>

          {/* Items Table */}
          <Section style={{ padding: '16px 40px 8px' }}>
            <Heading as="h2" style={{ color: foreground, fontSize: '16px', fontWeight: 700, margin: '0 0 12px' }}>
              🎫 Itens do Pedido
            </Heading>

            {items.map((item, idx) => (
              <Section key={idx} style={{ padding: '12px 16px', backgroundColor: idx % 2 === 0 ? '#F9FAFB' : '#ffffff', borderRadius: '8px', marginBottom: '4px' }}>
                <Row>
                  <Column style={{ width: '60%' }}>
                    <Text style={{ color: foreground, fontSize: '14px', fontWeight: 600, margin: 0 }}>
                      {item.name}
                    </Text>
                    <Text style={{ color: muted, fontSize: '12px', margin: '2px 0 0' }}>
                      Qtd: {item.quantity}
                    </Text>
                  </Column>
                  <Column style={{ width: '40%', textAlign: 'right' as const }}>
                    <Text style={{ color: primary, fontSize: '15px', fontWeight: 700, margin: 0 }}>
                      R$ {(item.price * item.quantity).toLocaleString('pt-BR')}
                    </Text>
                  </Column>
                </Row>
              </Section>
            ))}
          </Section>

          {/* Total */}
          <Section style={{ padding: '8px 40px 24px' }}>
            <Hr style={{ borderColor: '#E5E7EB', margin: '0 0 16px' }} />
            <Row>
              <Column style={{ width: '60%' }}>
                <Text style={{ color: foreground, fontSize: '16px', fontWeight: 700, margin: 0 }}>
                  Total Pago
                </Text>
              </Column>
              <Column style={{ width: '40%', textAlign: 'right' as const }}>
                <Text style={{ color: primaryDark, fontSize: '22px', fontWeight: 800, margin: 0 }}>
                  R$ {totalPrice.toLocaleString('pt-BR')}
                </Text>
              </Column>
            </Row>
          </Section>

          {/* Ticket Stub */}
          <Section style={{ margin: '0 40px 24px', backgroundColor: primaryDark, borderRadius: '12px', padding: '24px', textAlign: 'center' as const }}>
            <Text style={{ color: '#93C5FD', fontSize: '11px', textTransform: 'uppercase' as const, letterSpacing: '2px', margin: '0 0 8px' }}>
              Ticket Digital
            </Text>
            <Text style={{ color: '#ffffff', fontSize: '28px', fontWeight: 800, margin: '0 0 4px', letterSpacing: '4px' }}>
              {orderId}
            </Text>
            <Text style={{ color: '#93C5FD', fontSize: '12px', margin: 0 }}>
              Apresente este código no check-in
            </Text>
          </Section>

          {/* Footer */}
          <Section style={{ backgroundColor: '#F1F5F9', padding: '24px 40px', textAlign: 'center' as const }}>
            <Text style={{ color: muted, fontSize: '12px', margin: '0 0 4px' }}>
              Este é um email automático. Dúvidas? Entre em contato pelo nosso site.
            </Text>
            <Text style={{ color: muted, fontSize: '11px', margin: 0 }}>
              © 2026 FlyCultura · Todos os direitos reservados
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
