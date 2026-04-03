import Footer from "@/components/Footer";
import { useI18n } from "@/lib/i18n";
import { HelpCircle, Mail, Phone, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const HelpCenter = () => {
  const { locale } = useI18n();
  const isPt = locale === "pt";

  const faqs = isPt
    ? [
        { q: "Como cancelo minha reserva?", a: "Você pode cancelar gratuitamente até 30 dias antes da data do evento. Acesse seu perfil e clique em 'Minhas Reservas'." },
        { q: "Os voos estão inclusos no pacote?", a: "Sim! Todos os pacotes de eventos incluem voo ida e volta, hospedagem, ingressos e transfer." },
        { q: "Posso parcelar o pagamento?", a: "Sim, oferecemos parcelamento em até 12x sem juros no cartão de crédito." },
        { q: "Qual a política de bagagem?", a: "A franquia de bagagem depende da companhia aérea selecionada. As informações aparecem ao escolher o voo." },
        { q: "Como funciona o seguro viagem?", a: "O seguro viagem é incluso na maioria dos pacotes e cobre emergências médicas, extravio de bagagem e cancelamentos." },
      ]
    : [
        { q: "How do I cancel my booking?", a: "You can cancel for free up to 30 days before the event date. Go to your profile and click 'My Bookings'." },
        { q: "Are flights included in the package?", a: "Yes! All event packages include round-trip flights, accommodation, tickets and airport transfer." },
        { q: "Can I pay in installments?", a: "Yes, we offer up to 12 interest-free installments on credit cards." },
        { q: "What's the baggage policy?", a: "Baggage allowance depends on the selected airline. Details appear when choosing your flight." },
        { q: "How does travel insurance work?", a: "Travel insurance is included in most packages and covers medical emergencies, lost luggage and cancellations." },
      ];

  return (
    <div className="min-h-screen">
      <div className="hero-gradient py-16 text-center">
        <div className="container">
          <HelpCircle className="h-8 w-8 text-accent mx-auto mb-3" />
          <h1 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-3">
            {isPt ? "Central de Ajuda" : "Help Center"}
          </h1>
          <p className="text-primary-foreground/70 max-w-lg mx-auto">
            {isPt ? "Encontre respostas para as perguntas mais frequentes." : "Find answers to the most frequently asked questions."}
          </p>
        </div>
      </div>

      <div className="container py-12">
        <div className="max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="font-display text-2xl font-bold text-foreground mb-6">
            {isPt ? "Perguntas Frequentes" : "FAQ"}
          </h2>
          {faqs.map((faq, i) => (
            <motion.details
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-xl p-5 card-shadow group"
            >
              <summary className="font-semibold text-card-foreground cursor-pointer list-none flex items-center justify-between">
                {faq.q}
                <span className="text-muted-foreground group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
            </motion.details>
          ))}
        </div>

        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-foreground mb-6 text-center">
            {isPt ? "Fale Conosco" : "Contact Us"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Mail, label: isPt ? "E-mail" : "Email", value: "suporte@flycultura.com" },
              { icon: Phone, label: isPt ? "Telefone" : "Phone", value: "+55 11 4000-1234" },
              { icon: MessageCircle, label: "WhatsApp", value: "+55 11 99000-1234" },
            ].map((c) => (
              <div key={c.label} className="bg-card rounded-xl p-6 card-shadow text-center">
                <c.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="font-semibold text-card-foreground">{c.label}</p>
                <p className="text-sm text-muted-foreground">{c.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HelpCenter;
