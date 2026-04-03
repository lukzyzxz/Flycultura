import Footer from "@/components/Footer";
import { useI18n } from "@/lib/i18n";
import { FileText } from "lucide-react";

const Terms = () => {
  const { locale } = useI18n();
  const isPt = locale === "pt";

  const sections = isPt
    ? [
        { title: "Aceitação dos Termos", text: "Ao utilizar a FlyCultura, você concorda com estes Termos de Uso. A plataforma é destinada a maiores de 18 anos ou menores acompanhados de responsável legal." },
        { title: "Reservas e Pagamentos", text: "Todas as reservas são confirmadas após a aprovação do pagamento. Os preços exibidos estão sujeitos a disponibilidade e podem variar até a finalização da compra. O parcelamento está sujeito à análise de crédito." },
        { title: "Cancelamento e Reembolso", text: "Cancelamentos realizados até 30 dias antes do evento são reembolsados integralmente. Cancelamentos entre 15 e 29 dias recebem reembolso de 50%. Cancelamentos com menos de 15 dias não são reembolsáveis." },
        { title: "Responsabilidade", text: "A FlyCultura atua como intermediária entre viajantes e prestadores de serviço. Não nos responsabilizamos por alterações de voo, cancelamentos por parte de companhias aéreas ou eventos de força maior." },
        { title: "Propriedade Intelectual", text: "Todo o conteúdo da plataforma — textos, imagens, logotipos e código — é propriedade da FlyCultura e não pode ser reproduzido sem autorização prévia." },
      ]
    : [
        { title: "Acceptance of Terms", text: "By using FlyCultura, you agree to these Terms of Use. The platform is intended for users 18 years or older, or minors accompanied by a legal guardian." },
        { title: "Bookings and Payments", text: "All bookings are confirmed after payment approval. Displayed prices are subject to availability and may change until purchase is completed. Installment plans are subject to credit analysis." },
        { title: "Cancellation and Refund", text: "Cancellations made up to 30 days before the event receive a full refund. Cancellations between 15 and 29 days receive a 50% refund. Cancellations with less than 15 days are non-refundable." },
        { title: "Liability", text: "FlyCultura acts as an intermediary between travelers and service providers. We are not responsible for flight changes, airline cancellations or force majeure events." },
        { title: "Intellectual Property", text: "All platform content — texts, images, logos and code — is the property of FlyCultura and cannot be reproduced without prior authorization." },
      ];

  return (
    <div className="min-h-screen">
      <div className="hero-gradient py-16 text-center">
        <div className="container">
          <FileText className="h-8 w-8 text-accent mx-auto mb-3" />
          <h1 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-3">
            {isPt ? "Termos de Uso" : "Terms of Use"}
          </h1>
        </div>
      </div>

      <div className="container py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="font-display text-xl font-bold text-foreground mb-2">{s.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{s.text}</p>
            </div>
          ))}
          <p className="text-xs text-muted-foreground pt-4 border-t border-border">
            {isPt ? "Última atualização: Abril 2026" : "Last updated: April 2026"}
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Terms;
