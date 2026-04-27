// FlyCultura — Pricing & Commission helpers
// MVP: preço final exibido já inclui a comissão (10–20%) embutida.
// A comissão é PROPORCIONAL ao preço: tickets baixos ~10%, tickets altos ~20%.
// Usado apenas para exibição (badge informativo) — o preço bruto já é o final.

export function getCommissionRate(finalPriceBRL: number): number {
  // Faixas (R$): <=2.000 → 10%; >=30.000 → 20%; interpolação linear no meio.
  const min = 2000;
  const max = 30000;
  if (finalPriceBRL <= min) return 0.10;
  if (finalPriceBRL >= max) return 0.20;
  const t = (finalPriceBRL - min) / (max - min);
  return 0.10 + t * 0.10;
}

export function getCommissionAmount(finalPriceBRL: number): number {
  // Comissão embutida: parte do preço final que corresponde à taxa.
  const rate = getCommissionRate(finalPriceBRL);
  return Math.round(finalPriceBRL * rate);
}

export function getPartnerPrice(finalPriceBRL: number): number {
  return finalPriceBRL - getCommissionAmount(finalPriceBRL);
}

export function formatBRL(value: number): string {
  return `R$ ${Math.round(value).toLocaleString("pt-BR")}`;
}

export function commissionLabel(locale: "pt" | "en", finalPriceBRL: number): string {
  const pct = Math.round(getCommissionRate(finalPriceBRL) * 100);
  return locale === "pt"
    ? `Inclui taxa de serviço (~${pct}%)`
    : `Service fee included (~${pct}%)`;
}
