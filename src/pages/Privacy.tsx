import Footer from "@/components/Footer";
import { useI18n } from "@/lib/i18n";
import { Shield } from "lucide-react";

const Privacy = () => {
  const { locale } = useI18n();
  const isPt = locale === "pt";

  const sections = isPt
    ? [
        { title: "Coleta de Dados", text: "Coletamos apenas informações necessárias para processar suas reservas: nome, e-mail, telefone e dados de pagamento. Seus dados pessoais são protegidos com criptografia de ponta a ponta." },
        { title: "Uso dos Dados", text: "Utilizamos seus dados exclusivamente para processar reservas, enviar confirmações e melhorar sua experiência na plataforma. Nunca vendemos ou compartilhamos dados com terceiros para fins de marketing." },
        { title: "Cookies", text: "Utilizamos cookies essenciais para o funcionamento do site e cookies de preferência para lembrar idioma e tema escolhidos. Você pode desativar cookies não essenciais nas configurações do navegador." },
        { title: "Seus Direitos", text: "De acordo com a LGPD, você tem o direito de acessar, corrigir, excluir ou exportar seus dados pessoais a qualquer momento. Entre em contato com nosso suporte para exercer seus direitos." },
      ]
    : [
        { title: "Data Collection", text: "We only collect information necessary to process your bookings: name, email, phone and payment details. Your personal data is protected with end-to-end encryption." },
        { title: "Data Usage", text: "We use your data exclusively to process bookings, send confirmations and improve your platform experience. We never sell or share data with third parties for marketing purposes." },
        { title: "Cookies", text: "We use essential cookies for site functionality and preference cookies to remember your language and theme choices. You can disable non-essential cookies in your browser settings." },
        { title: "Your Rights", text: "In accordance with data protection laws, you have the right to access, correct, delete or export your personal data at any time. Contact our support team to exercise your rights." },
      ];

  return (
    <div className="min-h-screen">
      <div className="hero-gradient py-16 text-center">
        <div className="container">
          <Shield className="h-8 w-8 text-accent mx-auto mb-3" />
          <h1 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-3">
            {isPt ? "Política de Privacidade" : "Privacy Policy"}
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

export default Privacy;
